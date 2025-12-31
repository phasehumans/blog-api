# Blog API

A REST API for a blog platform with authentication, post management, admin reviews and category management

### Authentication
| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/api/v1/auth/register`          | Register a new user               |
| POST   | `/api/v1/auth/register/admin`    | Register a new admin              |
| POST   | `/api/v1/auth/login`             | Authenticate user                 |
| GET    | `/api/v1/auth/profile`           | Get current user profile *(auth)* |
| PUT    | `/api/v1/auth/change-password`   | Change password *(auth)*          |
| POST   | `/api/v1/auth/apikey`            | Generate API key *(auth)*         |
| PUT    | `/api/v1/auth/apikey/:id/revoke` | Revoke API key *(auth)*           |


### Posts
| Method | Endpoint            | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| POST   | `/api/v1/posts`     | Create post *(auth, status: pending)*      |
| GET    | `/api/v1/posts`     | List approved posts *(public)*             |
| GET    | `/api/v1/posts/:id` | Get approved post *(public)*               |
| PUT    | `/api/v1/posts/:id` | Update post *(auth, author, pending only)* |
| DELETE | `/api/v1/posts/:id` | Delete post *(auth, author, pending only)* |


### Admin Posts
| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/v1/admin/posts`             | List pending posts *(admin)* |
| PUT    | `/api/v1/admin/posts/:id/approve` | Approve post *(admin)*       |
| PUT    | `/api/v1/admin/posts/:id/reject`  | Reject post *(admin)*        |


### Categories
| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/api/v1/categories`     | Create category *(admin)*      |
| GET    | `/api/v1/categories`     | List all categories *(public)* |
| PUT    | `/api/v1/categories/:id` | Update category *(admin)*      |
| DELETE | `/api/v1/categories/:id` | Delete category *(admin)*      |


## Project Structure

```
├── config/                    # App & database configuration
├── controllers/               # Route handlers / business logic
├── middlewares/               # Auth, validation, sanitization
├── models/                    # MongoDB schemas
├── routes/                    # API route definitions
├── tests/                     # API and integration tests
├── utils/                     # Shared utility helpers
├── node_modules/              # Dependencies
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── blog-api.postman_collection.json  # Postman collection
├── index.js                   # Server entry point
├── package.json               # Project metadata & scripts
├── package-lock.json          # Dependency lockfile
└── README.md                  # Project documentation

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
Return posts with metadata
```