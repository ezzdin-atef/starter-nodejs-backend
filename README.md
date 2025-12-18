# Starter Node.js Backend

A production-ready Node.js backend application built with TypeScript, Express, and Prisma. This project follows Clean Architecture principles with a modular structure, comprehensive authentication system, and robust error handling.

## 🚀 Features

### Authentication & Authorization

- **Email/Password Authentication** - Secure registration and login with bcrypt password hashing
- **JWT Tokens** - Access and refresh token implementation with configurable expiration
- **OAuth Integration** - Support for Google and GitHub OAuth providers
- **Password Reset** - Secure password reset flow with time-limited tokens
- **Session Management** - Token-based session management with refresh token rotation

### User Management

- **CRUD Operations** - Full user management with pagination
- **Email Verification** - Email verification support (ready for implementation)
- **Profile Management** - User profile with avatar and name support

### Security

- **Rate Limiting** - API rate limiting to prevent abuse
- **Helmet** - Security headers configuration
- **CORS** - Configurable CORS policies
- **Input Validation** - Zod-based request validation
- **Error Handling** - Centralized error handling with proper HTTP status codes

### Developer Experience

- **TypeScript** - Full type safety throughout the application
- **Swagger Documentation** - Auto-generated API documentation
- **Request Logging** - Comprehensive HTTP request logging with Winston
- **Request ID Tracking** - Request ID middleware for tracing
- **Health Checks** - Health check endpoint for monitoring

## 📋 Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Email**: Nodemailer (SMTP support)
- **Security**: Helmet, express-rate-limit

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts     # Prisma client setup
│   ├── env.ts          # Environment variables validation
│   └── logger.ts       # Winston logger configuration
│
├── modules/             # Feature modules (Clean Architecture)
│   ├── auth/           # Authentication module
│   │   ├── application/    # Use cases (business logic)
│   │   ├── domain/         # Domain layer
│   │   │   ├── entities/       # Domain entities
│   │   │   ├── repositories/  # Repository interfaces
│   │   │   ├── services/      # Domain services
│   │   │   └── errors/        # Domain errors
│   │   ├── http/            # HTTP layer
│   │   │   ├── dto/          # Data Transfer Objects
│   │   │   ├── docs/         # OpenAPI documentation
│   │   │   └── middleware/   # HTTP middleware
│   │   ├── infrastructure/   # External services (JWT, OAuth)
│   │   ├── persistence/      # Repository implementations
│   │   └── seeders/         # Database seeders (optional)
│   │
│   └── user/           # User management module
│       ├── application/    # Use cases
│       ├── domain/        # Domain layer
│       ├── http/          # HTTP layer
│       ├── persistence/   # Repository implementations
│       └── seeders/      # Database seeders (optional)
│
├── prisma/             # Prisma schema and migrations
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
│
├── shared/             # Shared utilities
│   ├── docs/           # Shared OpenAPI components
│   ├── errors/         # Shared error classes
│   ├── middleware/     # Shared middleware
│   └── routes/         # Shared routes (health check)
│
├── seeders/            # Main seeder runner
│   └── index.ts        # Scans and executes all module seeders
│
├── app.ts              # Express app configuration
└── server.ts           # Server entry point
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd starter-nodejs-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_REDIRECT_BASE_URL=http://localhost:3000
PRODUCTION_URL=https://your-production-domain.com

# Email Configuration (Required for password reset)
# Development: Can use Ethereal Email (automatic) or configure SMTP
# Production: SMTP configuration is required
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000

# CORS (Production)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)

### Optional Variables

- **OAuth variables** - Only required if using OAuth authentication
- **Email variables** - Required in production for password reset emails
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` - SMTP server configuration
  - `SMTP_FROM` - Email sender address
  - `FRONTEND_URL` - Frontend URL for password reset links
- `CORS_ORIGIN` - Required in production for CORS configuration

### Email Setup

**Development Mode:**

- If SMTP is not configured, the app uses Ethereal Email (fake SMTP)
- Email preview URLs are logged to the console
- No actual emails are sent

**Production Mode:**

- SMTP configuration is required
- Popular options:
  - **Gmail**: Use App Password (not regular password)
  - **SendGrid**: Use API key as password
  - **AWS SES**: Use AWS credentials
  - **Mailgun**: Use API key as password

## 📚 API Documentation

Once the server is running, API documentation is available at:

- **Swagger UI**: `http://localhost:3000/api-docs`

