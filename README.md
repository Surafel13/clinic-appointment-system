<div align="center">

# NexaCare

### Clinic Appointment Management System

A modern full-stack clinic management platform for organizing patients, doctors, services, and appointments.

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

<br />

[Features](#features) · [Technology Stack](#technology-stack) · [Installation](#getting-started) · [API Reference](#api-reference)

</div>

---

## Overview

NexaCare is a full-stack clinic appointment management system designed to simplify daily clinic operations through a centralized digital platform.

The application provides administrators and receptionists with tools to manage medical staff, patient records, clinic services, and appointment schedules. It incorporates secure authentication, role-based access control, and backend business rule enforcement to ensure reliable appointment management.

### Project Objectives

- Digitize clinic appointment scheduling and management.
- Centralize patient, doctor, and service information.
- Prevent scheduling conflicts and invalid appointments.
- Enforce clinic operating hours and appointment policies.
- Provide secure, role-based access to application features.
- Improve the efficiency of daily clinic operations.

---

## Features

### Authentication and Authorization

- Secure login using email and password.
- JWT-based authentication.
- Password hashing with bcryptjs.
- Role-based access control.
- Protected application routes and API endpoints.
- Administrator-controlled receptionist accounts.

### Doctor Management

- Register and update doctor information.
- Manage doctor specialties and contact details.
- Activate and deactivate doctors.
- Search and filter doctor records.
- Assign doctors to appointments.

### Patient Management

- Register new patients.
- Search existing patient records.
- Update patient information.
- Manage patient contact and demographic details.
- Associate patients with their appointments.

### Service Management

- Create and update clinic services.
- Configure service prices and durations.
- Activate and deactivate services.
- Manage available services for appointment booking.

### Appointment Management

- Schedule appointments for registered patients.
- Assign doctors and clinic services.
- Reschedule existing appointments.
- Detect overlapping doctor appointments.
- Check in patients.
- Complete or cancel appointments.
- Filter and search appointment records.
- Automatically release cancelled appointment time slots.

### Dashboard and Analytics

- View clinic operational statistics.
- Monitor appointment activity.
- Track appointment statuses.
- Access an overview of clinic operations.

---

## User Roles

The application supports two primary user roles.

| Role | Responsibilities |
|---|---|
| Administrator | Manages staff accounts, doctors, services, patients, appointments, and clinic operations. |
| Receptionist | Registers patients, searches records, schedules appointments, checks in patients, and manages daily appointment workflows. |

Doctors are managed as clinic resources and assigned to appointments. They do not require application login accounts.

---

## Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | Backend web framework |
| TypeScript | Type-safe development |
| Prisma ORM 7 | Database access and ORM |
| PostgreSQL | Relational database |
| Neon PostgreSQL | Cloud database hosting |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Winston | Application logging |
| Morgan | HTTP request logging |
| CORS | Cross-origin resource sharing |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Frontend framework |
| Vite | Development server and build tool |
| TypeScript | Type-safe development |
| Redux Toolkit | Global state management |
| TanStack React Query v5 | Server state management |
| React Router | Application routing |
| React Hook Form | Form management |
| Zod | Form validation |
| Tailwind CSS v4 | Styling |
| Radix UI | Accessible UI primitives |
| Lucide React | Icon library |

---

## Appointment Management Rules

NexaCare enforces appointment scheduling rules on the backend to maintain consistency and prevent invalid bookings.

### Clinic Operating Hours

| Session | Operating Time |
|---|---|
| Morning | 09:00 AM – 12:00 PM |
| Lunch Break | 12:00 PM – 01:00 PM |
| Afternoon | 01:00 PM – 05:00 PM |

Appointments must fall within clinic operating hours.

The system prevents appointments from being scheduled during lunch or spanning across the lunch break.

### Scheduling Validation

- Appointment end time must be later than start time.
- Past appointments cannot be scheduled.
- Inactive doctors cannot receive new appointments.
- Inactive services cannot be booked.
- A doctor cannot have overlapping appointments.
- Cancelled appointments release their reserved time slots.
- Completed appointments become read-only.

### Appointment Lifecycle

```text
                 SCHEDULED
                     |
          +----------+----------+
          |          |          |
          v          v          v
      CHECKED_IN  CANCELLED  NO_SHOW
          |
          v
      COMPLETED
```

| Status | Description |
|---|---|
| `SCHEDULED` | Appointment has been successfully booked. |
| `CHECKED_IN` | Patient has arrived at the clinic. |
| `COMPLETED` | Appointment has been completed. |
| `CANCELLED` | Appointment has been cancelled and its time slot released. |
| `NO_SHOW` | Patient did not attend the scheduled appointment. |

---

## System Architecture

NexaCare follows a client-server architecture with a React frontend, Express REST API, Prisma ORM, and PostgreSQL database.

```text
+----------------------------------+
|             FRONTEND             |
|                                  |
|        React + TypeScript        |
|                                  |
|  Redux Toolkit | React Query     |
|  React Router  | Tailwind CSS    |
+----------------+-----------------+
                 |
                 | REST API / JWT
                 |
+----------------v-----------------+
|              BACKEND             |
|                                  |
|       Node.js + Express.js       |
|                                  |
|  Authentication & Authorization  |
|  Controllers & Business Logic    |
|  Zod Validation                  |
|  Error Handling & Logging        |
|                                  |
|            Prisma ORM            |
+----------------+-----------------+
                 |
                 |
+----------------v-----------------+
|             DATABASE             |
|                                  |
|             PostgreSQL           |
|                                  |
|  Users | Doctors | Patients      |
|  Services | Appointments         |
+----------------------------------+
```

---

## Database Structure

The application uses PostgreSQL with Prisma ORM to manage relational data.

### Main Entities

| Entity | Description |
|---|---|
| `User` | Stores administrator and receptionist accounts. |
| `Doctor` | Stores doctor profiles, specialties, and active status. |
| `Patient` | Stores patient demographic and contact information. |
| `Service` | Stores clinic services, prices, durations, and availability. |
| `Appointment` | Connects patients, doctors, services, schedules, and appointment statuses. |

### Entity Relationships

```text
User
 ├── Administrator
 └── Receptionist

Patient ─────────────┐
                     |
Doctor ──────────────+── Appointment
                     |
Service ─────────────┘
```

---

## Getting Started

Follow these instructions to run NexaCare locally.

### Prerequisites

Make sure you have installed:

- Node.js (v18 or v20 recommended by the project configuration)
- npm (v9 or later)
- PostgreSQL or a Neon PostgreSQL database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Surafel13/NexaCare_Clinic_Appointment_System.git

cd NexaCare_Clinic_Appointment_System
```

### 2. Install Backend Dependencies

```bash
cd Backend

npm install
```

### 3. Install Frontend Dependencies

Open another terminal from the project root:

```bash
cd frontend

npm install
```

---

## Environment Configuration

Configure the environment variables before starting the application.

### Backend Environment

Create a `.env` file inside the `Backend` directory:

```env
DATABASE_URL="your_postgresql_connection_string"

PORT=5000

JWT_SECRET="your_secure_jwt_secret"

JWT_EXPIRES_IN="7d"
```

For Neon PostgreSQL, replace the local database connection string with your Neon connection string.

### Frontend Environment

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL="http://localhost:5000/api"
```

**Important:**

- Never commit `.env` files to GitHub.
- Use strong, unique JWT secrets.
- Keep database credentials private.
- Configure production environment variables separately.

---

## Running the Application

### 1. Initialize the Database

From the `Backend` directory:

```bash
npm run prisma:generate

npx prisma db push

npm run prisma:seed
```

These commands:

1. Generate the Prisma Client.
2. Synchronize the Prisma schema with the database.
3. Populate the database with initial application data.

### 2. Start the Backend Server

From the `Backend` directory:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/
```

### 3. Start the Frontend Application

Open another terminal:

```bash
cd frontend

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Reference

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate user and receive JWT. |
| GET | `/auth/me` | Get authenticated user profile. |

### User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List staff accounts. |
| POST | `/users` | Create receptionist account. |
| PUT | `/users/:id` | Update receptionist account. |
| PATCH | `/users/:id/activate` | Activate receptionist account. |
| PATCH | `/users/:id/deactivate` | Deactivate receptionist account. |

### Doctor Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/doctors` | List doctors with filtering and pagination. |
| POST | `/doctors` | Register a doctor. |
| PUT | `/doctors/:id` | Update doctor information. |
| PATCH | `/doctors/:id/status` | Update doctor status. |

### Patient Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients` | List and search patients. |
| POST | `/patients` | Register a patient. |
| PUT | `/patients/:id` | Update patient information. |

### Service Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/services` | List clinic services. |
| POST | `/services` | Create a clinic service. |
| PUT | `/services/:id` | Update clinic service. |

### Appointment Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/appointments` | List appointments with filtering. |
| POST | `/appointments` | Schedule an appointment. |
| PUT | `/appointments/:id` | Update or reschedule appointment. |
| PATCH | `/appointments/:id/check-in` | Check in a patient. |
| PATCH | `/appointments/:id/complete` | Complete an appointment. |
| PATCH | `/appointments/:id/cancel` | Cancel an appointment. |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Retrieve clinic dashboard statistics. |

Protected endpoints require a valid JWT token. Access permissions are enforced by backend authorization middleware.

---

## Testing

Run the backend automated tests:

```bash
cd Backend

npm test
```

The test suite covers:

- Appointment business rules.
- Clinic operating hours.
- Lunch break restrictions.
- Doctor scheduling conflicts.
- Password hashing.
- Appointment lifecycle transitions.

### Production Build Validation

Backend:

```bash
cd Backend

npm run build
```

Frontend:

```bash
cd frontend

npm run build
```

Both builds should complete successfully before deployment.

---

## Security

NexaCare incorporates several security practices:

- JWT-based authentication.
- bcryptjs password hashing.
- Role-based authorization.
- Zod request validation.
- Protected API endpoints.
- CORS configuration.
- Centralized error handling.
- Application and HTTP request logging.
- Backend enforcement of appointment business rules.

Sensitive environment variables and database credentials should never be committed to the repository.

---

## Author

**Surafel Tesfaye**

Software Engineer | Full-Stack Developer

- GitHub: [Surafel13](https://github.com/Surafel13)
- Portfolio: [Personal Portfolio](https://my-portfolio-beta-ruddy-17.vercel.app/)

---

<div align="center">

### NexaCare

*Simplifying clinic operations through technology.*

Built with care by **Surafel Tesfaye**.

</div>
