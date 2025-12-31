#  TaskFlow – 

A modern, scalable web application featuring Authentication, a Dashboard, and Task Management.  
Built with React (Vite) and Node.js.

---

##  Overview

This project is a Proof of Concept (PoC) for a scalable web application.  
It demonstrates a complete full-stack integration with secure authentication, protected routes, and CRUD operations.

---

##  Live Features

**Authentication**  
Secure Login and Registration using JWT (JSON Web Tokens) and bcrypt for password hashing.

**Dashboard**  
User profile display (Join Date, Username) and real-time task progress tracking.

**Task Management**  
Full CRUD operations (Create, Read, Update/Toggle, Delete).

**Search & Filter**  
Real-time filtering of tasks via a responsive search bar.

**UI / UX**  
Modern Glassmorphism aesthetics, smooth animations, and responsive design using pure CSS and React.

---

##  Tech Stack

**Frontend**  
React.js, Vite, Lucide-React (Icons)

**Backend**  
Node.js, Express.js

**Security**  
JWT (Authentication), Bcrypt (Password Hashing), CORS

**Database**  
Portable JSON-based File System (Simulating NoSQL)

---

##  Installation & Setup Guide

Follow these steps to run the project locally.

---

##  Prerequisites

Node.js installed on your machine.

---

##  Backend Setup

The backend runs on port 5000 and handles all API requests.

Steps to run the backend:
- Navigate to the backend folder: `cd backend`
- Install dependencies (Express, CORS, Bcrypt, JWT): `npm install`
- Start the server: `node server.js`

You should see:  
Backend running on port 5000

---

##  Frontend Setup

Open a new terminal window.  
The frontend runs on port 5173.

Steps to run the frontend:
- Navigate to the frontend folder: `cd frontend`
- Install dependencies (React, Vite, Lucide): `npm install`
- Start the development server: `npm run dev`

Click the link shown in the terminal (usually http://localhost:5173) to view the app.

---

##  Architectural Decisions

### Database Strategy (Scalability Note)

For the purpose of this assignment and to ensure maximum portability for the evaluator, a File-Based JSON Database (`backend/database.json`) is used.

**Why this approach?**  
It allows the application to run immediately on any machine without requiring a local MongoDB service installation or cloud configuration.

**Scalability**  
The code structure is modular. In a production environment, the `readDB` and `writeDB` helper functions in `server.js` can be easily replaced with Mongoose/MongoDB calls without changing the API logic or frontend.

---

## API Endpoints

| Method | Endpoint | Description | Protected |
|------|----------|------------|-----------|
| POST | /api/register | Register a new user | No |
| POST | /api/login | Login and receive JWT | No |
| GET | /api/profile | Get logged-in user details | Yes (Token) |
| GET | /api/tasks | Get all tasks for user | Yes (Token) |
| POST | /api/tasks | Create a new task | Yes (Token) |
| PUT | /api/tasks/:id | Update task (toggle status) | Yes (Token) |
| DELETE | /api/tasks/:id | Delete a task | Yes (Token) |

---