The API is versioned and available under `/api/v1`:

- **Auth Routes**: `/api/v1/auth/*`
- **User Routes**: `/api/v1/users/*`
- **Health Check**: `/health`

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

### Domain Layer

- **Entities**: Core business objects (User, Account, Session, etc.)
- **Repositories**: Interfaces defining data access contracts
- **Services**: Domain service interfaces
- **Errors**: Domain-specific error classes

### Application Layer

- **Use Cases**: Business logic implementations
- Orchestrates domain entities and repositories
- Independent of infrastructure

### Infrastructure Layer

- **HTTP**: Express controllers, routes, DTOs, middleware
- **Persistence**: Prisma repository implementations
- **External Services**: JWT service, OAuth configuration

### Benefits

- **Testability**: Easy to mock dependencies
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Flexibility**: Can swap implementations without changing business logic

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Build
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Start production server (requires build first)

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run seed             # Run all database seeders
npm run seed:module      # Run seeders for a specific module

# Code Generation
npm run generator        # Run module generator CLI
```

## 🛠️ Module Generator CLI

The project includes a CLI tool for quickly scaffolding new modules following the Clean Architecture pattern. This helps maintain consistency and speeds up development.

### Usage

**Using npm script (recommended):**
```bash
# Create a CRUD module
npm run generator -- module <module-name> --crud --entity <EntityName>

# Create a base module (without CRUD)
npm run generator -- module <module-name>
```

**Direct execution:**
```bash
# Create a CRUD module
tsx tools/app-cli/index.ts module <module-name> --crud --entity <EntityName>

# Create a base module
tsx tools/app-cli/index.ts module <module-name>
```

### Examples

**Create a CRUD module:**
```bash
npm run generator -- module product --crud --entity Product
```

This generates a complete CRUD module with:
- Domain layer: Entity and Repository interface
- Application layer: Create, Read, Update, Delete, and List use cases
- HTTP layer: Controller, Routes, DTOs (create, update, response), and OpenAPI docs
- Persistence layer: Prisma repository implementation
- Module index file

**Create a base module:**
```bash
npm run generator -- module notification
```

This generates a simpler module structure with:
- HTTP layer: Controller and Routes
- Module index file

### Generated Structure

**CRUD Module Structure:**
```
src/modules/<module-name>/
├── application/
│   ├── create-<entity>.usecase.ts
│   ├── get-<entity>-by-id.usecase.ts
│   ├── list-<entities>.usecase.ts
│   ├── update-<entity>.usecase.ts
│   └── delete-<entity>.usecase.ts
├── domain/
│   ├── entities/
│   │   └── <Entity>.ts
│   └── repositories/
│       └── <Entity>Repository.ts
├── http/
│   ├── dto/
│   │   ├── create-<entity>.dto.ts
│   │   ├── update-<entity>.dto.ts
│   │   └── <entity>-response.dto.ts
│   ├── docs/
│   │   ├── create-<entity>.doc.ts
│   │   ├── get-<entity>.doc.ts
│   │   ├── list-<entities>.doc.ts
│   │   ├── update-<entity>.doc.ts
│   │   ├── delete-<entity>.doc.ts
│   │   └── index.ts
│   ├── middleware/
│   ├── <module>.controller.ts
│   └── <module>.routes.ts
├── persistence/
│   └── prisma-<entity>.repository.ts
└── index.ts
```

**Base Module Structure:**
```
src/modules/<module-name>/
├── http/
│   ├── <module>.controller.ts
│   └── <module>.routes.ts
└── index.ts
```

### Next Steps After Generation

After generating a module, you'll need to:

1. **Update the Entity** - Add properties to the generated entity class
2. **Update the Repository Interface** - Add any custom query methods
3. **Update DTOs** - Add validation schemas for your entity fields
4. **Update Use Cases** - Implement business logic specific to your entity
5. **Update Prisma Repository** - Map entity fields to Prisma model
6. **Update Prisma Schema** - Add the corresponding Prisma model (or use `prisma model` command)
7. **Register the Module** - Import and register the module in `src/app.ts` (or use `register` command)

### Notes

- The CLI uses naming conventions: module names are converted to kebab-case, entity names use PascalCase
- Generated files include TODO comments where customization is needed
- The generator follows the same patterns as existing modules (e.g., `user` module)
- Use `--entity` flag when the entity name differs from the module name (e.g., `module order --crud --entity Order`)

## 🧪 Additional CLI Commands

The CLI includes several additional commands for generating specific files and automating common tasks:

### Test File Generator

Generate test files for use cases or repositories:

```bash
# Generate test for a use case
npm run generator -- test usecase <module> <name>
npm run generator -- test usecase product create-product

