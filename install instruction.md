# Real Estate Portal - Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0) or later
- [Node.js](https://nodejs.org/) (v18 LTS or later recommended)
- [SQL Server 2019](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/downloads) (optional, for version control)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [VS Code](https://code.visualstudio.com/)

## Backend Setup

### 1. Clone the Repository
```bash
git clone https://your-repository-url.git
cd d:\Androidapps\webportal
```

### 2. Database Configuration

#### For SQL Server:
1. Open `appsettings.json` in the backend project
2. Update the connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=RealEstateDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

#### For PostgreSQL:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=RealEstateDB;Username=your_username;Password=your_password;Include Error Detail=true"
}
```

### 3. Apply Database Migrations
```bash
cd d:\Androidapps\webportal\WebPortal.API
dotnet ef database update
```

### 4. Run the Backend
```bash
dotnet run
```

The API will be available at:
- `https://localhost:7207` (Production)
- `http://localhost:5000` (Development)

Access the API documentation at:
- Swagger UI: `https://localhost:7207/swagger`
- OpenAPI JSON: `https://localhost:7207/swagger/v1/swagger.json`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd d:\Androidapps\webportal\webportal-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the frontend root with:
```env
VITE_API_URL=https://localhost:7207
VITE_ENV=development
```

### 4. Start the Development Server
```bash
npm run dev
```
Accessing the Application
Register a new account:
Go to http://localhost:3000/register
Fill in your details and submit
Log in:
Go to http://localhost:3000/login
Enter your credentials
Explore features:
Browse properties
View property details
Add properties to favorites
View your recently viewed properties
Sample Data
The database should be seeded with sample properties. If not, you can:

Use the Swagger UI to create properties
Or run the seed script if available:
bash
dotnet run --seed
Troubleshooting
Database connection issues:
Verify your connection string
Ensure the database server is running
Check if the database exists and is accessible
Frontend not connecting to backend:
Verify the VITE_API_URL in .env matches your backend URL
Check for CORS issues in the browser console
Missing dependencies:
Run npm install in the frontend directory
Run dotnet restore in the backend directory
Would you like me to help you with any specific part of the setup?