# Blog API

A REST API for a blog platform with user authentication, post management, admin reviews, and category management


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




### **Authentication Flow**

```
User Registration
      ↓
Input Validation (Zod)
      ↓
Check if email exists
      ↓
Hash password
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