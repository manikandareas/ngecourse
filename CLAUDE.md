# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md
- The plan should be a detailed implementation plan and the reasoning behind them, as well as taks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for reasearch)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While Implementing
- You should update the plas as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the change you made, so following tasks can be asily hand over to other engineers.

## Development Commands

- `bun run dev` - Start development server with HMR at http://localhost:5173
- `bun run build` - Create production build
- `bun run start` - Start production server
- `bun run typecheck` - Run React Router type generation and TypeScript checking
- `bun run typegen` - Generate Sanity types

## Linting and Code Quality

This project uses Biome for linting and formatting, extending the "ultracite" configuration:
- Configuration in `biome.jsonc`
- Runs with default Biome settings with some custom overrides
- Console logs are treated as info-level warnings

## Architecture Overview

### Framework Stack
- **React Router v7** - Full-stack React framework with SSR enabled
- **TypeScript** - Type safety throughout
- **TailwindCSS** - Utility-first styling with custom components
- **Sanity CMS** - Headless CMS for content management
- **Clerk** - Authentication and user management
- **Jotai + TanStack Query** - State management and data fetching

### Project Structure

The app follows a feature-based architecture:

```
app/
├── components/         # Shared UI components
│   ├── ai-elements/    # AI chat interface components
│   └── ui/            # Base UI components (shadcn/ui-style)
├── features/          # Feature modules
│   ├── ai-chat/       # AI chatbot functionality
│   ├── courses/       # Course management
│   ├── enrollments/   # User enrollments
│   ├── home/          # Homepage
│   ├── recommendation/# Course recommendations
│   ├── shared/        # Shared utilities and schemas
│   └── users/         # User management
├── lib/               # Core utilities and clients
└── routes/            # React Router route components
```

Each feature module follows a consistent pattern:
- `components/` - Feature-specific UI components
- `data/` - Data access layer with Sanity queries
- `hooks/` - React hooks for data fetching (TanStack Query)
- `usecase/` - Business logic layer
- `utils/` - Feature-specific utilities

### Data Layer Architecture

**Sanity CMS Integration:**
- Content types: courses, chapters, lessons, quizzes, topics
- GROQ queries in `data/index.ts` files
- Type-safe queries using `defineQuery`
- Retry logic and error handling in sanity-client.ts

**Authentication:**
- Clerk integration for user auth
- Webhook handling for user lifecycle events
- User data stored in Sanity

**State Management:**
- Jotai for client-side state
- TanStack Query for server state and caching
- Feature-specific hooks abstract data fetching

### Key Features

**Course System:**
- Hierarchical structure: Course → Chapter → Content (Lesson/Quiz)
- Progress tracking and enrollment system
- AI-powered course recommendations
- Sequential navigation through content

**AI Chat Integration:**
- Dedicated AI chat feature with conversation history
- OpenAI integration via AI SDK
- Custom AI UI components

**User Onboarding:**
- Multi-step onboarding flow
- Learning goal selection and study plan customization

### Route Structure

- `/` - Homepage
- `/courses` - Course listing with search and recommendations
- `/courses/:slug` - Course detail page
- `/courses/:slug/:chapterSlug/lessons/:lessonSlug` - Lesson view
- `/courses/:slug/:chapterSlug/quizzes/:quizSlug` - Quiz view
- Auth routes: `/sign-in`, `/sign-up`, `/onboarding`
- `/recommendation` - Personalized course recommendations

### Environment Variables

Required environment variables (check `.env.example` if available):
- `VITE_SANITY_PROJECT_ID` - Sanity project ID
- `VITE_SANITY_DATASET` - Sanity dataset name
- `VITE_SANITY_API_VERSION` - Sanity API version
- `VITE_SANITY_SECRET_TOKEN` - Sanity API token
- Clerk environment variables for authentication
- OpenAI API key for AI features

### Testing and Development

- No specific test framework detected - check with user before assuming Jest/Vitest
- Development server supports HMR
- Docker support available for deployment
- TypeScript strict mode enabled


# Context7 Integration Rules
# This configuration enables the agent to automatically use the Context7 MCP server
# for retrieving relevant documentation and code examples.

[[calls]]
# Match when user asks for:
# - Code examples
# - Setup/configuration steps
# - Library/API documentation
# - Technical references
match = "when the user requests code examples, setup or configuration steps, or library/API documentation"
tool = "context7"

# Documentation:
# The Context7 tool will be automatically invoked when the user requests:
# 1. Code examples for specific libraries or frameworks
# 2. Setup or configuration instructions
# 3. API documentation lookups
# 4. Technical references or specifications
#
# The tool will:
# - Search for relevant documentation
# - Provide code snippets with proper syntax highlighting
# - Include version-specific information when available
# - Cite sources for the provided information
#
# Example queries that will trigger Context7:
# - "Show me how to use React hooks"
# - "How to configure webpack with TypeScript"
# - "Documentation for Express.js middleware"
# - "Example of async/await in JavaScript"