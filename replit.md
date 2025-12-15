# Lyzer Agent

## Overview

Lyzer Agent is an AI-powered LinkedIn viral post generator built as a chat-first web application. The application provides a conversational interface where users can interact with an AI agent to generate engaging LinkedIn content. The design follows modern AI chat interfaces inspired by ChatGPT, Claude, Linear, and Gemini.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with React plugin

The frontend follows a chat-first design pattern with:
- Full-height chat container with centered max-width constraint
- Sticky navigation bar with theme toggle
- Auto-scrolling message feed
- Fixed bottom input area with backdrop blur

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Pattern**: REST endpoints under `/api` prefix
- **Build Process**: esbuild for production bundling

The server handles:
- Proxying requests to the Lyzr AI agent API
- Request validation using Zod schemas
- Static file serving in production
- Vite dev server integration in development

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Current Storage**: In-memory storage implementation (`MemStorage` class)
- **Database Ready**: Drizzle configuration present for PostgreSQL when needed

The schema currently defines a basic users table, though the main chat functionality operates statelessly through the external Lyzr API.

### Shared Code Structure
- **Location**: `shared/` directory
- **Purpose**: TypeScript types and Zod schemas shared between client and server
- **Key Types**: `Message`, `ChatRequest`, `ChatResponse`, `MessageRole`

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

## External Dependencies

### Lyzr AI Agent API
The application integrates with Lyzr's AI inference API for chat functionality:
- **Endpoint**: Configured via `LYZER_API_URL` environment variable
- **Authentication**: API key via `LYZER_API_KEY` header
- **Required Config**: `LYZER_USER_ID` and `LYZER_AGENT_ID` for agent identification
- **Session Management**: Sessions prefixed with agent ID for conversation continuity

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (for Drizzle)
- `LYZER_API_URL` - Lyzr AI API endpoint (defaults to production URL)
- `LYZER_API_KEY` - API authentication key
- `LYZER_USER_ID` - User identifier for Lyzr
- `LYZER_AGENT_ID` - Agent identifier for Lyzr

### Google Fonts
- Inter (primary font)
- JetBrains Mono (code/monospace font)