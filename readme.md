<div align="center">

# TasksManager-BE

</div>

**TasksManager-BE** is a backend system for managing personal tasks, built with Node.js, Express, MongoDB, Socket.IO, and Cloudinary.

Use it together with [TasksManager-FE](https://github.com/phandinhphu/tasksmanager-fe)

## Key Features

* User registration, login, and logout (JWT, cookies).
* Task management, categorized by status and priority levels.
* Support for subtasks within each task.
* Personal schedule management.
* Profile updates, including avatar change (integrated with Cloudinary).
* Task statistics: total tasks, status, number of subtasks.
* Automatic notifications via Socket.IO when tasks/subtasks are approaching or past their deadlines.
* API security using JWT authentication.
* Cron job checks for task deadlines every 15 minutes.

## Directory Structure

```
├── src/
|    ├── apis/
|    |  ├──  controllers/   // API controllers
|    |  ├──  models/        // Mongoose models
|    ├── config/
|    ├── cloudinary/        // Cloudinary configuration
|    ├── db/                // MongoDB connection
|    ├── middleware/        // Authentication middleware
|    ├── routes/            // API routes
|    ├── services/          // Cron jobs, background services
|    ├── sockets/           // Socket.IO management
|    ├── util/              // Utility functions
|    ├── server.js          // Initialize HTTP & Socket.IO server
|    ├── index.js
├── .env.example            // Environment variables
```

## Installation

1. **Clone the project**

   ```sh
   git clone https://github.com/phandinhphu/tasksmanager-be.git
   cd tasksmanager-be
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   * Rename the `.env.example` file to `.env` and update the MongoDB, JWT, and Cloudinary settings accordingly.

4. **Run the project**

   * For development:

     ```sh
     npm run dev
     ```
   * Or for production:

     ```sh
     npm start
     ```

## Main APIs

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | /api/auth/register          | Register a new account   |
| POST   | /api/auth/login             | Log in                   |
| POST   | /api/auth/logout            | Log out                  |
| GET    | /api/user/me                | Get personal information |
| PUT    | /api/user/me/update-profile | Update profile           |
| GET    | /api/tasks/me               | Get personal task list   |
| POST   | /api/tasks                  | Create a new task        |
| PUT    | /api/tasks/\:id             | Update a task            |
| PUT    | /api/tasks/\:id/complete    | Mark task as complete    |
| DELETE | /api/tasks/\:id             | Delete a task            |
| GET    | /api/schedules/me           | Get personal schedule    |
| POST   | /api/schedules/create       | Create a new schedule    |

## Technologies Used

* Node.js, Express.js
* MongoDB, Mongoose
* Socket.IO (real-time notifications)
* Cloudinary (image storage)
* JWT, cookie-parser, helmet, cors, dotenv

## Contribution

All contributions, bug reports, or new ideas are welcome via GitHub Issues.

---

> Author: phandinhphu, prpjzz.
