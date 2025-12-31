#  TaskFlow – Full Stack Intern Assignment

A modern, scalable full-stack web application featuring Authentication, a Dashboard, and Task Management.  
Built using React (Vite) on the frontend and Node.js (Express) on the backend.

---

##  Overview

TaskFlow is a Proof of Concept (PoC) project demonstrating a complete full-stack workflow with secure authentication, protected routes, and CRUD functionality.

The project emphasizes clean architecture, scalability, and developer portability.

---

## ✨ Features

###  Authentication
- Secure user registration and login
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing
- Protected routes for authorized users only

###  Dashboard
- Displays user profile details:
  - Username
  - Join Date
- Real-time task progress tracking

###  Task Management
- Full CRUD operations:
  - Create tasks
  - Read tasks
  - Toggle task completion
  - Delete tasks

### 🔍 Search & Filter
- Real-time task filtering using a responsive search bar

###  UI / UX
- Modern glassmorphism design
- Smooth animations
- Fully responsive layout
- Built with pure CSS and React

---

##  Tech Stack

### Frontend
- React.js
- Vite
- Lucide-React

### Backend
- Node.js
- Express.js

### Security
- JWT (Authentication)
- bcrypt (Password Hashing)
- CORS

### Database
- File-based JSON storage (NoSQL simulation)

---

##  Installation & Setup Guide

###  Prerequisites
- Node.js installed on your system

---

## Backend Setup

The backend runs on port 5000.

Steps:
- Navigate to the backend folder: cd backend
- Install dependencies: npm install
- Start the server: node server.js

Expected output:
Backend running on port 5000

---

##  Frontend Setup

The frontend runs on port 5173.

Steps:
- Navigate to the frontend folder: cd frontend
- Install dependencies: npm install
- Start the dev server: npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).

---

##  Architectural Decisions

###  Database Strategy (Scalability Note)

A file-based JSON database (backend/database.json) is used to ensure maximum portability.

Why this approach?
- No external database setup required
- Runs instantly on any machine
- Ideal for evaluation and PoC purposes

Scalability:
- Backend structure is modular
- readDB and writeDB helper functions can be replaced with MongoDB/Mongoose
- No changes required to API routes or frontend logic

---

##  API Endpoints

Method | Endpoint | Description | Protected
POST | /api/register | Register a new user | No
POST | /api/login | Login and receive JWT | No
GET | /api/profile | Get logged-in user details | Yes
GET | /api/tasks | Fetch all user tasks | Yes
POST | /api/tasks | Create a new task | Yes
PUT | /api/tasks/:id | Update or toggle task status | Yes
DELETE | /api/tasks/:id | Delete a task | Yes

---

##  Proof of Concept Notes

- Designed as a scalable PoC
- Demonstrates real-world authentication and CRUD patterns
- Easily extendable to production-grade architecture

---

##  Final Notes

This project showcases:
- End-to-end full-stack development
- Secure authentication flow
- Clean and modern UI/UX
- Scalable backend architecture

