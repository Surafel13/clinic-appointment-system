/**
 * Secure user seed: Super Admin (Role.ADMIN) + Receptionist (Role.RECEPTIONIST)
 *
 * - No credentials in source code: everything comes from environment variables.
 * - Passwords are hashed with bcrypt (cost 12 by default).
 * - Idempotent: re-running does NOT overwrite existing passwords unless
 *   SEED_RESET_PASSWORDS=true is set explicitly.
 * - Refuses to run in production unless SEED_ALLOW_PRODUCTION=true.
 * - Never prints passwords or hashes.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import prisma from "../src/shared/prisma";

interface SeedUser {
  label: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

const BCRYPT_ROUNDS = Math.max(12, Number(process.env.BCRYPT_ROUNDS) || 12);
const RESET_PASSWORDS = process.env.SEED_RESET_PASSWORDS === "true";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadSeedUsers(): SeedUser[] {
  const users: SeedUser[] = [
    {
      label: "Super Admin",
      fullName: process.env.SEED_ADMIN_NAME?.trim() || "System Administrator",
      email: requireEnv("SEED_ADMIN_EMAIL").toLowerCase(),
      password: requireEnv("SEED_ADMIN_PASSWORD"),
      role: Role.ADMIN,
    },
    {
      label: "Receptionist",
      fullName:
        process.env.SEED_RECEPTIONIST_NAME?.trim() || "Clinic Receptionist",
      email: requireEnv("SEED_RECEPTIONIST_EMAIL").toLowerCase(),
      password: requireEnv("SEED_RECEPTIONIST_PASSWORD"),
      role: Role.RECEPTIONIST,
    },
  ];

  for (const u of users) {
    if (!EMAIL_REGEX.test(u.email)) {
      throw new Error(`${u.label} email is not a valid email address.`);
    }
  }

  if (users[0].email === users[1].email) {
    throw new Error(
      "Admin and receptionist must use different email addresses.",
    );
  }
  if (users[0].password === users[1].password) {
    throw new Error("Admin and receptionist must use different passwords.");
  }

  return users;
}

async function seedUser(user: SeedUser): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
    await prisma.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        password: hashed,
        role: user.role,
        isActive: true,
      },
    });
    console.log(`✅ ${user.label} created: ${user.email}`);
    return;
  }

  const data: {
    fullName: string;
    role: Role;
    isActive: boolean;
    password?: string;
  } = {
    fullName: user.fullName,
    role: user.role,
    isActive: true,
  };

  if (RESET_PASSWORDS) {
    data.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
  }

  await prisma.user.update({ where: { id: existing.id }, data });
  console.log(
    `♻️  ${user.label} already exists: ${user.email} ` +
      (RESET_PASSWORDS ? "(password reset)" : "(password left unchanged)"),
  );
}

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SEED_ALLOW_PRODUCTION !== "true"
  ) {
    throw new Error(
      "Refusing to seed in production. Set SEED_ALLOW_PRODUCTION=true if this is intentional.",
    );
  }

  console.log("🌱 Seeding users...");
  const users = loadSeedUsers();

  for (const user of users) {
    await seedUser(user);
  }

  console.log("🎉 User seeding complete.");
}

main()
  .catch((error: any) => {
    console.error("❌ Seed failed:", error?.message ?? "Unknown error");
    if (error?.code) console.error("Code:", error.code);
    if (error?.meta) console.error("Meta:", error.meta);
    if (error?.cause) console.error("Cause:", error.cause);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
