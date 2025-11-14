Todoer Frontend — React + Tailwind (Vercel)
Overview

Todoer Frontend is the user interface for the Todoer system.
Users can register, log in, and manage tasks through a clean, responsive UI.
The app communicates with the backend microservices via REST APIs secured with JWT authentication.
Deployed on Vercel for continuous and fast deployment.

Architecture

UI: React

Styling: Tailwind CSS

Routing: React Router

Data: REST API calls to backend microservices

Auth: JWT attached to protected routes; invalid tokens redirect to Login

Hosting: Vercel (builds triggered from GitHub)

Data Flow

[Login/Register] → obtain JWT → store auth state
[Tasks Page] → fetch tasks from backend
Mutations → POST/PATCH/DELETE → update UI on success
401 → clear auth and redirect to /login

Tech Stack
Layer	Tools
Framework	React
Styling	Tailwind CSS
Routing	React Router
HTTP	Fetch / Axios
Deployment	Vercel
Project Structure
src/
  components/
    Navbar.jsx
    TaskForm.jsx
    TaskItem.jsx
    TaskList.jsx
    ErrorBanner.jsx
    Spinner.jsx
  pages/
    Login.jsx
    Register.jsx
    Tasks.jsx
  hooks/
    useAuth.js
    useTasks.js
  utils/
    api.js        # wrapper for API requests
    storage.js    # helpers for token storage
  App.js
  index.js
tailwind.config.js
public/

Routes
Path	Description
/login	User login page
/register	New account creation
/tasks	Authenticated dashboard for managing tasks
/	Redirects based on authentication status
Key Components

Navbar – Displays navigation and user session info

TaskList – Renders user tasks; shows loading and empty states

TaskItem – Allows completing, editing, and deleting tasks

TaskForm – Adds a new task with validation

ErrorBanner / Spinner – Shared UI feedback for errors and loading

State & Data Handling

Auth – Token saved on login; cleared on logout or expired session

Tasks – Local state in Tasks page; re-fetch or update optimistically after mutations

Error Handling – Network/API issues shown through ErrorBanner

Performance – Avoids unnecessary re-renders and repeated fetches

API Contract (Frontend View)
Method	Endpoint	Description
POST	/auth/register	Create user; returns { user, accessToken }
POST	/auth/login	Authenticate; returns { user, accessToken }
GET	/tasks	Get all tasks (Bearer token required)
POST	/tasks	Create new task
PATCH	/tasks/:id	Update existing task
DELETE	/tasks/:id	Remove a task

Task Structure

{
  id: string,
  title: string,
  notes?: string,
  completed: boolean,
  createdAt: string,
  updatedAt: string
}

Core Hooks & Functions
useAuth

login(email, password) – Authenticates and stores token

register(data) – Registers a new user and logs in

logout() – Clears auth state and token

getToken() – Returns stored JWT for API calls

useTasks

fetchTasks() – Retrieves all tasks from API

addTask(data) – Creates new task and updates UI

updateTask(id, changes) – Updates existing task

deleteTask(id) – Deletes task and refreshes list

api.js

Adds Authorization: Bearer <token> to requests

Handles 401 responses by clearing auth and redirecting

Environment Variables

Create these in Vercel → Project → Settings → Environment Variables

REACT_APP_API_URL = https://<your-backend-host>
REACT_APP_BUILD_ENV = production


For local development, create a .env file with the same keys.
All build-time variables must start with REACT_APP_.

Setup (Local Development)
git clone https://github.com/Bilaliq95/todoer-frontend.git
cd todoer-frontend
npm install
# create .env and set REACT_APP_API_URL
npm start


Then visit http://localhost:3000
.

Build & Deploy (Vercel)

Connect the repo to Vercel

Build command: npm run build

Output directory: build/

Add environment variables in dashboard

Every push to main triggers automatic deployment

Testing

Smoke tests for components like TaskList and TaskForm

Auth tests: visiting /tasks unauthenticated should redirect to /login

Run tests:

npm test

Known Issues

Missing or incorrect REACT_APP_API_URL causes fetch failures

JWT expiry logs user out (refresh token flow planned)

Basic validation only on forms; can be expanded

Roadmap

Add dark mode

Add drag-and-drop task sorting

Implement optimistic UI updates

Add analytics/error monitoring

Add E2E testing with Playwright

Author

Muhammad Bilal Iqbal
GitHub: Bilaliq95
