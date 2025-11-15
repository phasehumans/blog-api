# Ink Well - Blog API

A RESTful API for a blog platform with user authentication, post management, admin reviews, and category management.

## Features

- User authentication with JWT
- Blog post creation and management
- Admin post review system (approve/reject)
- Category management
- API key generation for programmatic access
- Password change functionality
- Pagination on list endpoints
- Input sanitization

## Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/phasehumans/inkwell.git
cd inkwell
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
```
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the server
```bash
npm start
```

The server will be running at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/v1/health` - Check server status

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/register/admin` - Register a new admin
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (requires auth)
- `PUT /api/v1/auth/change-password` - Change password (requires auth)
- `POST /api/v1/auth/apikey` - Generate API key (requires auth)
- `PUT /api/v1/auth/apikey/:id/revoke` - Revoke API key (requires auth)

### Posts
- `POST /api/v1/posts` - Create a post (requires auth, status: pending)
- `GET /api/v1/posts` - List published posts (public)
- `GET /api/v1/posts/:id` - View published post (public)
- `PUT /api/v1/posts/:id` - Edit post (requires auth, only author, only if pending)
- `DELETE /api/v1/posts/:id` - Delete post (requires auth, only author, only if pending)

### Admin Posts
- `GET /api/v1/admin/posts` - List pending posts (requires auth + admin)
- `PUT /api/v1/admin/posts/:id/approve` - Approve post (requires auth + admin)
- `PUT /api/v1/admin/posts/:id/reject` - Reject post (requires auth + admin)

### Categories
- `POST /api/v1/categories` - Create category (requires auth + admin)
- `GET /api/v1/categories` - List all categories (public)
- `PUT /api/v1/categories/:id` - Update category (requires auth + admin)
- `DELETE /api/v1/categories/:id` - Delete category (requires auth + admin)

## Project Structure

```
├── config/              # Database configuration
├── controllers/         # Request handlers
├── middlewares/         # Express middlewares
├── models/             # MongoDB schemas
├── routes/             # Route definitions
├── utils/              # Utility functions
├── index.js            # Server entry point
└── .env.example        # Environment variables template
```

## Architecture Design

### **Layered Architecture**

The application follows a **3-tier layered architecture** pattern:

```
┌─────────────────────────────────────────┐
│          Routes Layer                   │
│  (Express Routers - Request Routing)    │
├─────────────────────────────────────────┤
│       Controllers Layer                  │
│  (Business Logic & Request Handling)    │
├─────────────────────────────────────────┤
│    Models Layer (Data Access)           │
│  (MongoDB Schemas & Database Queries)   │
├─────────────────────────────────────────┤
│      Middlewares Layer                  │
│  (Authentication, Validation, Sanitize) │
├─────────────────────────────────────────┤
│        Config & Utils                   │
│  (Database, Helpers, Validation Rules)  │
└─────────────────────────────────────────┘
```

### **Data Flow**

```
Client Request
      ↓
Express Server (index.js)
      ↓
Middleware Stack
  ├─ CORS
  ├─ JSON Parser
  ├─ Sanitizer
  └─ Auth (if needed)
      ↓
Routes Layer
  └─ Maps HTTP methods to controllers
      ↓
Controllers Layer
  ├─ Validates input (Zod)
  ├─ Implements business logic
  ├─ Calls models
  └─ Returns response
      ↓
Models Layer
  ├─ Queries MongoDB
  ├─ Manages data persistence
  └─ Returns data to controller
      ↓
