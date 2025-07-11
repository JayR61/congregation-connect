# replit.md

## Overview

This is a full-stack church management system built with React (TypeScript) frontend and Express.js backend. The application provides comprehensive tools for managing church operations including member management, task tracking, financial records, document storage, programmes, and mentorship programs.

## Recent Changes

- **January 11, 2025**: Successfully migrated project from Replit Agent to Replit environment
- **January 11, 2025**: Fixed document upload form to have single scroll element instead of two
- **January 11, 2025**: Cleaned up volunteers section by removing sample data - only users can now add/edit volunteers
- **January 11, 2025**: Added family member linking functionality to member forms
- **January 11, 2025**: Added empty states for volunteers section when no data exists
- **January 11, 2025**: Completely cleaned up mentorship section by removing all sample data
- **January 11, 2025**: Added functional "New Program" button with full CRUD operations for mentorship programs
- **January 11, 2025**: Created comprehensive MentorshipProgramDialog component with mentor/mentee assignment, goals, resources, and progress tracking
- **January 11, 2025**: Implemented edit and delete functionality for mentorship programs
- **January 11, 2025**: Added empty states for sections with no data to improve user experience
- **January 11, 2025**: Cleaned up resources section by removing all template data and adding comprehensive functionality with 9 different views
- **January 11, 2025**: Standardized dialog sizes across all forms to 600px width and 95vh height for consistency
- **January 11, 2025**: Added complete resource management system with booking, approval, reporting, and health monitoring features
- **January 11, 2025**: Replaced Social Media section with "Coming Soon" message per user request
- **January 11, 2025**: Fixed major connectivity issues: TaskDetail uses AppContext, member names display correctly, currency formatting standardized, finance categories show names not IDs
- **January 11, 2025**: Added professional enhancements: ErrorBoundary for error handling, TaskFilters for advanced filtering, BreadcrumbNavigation for better UX, GlobalSearch for cross-app search, and AnalyticsDashboard for comprehensive data insights

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and production builds
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: React Context API with custom hooks
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite integration

## Key Components

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **Migrations**: Database migrations managed by Drizzle Kit

### Authentication & Security
- **Session-based**: Express sessions with PostgreSQL backing
- **Role-based**: Permission system with role-based access control
- **Security Headers**: CORS and security middleware configured

### UI Components
- **Design System**: shadcn/ui components built on Radix UI primitives
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant components
- **Theme**: Light/dark theme support with CSS variables

### Domain Models
- **Members**: Complete member management with profiles, attendance, notes
- **Tasks**: Task management with categories, assignments, comments
- **Finances**: Income/expense tracking with categories and reporting
- **Documents**: File management with folders, versions, sharing
- **Programmes**: Event and programme management with attendance tracking
- **Resources**: Church resource booking and management system

## Data Flow

### Client-Side State Management
1. **Context Providers**: Multiple context providers for different domains
2. **Local Storage**: Persistent storage for user preferences and some data
3. **React Query**: Server state caching and synchronization
4. **Mock Data**: Comprehensive mock data system for development

### Server-Side Data Flow
1. **API Routes**: RESTful endpoints with `/api` prefix
2. **Database Operations**: CRUD operations through Drizzle ORM
3. **Error Handling**: Centralized error handling middleware
4. **Request Logging**: Comprehensive request/response logging

### Data Persistence
- **Primary**: PostgreSQL database via Neon serverless
- **Fallback**: In-memory storage for development
- **Client**: Local storage for user preferences and temporary data

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Router, React Query
- **UI Libraries**: Radix UI components, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Form Handling**: React Hook Form with Zod validation
- **Date Management**: date-fns for date operations

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict mode
- **Linting**: ESLint configuration for code quality
- **Development**: Hot reload, error overlay, source maps

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Migrations run via `drizzle-kit push`

### Environment Configuration
- **Development**: Uses tsx for server execution with hot reload
- **Production**: Compiled JavaScript with Node.js execution
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Deployment Architecture
- **Static Assets**: Frontend built and served from `dist/public`
- **API Server**: Express.js server handling API routes and serving static files
- **Database**: External PostgreSQL database (Neon)
- **Sessions**: PostgreSQL-backed sessions for authentication

### Development Workflow
1. **Local Development**: `npm run dev` starts development server with hot reload
2. **Type Checking**: `npm run check` validates TypeScript
3. **Database Management**: `npm run db:push` applies schema changes
4. **Production Build**: `npm run build` creates optimized production bundle

The application follows a modern full-stack architecture with strong type safety, comprehensive error handling, and scalable data management patterns. The codebase is well-structured with clear separation of concerns and follows React and Node.js best practices.