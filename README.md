# 📝 Blog App

A full-stack blog application built with **React, Vite, Express.js, MongoDB, and Clerk Authentication**.

The application provides separate experiences for **Users** and **Authors**. Users can browse and read published articles and add comments, while Authors can create, edit, and delete their own articles.

---

## ✨ Features

### 🔐 Authentication & Roles

* Clerk-based authentication
* First-time user role selection
* Separate **User** and **Author** roles
* Role-based access to application features
* Protected backend API routes

### 👤 User Features

* Browse published articles
* View individual articles
* View article author information
* Add comments to articles

### ✍️ Author Features

* Create new articles
* View authored articles
* Edit own articles
* Delete own articles
* Article ownership validation

### 🛡️ Backend & Security

* Express.js REST API
* MongoDB database with Mongoose
* Clerk authentication for protected API routes
* Role-based authorization
* Article ownership checks
* Environment-based configuration
* Sensitive credentials excluded from version control

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* React Hook Form
* Bootstrap
* Clerk React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Clerk
* dotenv
* CORS

### Development Tools

* ESLint
* Git
* npm

---

## 📂 Project Structure

```text
Blog-App/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── req.http
├── .gitignore
└── README.md
```

---

## ⚙️ Requirements

Before running the application, make sure you have:

* **Node.js 20 or newer**
* **npm**
* **MongoDB** running locally or a MongoDB connection URI
* A **Clerk** application with the required publishable and secret keys

---

## ⚙️ Configuration

The application uses environment variables for database, authentication, and API configuration.

### Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file using `.env.example` as a reference.

Configure:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend Configuration

Navigate to the frontend directory:

```bash
cd frontend
```

Create a `.env` file using `.env.example` as a reference.

Configure:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000
```

> **Important:** Never commit `.env` files, database credentials, Clerk keys, or authentication tokens to GitHub.
>
> The repository includes `.env.example` files containing placeholder values for configuration reference.

---

## 🚀 Running the Application

The frontend and backend run separately during local development.

### Start the Backend

From the project root:

```bash
cd backend
npm install
npm run dev
```

The backend API will normally run on:

```text
http://localhost:4000
```

### Start the Frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the URL displayed in the Vite terminal if a different port is assigned.

---

## 🧪 API Testing

The project includes a `req.http` file containing example requests for testing the backend API.

It includes examples for:

* Listing articles
* Creating an article
* Adding a comment
* Other backend API requests

Authenticated requests use:

```http
Authorization: Bearer TOKEN
```

Replace `TOKEN` with a valid temporary Clerk session token when testing protected endpoints.

The `req.http` file contains placeholders only and does not store real authentication tokens.

---

## 🔄 Application Flow

```text
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Clerk Login  │
                         └──────┬───────┘
                                │
                                ▼
                       ┌───────────────────┐
                       │   First Login?    │
                       └─────────┬─────────┘
                                 │
                          ┌──────┴──────┐
                          │             │
                         Yes            No
                          │             │
                          ▼             ▼
                   ┌────────────┐ ┌──────────────┐
                   │ Select Role│ │ Load Profile │
                   └─────┬──────┘ └──────┬───────┘
                         │                │
                         └───────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌──────────────┐          ┌──────────────┐
             │     User     │          │    Author    │
             └──────┬───────┘          └──────┬───────┘
                    │                         │
                    ▼                         ▼
             Browse Articles           Manage Articles
                    │                 ┌──────┼──────┐
                    ▼                 │      │      │
                Comments            Create  Edit   Delete
```

---

## 📡 Backend API

The backend provides REST APIs for the main application functionality.

| API Area       | Purpose                                         |
| -------------- | ----------------------------------------------- |
| User API       | Article browsing, user operations, and comments |
| Author API     | Article creation and article management         |
| Authentication | Clerk-protected API requests                    |

Protected endpoints require a valid Clerk authentication token.

---

## 🔒 Security

The application follows several security practices:

* Authentication handled through Clerk
* Protected backend API routes
* Role-based authorization
* Article ownership verification
* Environment variables for sensitive configuration
* `.env` files excluded from Git
* No real authentication tokens stored in `req.http`
* Placeholder configuration provided through `.env.example`

---

## ✅ Validation

The application was tested locally before submission.

### Frontend Lint

```bash
cd frontend
npm run lint
```

ESLint completed successfully without errors.

### Frontend Production Build

```bash
cd frontend
npm run build
```

The production build completed successfully using Vite.

### Backend

```bash
cd backend
npm start
```

The backend successfully:

* Connected to MongoDB
* Started the Express API
* Listened on port `4000`

---

## 📌 Future Improvements

Potential future enhancements include:

* Article search and filtering
* Pagination
* Article categories and tags
* Rich-text article editor
* Comment editing and deletion
* User profile pages
* Image upload and cloud storage
* Article likes and bookmarks
* Improved responsive UI
* Production deployment

---

## 👨‍💻 Project

This project was developed as a full-stack web application using the **MERN stack with Clerk authentication**.

### Technologies Used

**MongoDB • Express.js • React • Node.js • Clerk • Vite**