Response sent to Client
```

### **Component Breakdown**

#### **1. Routes Layer** (`/routes`)
- Defines API endpoints and HTTP methods
- Applies middleware (auth, role checks)
- Routes requests to appropriate controllers
- Files: `auth.route.js`, `post.route.js`, `admin.route.js`, `category.route.js`

#### **2. Controllers Layer** (`/controllers`)
- Handles request/response logic
- Validates input using Zod schemas
- Implements business rules
- Calls model methods for data operations
- Returns structured JSON responses
- Files: `auth.controller.js`, `post.controller.js`, `admin.controller.js`, `category.controller.js`

#### **3. Models Layer** (`/models`)
- Defines MongoDB data schemas
- Manages database collections
- Handles data validation at schema level
- Supports relationships via references
- Files: `users.model.js`, `posts.model.js`, `categories.model.js`, `apikeys.model.js`, `postreviews.model.js`

#### **4. Middleware Layer** (`/middlewares`)
- **auth.middleware.js** - Verifies JWT tokens, extracts user info
- **apikey.middleware.js** - Validates API keys for programmatic access
- **sanitize.middleware.js** - Prevents XSS by sanitizing input
- **error.middleware.js** - Global error handling (ready to integrate)

#### **5. Utils & Config**
- **config/db.js** - MongoDB connection management
- **utils/validation.js** - Zod schemas for input validation
- **utils/pagination.js** - Pagination helper for list endpoints
- **utils/apikey.js** - API key generation utility

### **Authentication Flow**

```
User Registration
      ↓
Input Validation (Zod)
      ↓
Check if email exists
      ↓
Hash password (bcrypt, salt: 10)
      ↓
Store in MongoDB
      ↓
Return success message

User Login
      ↓
Input Validation
      ↓
Find user by email
      ↓
Compare passwords (bcrypt)
      ↓
Generate JWT token
      ↓
Return token to client

Protected Route Access
      ↓
Client sends token in header
      ↓
Auth Middleware verifies JWT
      ↓
Extract user ID & role
      ↓
Pass to controller
      ↓
Proceed with request
```

### **Post Management Flow**

```
Create Post
      ↓
Auth check (user must be logged in)
      ↓
Validate input (title, content, categoryId)
      ↓
Generate slug from title
      ↓
Save to MongoDB with status: "pending"
      ↓
Return success

Admin Reviews Post
      ↓
Auth check (admin role required)
      ↓
Retrieve pending posts with pagination
      ↓
Admin approves/rejects
      ↓
Update post status & optional rejection comment
      ↓
Post becomes visible to public (if approved)

List Published Posts
      ↓
Fetch posts with status: "approved"
      ↓
Apply pagination
      ↓
Populate author & category references
      ↓
Return posts with metadata
```

### **Access Control Pattern**

```
Public Routes (No Auth Required)
├─ GET /health
├─ GET /posts (approved only)
├─ GET /posts/:id (approved only)
└─ GET /categories

User Routes (Auth Required)
├─ POST /posts
├─ PUT /posts/:id (own posts only)
├─ DELETE /posts/:id (own posts only)
├─ PUT /change-password
├─ POST /apikey
└─ PUT /apikey/:id/revoke

Admin Routes (Auth + Admin Role Required)
├─ GET /admin/posts
├─ PUT /admin/posts/:id/approve
├─ PUT /admin/posts/:id/reject
├─ POST /categories
├─ PUT /categories/:id
└─ DELETE /categories/:id
```

### **Error Handling**

- **Validation Errors** (400) - Invalid input or missing fields
- **Authentication Errors** (401/403) - Invalid token or insufficient permissions
- **Not Found Errors** (404) - Resource doesn't exist
- **Conflict Errors** (409) - Duplicate entries or unique constraint violations
- **Server Errors** (500) - Unexpected errors

### **Database Schema Relationships**

```
User (1) ──→ (Many) Posts
User (1) ──→ (Many) ApiKeys
Post (Many) ──→ (1) User (author)
Post (Many) ──→ (1) Category
Category (1) ──→ (Many) Posts
PostReview (Many) ──→ (1) Post
PostReview (Many) ──→ (1) User (reviewer)
```

### **Security Features**

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Input sanitization (XSS prevention)
- ✅ API key hashing with SHA-256
- ✅ Environment variable validation
- ✅ CORS enabled for cross-origin requests

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URL` - MongoDB connection string (required)
- `JWT_SECRET` - JWT secret key (required)
- `NODE_ENV` - Environment (development/production)

## Technologies

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Bcrypt - Password hashing
- Zod - Schema validation
- Cors - Cross-origin requests

## License

ISC

## Author

Phase Humans
