# Real Estate Portal

A full-stack real estate property listing application built with React, .NET 6, and Entity Framework Core.

## Tech Stack

### Backend
- .NET 6 Web API
- Entity Framework Core 6
- SQL Server / PostgreSQL
- JWT Authentication
- AutoMapper
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- Axios
- React Query (optional)

## Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js](https://nodejs.org/) (v16 or later)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

## Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd backend/RealEstate.API
   ```

2. **Configure the database**
   - Update the connection string in `appsettings.json`:
     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Server=your_server;Database=RealEstateDB;Trusted_Connection=True;TrustServerCertificate=True;"
     }
     ```
   - For PostgreSQL, use:
     ```
     "DefaultConnection": "Host=localhost;Database=RealEstateDB;Username=your_username;Password=your_password"
     ```

3. **Apply database migrations**
   ```bash
   dotnet ef database update
   ```

4. **Run the backend**
   ```bash
   dotnet run
   ```
   The API will be available at `https://localhost:5001` or `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Seeding Data

### Backend Seed Data

1. **Using Entity Framework Core**
   Run the following command to apply seed data:
   ```bash
   dotnet run --seed
   ```
   
   Or use the built-in Swagger UI at `/swagger` to manually create test data.

2. **Sample Data**
   The seed data includes:
   - Test users (admin@example.com, user@example.com)
   - Sample properties
   - Property categories and types

## API Documentation

Once the backend is running, you can access:

- **Swagger UI**: `https://localhost:5001/swagger`
- **API Endpoints**: `https://localhost:5001/api`

## Authentication

The application uses JWT authentication. To authenticate:

1. Register a new user at `/api/auth/register`
2. Login at `/api/auth/login` to get a JWT token
3. Include the token in the `Authorization` header for protected endpoints:
   ```
   Authorization: Bearer your-jwt-token
   ```

## Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT` - Set to "Development" or "Production"
- `ConnectionStrings__DefaultConnection` - Database connection string
- `Jwt:Key` - Secret key for JWT tokens
- `Jwt:Issuer` - Token issuer
- `Jwt:Audience` - Token audience

### Frontend
- `VITE_API_URL` - Base URL for API requests

## Running Tests

### Backend Tests
```bash
cd backend/RealEstate.API.Tests
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend
- Publish the application:
  ```bash
  dotnet publish -c Release -o ./publish
  ```
- Deploy the contents of the `publish` folder to your hosting environment

### Frontend
- Build for production:
  ```bash
  npm run build
  ```
- Deploy the contents of the `dist` folder to your static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the development team.