# Generate test for a repository
npm run generator -- test repository <module> <name>
npm run generator -- test repository product prisma-product
```

**Generated files:**
- `src/modules/<module>/application/<name>.usecase.test.ts`
- `src/modules/<module>/persistence/<name>.repository.test.ts`

### Use Case Generator

Generate custom use cases for non-CRUD business logic:

```bash
npm run generator -- usecase <module> <name> [--entity <name>]
npm run generator -- usecase product approve-product
npm run generator -- usecase order cancel-order --entity Order
```

**Generated files:**
- `src/modules/<module>/application/<name>.usecase.ts`

### Domain Error Generator

Generate domain-specific error classes:

```bash
npm run generator -- error <module> <name> [--status <code>] [--message <message>]
npm run generator -- error product ProductNotFoundError --status 404 --message "Product not found"
npm run generator -- error auth InvalidCredentialsError --status 401
```

**Options:**
- `--status` - HTTP status code (default: 400)
- `--message` - Default error message

**Generated files:**
- `src/modules/<module>/domain/errors/<ErrorName>.ts`

### Module Registration Helper

Automatically register a module in `app.ts`:

```bash
npm run generator -- register <module>
npm run generator -- register product
```

This command:
- Adds the module import to `app.ts`
- Registers the module with `app.use()`
- Skips if the module is already registered

### Prisma Model Generator

Generate Prisma models in `schema.prisma`:

```bash
npm run generator -- prisma model <name> --fields "<field-definitions>"
npm run generator -- prisma model Product --fields "name:String:required,unique,price:Decimal:required,description:String:optional"
```

**Field Format:**
- `name:type:required|optional,unique,default=value`
- Types: `String`, `Int`, `Float`, `Decimal`, `Boolean`, `DateTime`, `Json`, `Bytes`
- Options: `required`, `optional`, `unique`, `default=<value>`

**Example:**
```bash
npm run generator -- prisma model Category --fields "name:String:required,unique,slug:String:required,unique,description:String:optional,isActive:Boolean:required,default=true"
```

**Generated:**
- Adds model to `src/prisma/schema.prisma` with:
  - `id` (UUID, primary key)
  - `createdAt` (DateTime, default now)
  - `updatedAt` (DateTime, auto-updated)
  - Your custom fields

**After generation:**
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create and run migration
```

### Seeder Generator

Generate database seeders for populating initial data. Seeders are organized per module in `src/modules/<module>/seeders/` and can be run individually or all at once.

**Generate seeders:**
```bash
# Generate seeder with Prisma direct (default)
npm run generator -- seeder <module> <name>
npm run generator -- seeder user users

# Generate seeder with repository pattern
npm run generator -- seeder <module> <name> --use-repository
npm run generator -- seeder user users --use-repository

# Specify custom Prisma model name
npm run generator -- seeder order orders --model Order
```

**Options:**
- `--use-repository` - Use repository pattern instead of Prisma direct
- `--model <name>` - Prisma model name (defaults to module name)

**Generated files:**
- `src/modules/<module>/seeders/<name>.seeder.ts`

**Running seeders:**
```bash
# Run all seeders (scans all modules)
npm run seed

# Run seeders for a specific module only
npm run seed:module user
```

**Seeder approaches:**

1. **Prisma Direct** (default): Uses Prisma client directly for faster seeding
   - Best for: Simple data seeding, development environments
   - Uses transactions for atomicity
   - Includes duplicate checking with `skipDuplicates: true`
   - Example:
     ```typescript
     const seedData = [
       { email: 'admin@example.com', name: 'Admin User' },
       { email: 'user@example.com', name: 'Regular User' }
     ]
     await tx.user.createMany({ data: seedData, skipDuplicates: true })
     ```

