
## Installation
## JKTECH Backend 🚀
A high-performance backend service built with NestJS, designed for user authentication, document management, and ingestion processing.

## 🏗️ Tech Stack
Framework: NestJS (TypeScript-based Node.js framework)
Database: PostgreSQL
Authentication: JWT-based authentication
Integration: Python backend for document ingestion

 ## 📌 Prerequisites
Ensure the following dependencies are installed:

- Node.js (v14 or later)
- PostgreSQL
- Python Backend Service (for document ingestion)
## ⚙️ Installation
<!-- Clone the repository and install dependencies:
git clone https://github.com/your-repo/jktech-backend.git
cd jktech-backend
npm install -->



 
## 🔧 Configuration
- Create a .env file in the project root with the following environment variables:
- AWS_S3_BUCKET=docs-manage-bucket-jktech
- AWS_ACCESS_KEY_ID=your access key 
- AWS_SECRET_ACCESS_KEY= your secret key
- AWS_REGION=ap-northeast-1
- JWT_SECRET=your-secret-key
- DB_HOST=localhost
- DB_PORT=5432
- DB_USERNAME=postgres  # Ensure this matches DATABASE_URL
- DB_PASSWORD=abhishek123
- DB_NAME=docs_manage_jktech

- DATABASE_URL=postgresql://postgres:abhishek123@localhost:5432/docs_manage_jktech  # Ensure consistency


## 🚀 Running the Application
## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout

### User Management
- PUT `/users/:id/role` - Update user role (Admin only)

### Documents
- POST `/documents` - Upload document
- GET `/documents` - List all documents
- DELETE `/documents/:id` - Delete document

### Ingestion
- POST `/ingestion/trigger` - Trigger document ingestion
- GET `/ingestion/status` - Check ingestion status

## 🛡️ Role-Based Permissions

- Admin: Full system access
- Editor: Document upload and ingestion
- Viewer: Read-only access




## License

MIT



