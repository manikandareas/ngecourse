# Ngecourse - Interactive Learning Platform

A modern, production-ready learning management system built with React Router v7, Sanity CMS, and AI-powered features.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering with React Router v7
- ⚡️ Hot Module Replacement (HMR) for development
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations with TanStack Query
- 🔒 TypeScript by default with strict type checking
- 🎨 Modern UI with TailwindCSS and shadcn/ui components
- 🗄️ Headless CMS with Sanity for content management
- 🔐 Authentication with Clerk
- 🤖 AI-powered features with OpenAI integration
- 📊 Analytics with Vercel Analytics and Speed Insights
- 🛡️ Production-ready security headers and rate limiting
- 🐳 Docker support for containerized deployment

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Sanity account and project
- A Clerk account for authentication
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ngecourse
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup:**
   
   Copy the environment template:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your actual values in the `.env` file. See [Environment Variables](#environment-variables) section below for detailed configuration.

4. **Start development server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

Your application will be available at `http://localhost:5173`.

## Environment Variables

This application requires several environment variables to function properly. Copy `.env.example` to `.env` and configure the following:

### Required Variables

- **`VITE_SANITY_PROJECT_ID`**: Your Sanity project ID (found in Sanity dashboard)
- **`VITE_SANITY_DATASET`**: Sanity dataset name (usually "production" or "development")
- **`VITE_SANITY_API_VERSION`**: Sanity API version in YYYY-MM-DD format
- **`VITE_SANITY_SECRET_TOKEN`**: Sanity secret token with read/write permissions
- **`CLERK_SECRET_KEY`**: Clerk secret key for server-side authentication

### Optional Variables

- **`VITE_CLERK_PUBLISHABLE_KEY`**: Clerk publishable key for client-side
- **`VITE_EXTERNAL_SERVICE_URL`**: External service URL for API endpoints (default: http://localhost:4000)
- **`OPENAI_API_KEY`**: OpenAI API key for AI chat features
- **`APP_URL`**: Your application's base URL (default: http://localhost:5173)
- **`CLERK_WEBHOOK_SECRET`**: Clerk webhook signing secret
- **`CORS_ORIGINS`**: Comma-separated list of allowed CORS origins
- **`RATE_LIMIT_WINDOW_MS`**: Rate limit window in milliseconds (default: 900000)
- **`RATE_LIMIT_MAX_REQUESTS`**: Maximum requests per rate limit window (default: 100)

### Getting API Keys

1. **Sanity Setup:**
   - Create a project at [sanity.io](https://sanity.io)
   - Go to API settings and create a token with read/write permissions
   - Copy your project ID and dataset name

2. **Clerk Setup:**
   - Create an application at [clerk.com](https://clerk.com)
   - Copy the secret key and publishable key from the API Keys section

3. **OpenAI Setup (Optional):**
   - Create an account at [platform.openai.com](https://platform.openai.com)
   - Generate an API key in the API Keys section

### Environment Validation

The application automatically validates environment variables on startup:

- ✅ **Production**: Fails to start if critical variables are missing
- ⚠️ **Development**: Shows warnings but continues to run
- 📋 **Validation**: Checks format, length, and required patterns

## Security Features

This application includes production-ready security features:

### Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **HSTS**: Forces HTTPS connections in production
- **Referrer Policy**: Controls referrer information

### Rate Limiting
- **API endpoints**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes  
- **AI endpoints**: 10 requests per minute
- **In-memory store**: Automatic cleanup of expired entries

### Input Validation
- **Environment variables**: Comprehensive validation on startup
- **Request sanitization**: XSS protection and input cleaning
- **CORS protection**: Configurable allowed origins

## Building for Production

1. **Type checking and linting:**
   ```bash
   bun run typecheck
   ```

2. **Create production build:**
   ```bash
   bun run build
   ```

## Deployment

### Pre-deployment Checklist

Before deploying to production, ensure:

- ✅ All environment variables are configured with production values
- ✅ API keys have been rotated if previously exposed
- ✅ Database/CMS permissions are properly configured
- ✅ HTTPS is configured for your domain
- ✅ CORS origins include your production domain
- ✅ Rate limiting is appropriate for your traffic
- ✅ Error monitoring is configured (recommended: Sentry)

### Docker Deployment

**Recommended for production deployment:**

1. **Build the Docker image:**
   ```bash
   docker build -t ngecourse .
   ```

2. **Run with environment variables:**
   ```bash
   docker run -p 3000:3000 \
     --env-file .env \
     ngecourse
   ```

3. **For production with health checks:**
   ```bash
   docker run -d \
     --name ngecourse-prod \
     --restart unless-stopped \
     -p 3000:3000 \
     --env-file .env.production \
     --health-cmd="curl -f http://localhost:3000/ || exit 1" \
     --health-interval=30s \
     --health-timeout=3s \
     --health-retries=3 \
     ngecourse
   ```

### Platform-Specific Deployment

The containerized application can be deployed to:

- **Vercel** (recommended): Deploy directly with `vercel`
- **AWS ECS**: Use the Docker image with ECS service
- **Google Cloud Run**: Deploy container with automatic scaling
- **Azure Container Apps**: Serverless container deployment
- **Digital Ocean App Platform**: Managed container hosting
- **Fly.io**: Edge deployment with global distribution
- **Railway**: Simple container deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   ```bash
   vercel env add
   ```

### DIY Deployment

If deploying to your own server:

1. **Build the application:**
   ```bash
   bun run build
   ```

2. **Deploy these files:**
   ```
   ├── package.json
   ├── bun.lockb (or package-lock.json)
   ├── build/
   │   ├── client/    # Static assets
   │   └── server/    # Server-side code
   ├── .env.production  # Production environment variables
   ```

3. **Install production dependencies:**
   ```bash
   NODE_ENV=production bun install --production
   ```

4. **Start the server:**
   ```bash
   NODE_ENV=production bun run start
   ```

### Environment Variables in Production

**Critical**: Never commit `.env` files to version control. Use your deployment platform's environment variable management:

- **Vercel**: Use `vercel env` or dashboard
- **Docker**: Use `--env-file` or environment variables
- **Cloud Providers**: Use their secret management services
- **Traditional Servers**: Use system environment variables

### Monitoring and Logging

**Recommended monitoring setup:**

1. **Error Tracking**: Integrate Sentry or similar service
2. **Performance**: Already includes Vercel Speed Insights
3. **Analytics**: Already includes Vercel Analytics
4. **Health Checks**: Add `/health` endpoint for load balancers
5. **Logs**: Use structured logging in production

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