2. **Repository Pattern**: Uses repository interfaces following Clean Architecture
   - Best for: Production-like seeding, testing repository implementations
   - Follows domain boundaries
   - More testable and maintainable
   - Example:
     ```typescript
     const repository = new PrismaUserRepository()
     const user = new User(id, email, name)
     await repository.save(user)
     ```

**Example: Complete User Seeder (Prisma Direct)**
```typescript
import { prisma } from '@/config/database'

export default async function seedUsersSeeder() {
  try {
    console.log('Seeding User...')

    const seedData = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        emailVerified: new Date()
      },
      {
        email: 'user@example.com',
        name: 'Regular User'
      }
    ]

    await prisma.$transaction(async (tx) => {
      const existing = await tx.user.findFirst()
      if (existing) {
        console.log('  User data already exists, skipping...')
        return
      }

      await tx.user.createMany({
        data: seedData,
        skipDuplicates: true
      })
      console.log(`  ✓ Created ${seedData.length} User records`)
    })

    console.log('  ✓ User seeding completed')
  } catch (error) {
    console.error(`  ✗ Error seeding User:`, error)
    throw error
  }
}
```

**Tips:**
- Seeders are executed in alphabetical order by file name
- Use transactions to ensure atomicity
- Check for existing data to avoid duplicates
- Seeders automatically disconnect Prisma after completion
- Use `skipDuplicates: true` with `createMany` for idempotent seeding

## 📋 CLI Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `module` | Generate CRUD or base module | `module product --crud --entity Product` |
| `test` | Generate test file | `test usecase product create-product` |
| `usecase` | Generate custom use case | `usecase product approve-product` |
| `error` | Generate domain error | `error product ProductNotFoundError --status 404` |
| `register` | Register module in app.ts | `register product` |
| `prisma model` | Generate Prisma model | `prisma model Product --fields "name:String:required"` |
| `seeder` | Generate database seeder | `seeder user users` |

## 💡 Tips

- Use `--` when running through npm scripts to pass flags correctly
- Generated files include TODO comments for customization
- Test files follow Jest patterns with mocks and test cases
- Error classes extend `AppError` and include status codes
- Prisma models automatically include `id`, `createdAt`, and `updatedAt` fields
- Seeders run in alphabetical order and can be filtered by module
- Use transactions in seeders for data consistency

## 🔐 Authentication Flow

### Registration

1. User provides email and password
2. Password is hashed with bcrypt
3. User and password records are created in a transaction
4. User is automatically logged in (access + refresh tokens returned)

### Login

1. User provides email and password
2. Password is verified against stored hash
3. Access and refresh tokens are generated
4. Session is created and stored

### Token Refresh

1. Client sends refresh token
2. Token is verified and session is checked
3. New access and refresh tokens are generated
4. Old session is deleted, new session is created

### Password Reset

1. User requests password reset with email
2. Reset token is generated and stored (expires in 1 hour)
3. **Email is sent** with password reset link containing the token
4. User clicks link and submits new password with token
5. Token is validated and marked as used
6. Password is updated and all sessions are invalidated

**Email Configuration:**

- In **development**: Uses Ethereal Email (fake SMTP) for testing. Preview URLs are logged.
- In **production**: Requires SMTP configuration (Gmail, SendGrid, AWS SES, etc.)
- Email templates are HTML-formatted with fallback text version

## 🧪 Testing

Testing setup is ready for implementation. The architecture supports easy unit testing of:

- Use cases (business logic)
- Domain entities
- Repository implementations

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start the server
npm start
```

### Environment Setup

Ensure all required environment variables are set in your production environment. Use a secure secret management system for sensitive values.

### Database Migrations

Run migrations in production:

```bash
npm run prisma:migrate
```

### Health Checks

The application includes a health check endpoint at `/health` for monitoring and load balancer health checks.

## 📖 Code Style

- **TypeScript**: Strict mode enabled
- **ES Modules**: Using ES6 import/export syntax
- **Naming**:
  - Files: kebab-case (e.g., `user.controller.ts`)
  - Classes: PascalCase (e.g., `UserController`)
  - Variables/Functions: camelCase (e.g., `getUserById`)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Maintain Clean Architecture principles
3. Add appropriate error handling
4. Update API documentation for new endpoints
5. Ensure TypeScript compilation passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
