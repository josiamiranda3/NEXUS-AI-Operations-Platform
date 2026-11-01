# NEXUS — AI Operations Platform

<h3 align="center">
  Intelligent Enterprise Operations Management Platform
</h3>

<p align="center">
  A modern SaaS platform for business intelligence, project management, team productivity, operational analytics, and AI-powered insights.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
</p>

<p align="center">
  <strong>Enterprise SaaS · Business Intelligence · Artificial Intelligence · Project Management</strong>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Project Objectives](#project-objectives)
- [Core Features](#core-features)
- [Application Modules](#application-modules)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [AI Integration](#ai-integration)
- [Data Management](#data-management)
- [User Interface and Design System](#user-interface-and-design-system)
- [Responsive Design](#responsive-design)
- [Available Scripts](#available-scripts)
- [Production Build](#production-build)
- [Security Considerations](#security-considerations)
- [Current Limitations](#current-limitations)
- [Future Development Opportunities](#future-development-opportunities)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

# Overview

**NEXUS — AI Operations Platform** is an enterprise-oriented SaaS application designed to centralize business operations and provide an integrated environment for managing projects, tasks, employees, performance indicators, and organizational activities.

The platform combines a sophisticated user interface, interactive data visualization, centralized application state management, and an AI-powered operational assistant.

NEXUS aims to simplify organizational workflows by bringing essential management capabilities together in a single application.

Rather than functioning as a simple dashboard, NEXUS provides multiple interconnected modules designed to represent a comprehensive business operations environment.

### Product Vision

To create an intelligent operational management environment where organizations can monitor performance, coordinate teams, manage projects, identify operational bottlenecks, and access contextual business insights.

### Target Audience

- Technology companies.
- Startups and growing businesses.
- Project managers.
- Product managers.
- Software development teams.
- Business analysts.
- Operations managers.
- Enterprise organizations.

---

# Project Objectives

The main objectives of NEXUS are:

1. Centralize business operations in a unified interface.
2. Improve project and task management workflows.
3. Provide visibility into organizational performance.
4. Facilitate team coordination and productivity monitoring.
5. Present business metrics through interactive visualizations.
6. Integrate artificial intelligence into operational analysis.
7. Deliver a responsive and consistent user experience.
8. Demonstrate modern Front-End engineering practices and application architecture.

---

# Core Features

## 1. Executive Dashboard

A centralized overview of organizational performance.

Features:

- Executive KPI cards.
- Operational performance indicators.
- Revenue visualization.
- Project status monitoring.
- Task completion metrics.
- Team productivity indicators.
- Recent organizational activities.
- Upcoming deadlines.
- Operational alerts.
- AI-generated operational insights.

## 2. Project Management

A comprehensive project management environment.

Features:

- Project creation.
- Project editing.
- Project deletion.
- Project details.
- Project assignments.
- Budget tracking.
- Progress monitoring.
- Priority management.
- Project status management.
- Team member associations.
- Search and filtering.

Supported project statuses:

- Planning.
- In Progress.
- On Hold.
- Completed.
- Cancelled.

Available visualization modes:

- Project cards.
- Data table.
- Kanban board.

## 3. Task Management

A centralized task management system.

Features:

- Task creation.
- Task editing.
- Task deletion.
- Task assignments.
- Task priorities.
- Due date management.
- Project associations.
- Task descriptions.
- Tags and categorization.
- Task filtering.
- Search functionality.
- Task detail views.
- Comments information.

Supported task statuses:

- Backlog.
- To Do.
- In Progress.
- In Review.
- Done.

## 4. Team Management

An organizational team management module.

Features:

- Employee directory.
- Employee profiles.
- Employee creation.
- Employee editing.
- Employee details.
- Department classification.
- Role information.
- Employment status.
- Productivity indicators.
- Assigned projects.
- Completed task statistics.

Supported departments include:

- Engineering.
- Design.
- Product.
- DevOps.
- Security.
- Data & AI.
- Operations.

## 5. Analytics and Business Intelligence

An interactive analytics environment for organizational performance monitoring.

Features:

- Revenue analytics.
- Project performance analysis.
- Task completion statistics.
- Team productivity metrics.
- Department performance.
- Historical comparisons.
- Operational indicators.
- Interactive charts.
- Performance visualization.

The analytics interface uses Recharts to render data visualizations.

## 6. AI Intelligence Center

An AI-powered operational assistant designed to support organizational analysis.

The assistant provides an interface for submitting questions and receiving operational recommendations.

Features:

- Conversational AI interface.
- Contextual operational analysis.
- Suggested prompts.
- Conversation history during the application session.
- AI response loading indicators.
- Copy response functionality.
- Clear conversation.
- New conversation sessions.
- Organization context metrics.

Example use cases:

- Analyze operational performance.
- Identify projects at risk.
- Discover productivity bottlenecks.
- Generate executive briefings.
- Analyze task completion rates.
- Recommend operational improvements.

The application includes a Google Gemini integration through a server-side API endpoint, with a deterministic demonstration fallback when the API is unavailable or not configured.

## 7. Interactive Calendar

A centralized calendar for organizational activities.

Features:

- Monthly calendar visualization.
- Weekly and daily views.
- Project deadlines.
- Task deadlines.
- Meetings.
- Reviews.
- Milestones.
- Event creation.
- Event details.

## 8. Reports Center

A centralized reporting environment.

Report categories include:

- Executive reports.
- Financial reports.
- Project reports.
- Productivity reports.
- Team performance reports.

The module provides report visualization and available export functionality.

## 9. Notification Center

A centralized notification management interface.

Notification categories include:

- Task assignments.
- Approaching deadlines.
- Project completions.
- Performance alerts.
- Team activities.
- System notifications.

Features:

- Notification listing.
- Read and unread states.
- Mark as read.
- Mark all as read.
- Notification deletion.
- Unread notification indicators.

## 10. Global Search

A centralized search interface for accessing application information.

Searchable entities include:

- Projects.
- Tasks.
- Employees.
- Reports.

The interface includes keyboard shortcut support and categorized search results.

## 11. Application Settings

A centralized configuration environment.

Settings categories include:

- General preferences.
- User profile.
- Organization settings.
- Appearance.
- Notifications.
- Security.
- Interface preferences.

Available preferences include theme selection and interface customization.

---

# Technology Stack

NEXUS is built using a modern JavaScript and TypeScript ecosystem.

## Front-End

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Static typing and maintainability |
| Vite 8 | Development server and build tooling |
| Tailwind CSS 4 | Utility-first styling |
| React Router 7 | Application routing |
| Recharts 3 | Data visualization |
| Motion | Animations and transitions |
| Lucide React | Icon system |
| date-fns | Date manipulation and formatting |

## Back-End

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 4 | HTTP server and API endpoints |
| TypeScript | Server-side development |
| dotenv | Environment variable management |

## Artificial Intelligence

| Technology | Purpose |
|---|---|
| Google Gemini API | AI-powered operational analysis |
| @google/genai | Official Google GenAI SDK |

## Development Tools

- npm.
- Git.
- GitHub.
- Visual Studio Code.
- Google AI Studio.

---

# Architecture

NEXUS follows a modular application architecture, separating application routing, reusable interface components, feature modules, state management, data definitions, and server-side responsibilities.

### Front-End Architecture

The application uses:

- React functional components.
- TypeScript interfaces and type definitions.
- React Context API for centralized application state.
- React Router for navigation.
- Reusable UI components.
- Feature-oriented organization.
- Centralized data definitions.
- Reusable modal components.
- Shared layout components.

### Back-End Architecture

The Express server provides:

- Application hosting.
- Development integration with Vite.
- Production static asset serving.
- Health monitoring endpoint.
- AI chat endpoint.
- Server-side Gemini API integration.
- Deterministic fallback intelligence.

### Application Communication

The AI Intelligence module communicates with the Express server through HTTP requests.

The server handles the Gemini API integration and returns the generated response to the application.

---

# Project Structure

```text
NEXUS/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ToastContainer.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── GlobalSearchModal.tsx
│   │   │   └── QuickActionModal.tsx
│   │   │
│   │   └── modals/
│   │
│   ├── context/
│   │   └── NexusContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── team/
│   │   ├── calendar/
│   │   ├── intelligence/
│   │   ├── reports/
│   │   ├── notifications/
│   │   └── settings/
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── index.css
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*Note: The tree represents the main application structure. Some generated configuration and supporting files may vary between distributions.*

---

# Installation and Setup

## Prerequisites

Before running NEXUS locally, ensure that the following tools are installed:

- Node.js 24 or a compatible supported version.
- npm 11 or a compatible version.
- Git (optional, for repository management).
- A modern web browser.

Check your installed versions:

```bash
node -v
npm -v
git --version
```

## 1. Clone the Repository

```bash
git clone https://github.com/josiamiranda3/NEXUS-AI-Operations-Platform.git
```

Navigate into the project directory:

```bash
cd nexus-ai-operations
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as a reference.

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
PORT=3000
```

The Gemini API key is optional for the basic demonstration environment.

To enable the external Gemini integration, obtain an API key through Google AI Studio:

https://aistudio.google.com/apikey

Never commit your actual `.env` file or expose private API keys in public repositories.

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

The Express server runs the Vite development middleware and serves the React application.

---

# Environment Configuration

| Variable | Description | Required |
|---|---|---|
| GEMINI_API_KEY | Google Gemini API authentication key | Optional |
| APP_URL | Application base URL | Optional |
| PORT | Express server port | Optional |

Default server port:

```text
3000
```

If `GEMINI_API_KEY` is not configured, the AI assistant uses the application's deterministic demonstration fallback.

---

# Running the Application

### Development Mode

```bash
npm run dev
```

Starts the Express server with Vite development middleware.

### Production Build

```bash
npm run build
```

Generates the optimized Front-End production bundle inside the `dist/` directory.

### Preview Build

```bash
npm run preview
```

Starts the Vite preview server for the generated Front-End bundle.

Note: The preview command serves the static Vite build. For the complete application, including Express API endpoints, use the production server configuration described in the deployment section.

### TypeScript Validation

```bash
npm run lint
```

Runs TypeScript validation using the configured TypeScript compiler.

---

# API Documentation

The Express server exposes the following application endpoints.

## 1. Health Check

**Endpoint:**

```http
GET /api/health
```

Description:

Returns the current operational status of the application server.

Example response:

```json
{
  "status": "operational",
  "platform": "NEXUS AI Operations",
  "version": "2.4.0",
  "timestamp": "2026-11-01T17:05:58.780Z",
  "geminiConfigured": true
}
```

The `geminiConfigured` property indicates whether a Gemini API key is available in the server environment.

## 2. AI Chat

**Endpoint:**

```http
POST /api/ai/chat
```

Description:

Processes user prompts through the NEXUS operational intelligence service.

Example request:

```json
{
  "prompt": "Analyze our operational performance",
  "context": {
    "activeProjects": 8,
    "totalTasks": 30,
    "teamMembers": 12
  }
}
```

Example response:

```json
{
  "response": "Executive operational performance analysis...",
  "source": "gemini-3.8-flash",
  "status": "success"
}
```

When Gemini is unavailable or not configured, the endpoint returns a deterministic demonstration response.

---

# AI Integration

The NEXUS Intelligence Center integrates with Google's Generative AI ecosystem through the official `@google/genai` SDK.

### Integration Workflow

1. The user submits a question through the AI Intelligence interface.
2. The application sends the prompt and available organizational context to the Express server.
3. The server checks whether the Gemini API key is configured.
4. If configured, the server submits the request to the Gemini model.
5. The generated response is returned to the Front-End.
6. If the external AI request fails or is unavailable, the server uses deterministic fallback responses.

### AI Capabilities

- Operational performance analysis.
- Project risk identification.
- Productivity bottleneck analysis.
- Executive operational briefings.
- Task completion analysis.
- Operational improvement recommendations.

### Demonstration Mode

NEXUS includes a deterministic fallback intelligence mechanism.

This allows the AI interface to remain demonstrable without requiring an active external AI connection.

**Important:** Demonstration responses are predefined and should not be interpreted as real-time analysis of verified enterprise performance.

---

# Data Management

The current application uses a demonstration-oriented data architecture.

### Data Sources

- Structured demonstration data.
- Centralized React application state.
- Local browser persistence where implemented.
- Server-side AI responses.

### Application Entities

The application defines TypeScript models for:

- Employees.
- Projects.
- Tasks.
- Calendar events.
- Notifications.
- Activities.
- AI messages.
- User profiles.
- Organization settings.
- Application preferences.

### Persistence

The application uses browser-side persistence for supported preferences and application data.

The current implementation does not include a production relational database or a multi-user synchronization layer.

---

# User Interface and Design System

NEXUS follows a modern enterprise SaaS visual language.

### Design Principles

- Dark-first interface.
- Consistent visual hierarchy.
- Modular layouts.
- Reusable components.
- Clear information architecture.
- Interactive data visualization.
- Subtle transitions and animations.
- Consistent spacing and typography.

### Color Palette

| Token | Color |
|---|---|
| Primary Background | `#090B14` |
| Secondary Background | `#101522` |
| Surface | `#151C2C` |
| Elevated Surface | `#1C2638` |
| Primary Accent | `#8B5CF6` |
| Secondary Accent | `#06B6D4` |
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Primary Text | `#F8FAFC` |
| Secondary Text | `#94A3B8` |

### Interface Components

- Sidebar navigation.
- Header navigation.
- KPI cards.
- Data tables.
- Interactive charts.
- Modal dialogs.
- Confirmation dialogs.
- Toast notifications.
- Search interfaces.
- Form components.
- Status badges.
- Empty states.

---

# Responsive Design

The interface is designed to support different screen sizes.

Supported layout targets include:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile devices.

Responsive interface considerations include:

- Adaptive layouts.
- Collapsible navigation.
- Mobile navigation drawer.
- Responsive cards.
- Adaptive data visualizations.
- Touch-friendly controls.
- Flexible content areas.

---

# Available Scripts

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the development server |
| `npm run build` | Generates the production Front-End bundle |
| `npm run preview` | Previews the generated Vite build |
| `npm run lint` | Runs TypeScript validation |
| `npm run start` | Starts the Express application server |
| `npm run clean` | Removes generated build artifacts |

---

# Production Build

To generate a production Front-End build:

```bash
npm run build
```

The generated files are placed in:

```text
dist/
```

To run the complete application using the Express production server:

### Windows PowerShell

```powershell
$env:NODE_ENV="production"
npm run start
```

### Linux / macOS

```bash
NODE_ENV=production npm run start
```

Configure the required environment variables before starting the production server.

The production Express server serves the generated static Front-End assets and application API endpoints.

---

# Security Considerations

NEXUS uses server-side environment variables for Gemini API authentication.

Security considerations:

- Never commit API keys.
- Never expose private credentials in Front-End source code.
- Use environment-specific configuration.
- Protect production secrets.
- Configure appropriate server-side access controls before multi-user deployment.
- Validate incoming API requests.
- Apply rate limiting and abuse protection before exposing public endpoints.
- Use HTTPS in production.

The current project is a demonstration-oriented application and should undergo additional security hardening before handling sensitive enterprise information.

---

# Current Limitations

The current implementation is designed as a comprehensive SaaS demonstration application.

Some capabilities are simulated or use demonstration data.

Current considerations:

- The application uses demonstration datasets.
- Browser persistence is not a replacement for a centralized database.
- Multi-user authentication and authorization are not implemented as a complete production identity system.
- Gemini functionality requires a valid API key for external model access.
- AI fallback responses are deterministic demonstration responses.
- Production security controls and infrastructure require additional configuration.
- Enterprise integrations and external data synchronization are not included as fully implemented services.

These limitations do not prevent local execution or demonstration of the application's implemented functionality.

---

# Future Development Opportunities

Potential future extensions include:

- PostgreSQL database integration.
- FastAPI or expanded Node.js backend services.
- User authentication and role-based access control.
- Multi-tenant organization management.
- Real-time updates using WebSockets.
- Advanced audit logging.
- Automated testing.
- Advanced analytics pipelines.
- External enterprise integrations.
- Cloud deployment and monitoring.
- Advanced AI-powered forecasting.
- Centralized observability.

These are potential development directions and are not claims of currently implemented functionality.

---

# Contributing

Contributions, suggestions, and technical feedback are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Validate the application locally.
5. Commit your changes.
6. Open a Pull Request.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: describe your contribution"
git push origin feature/your-feature
```

Please maintain consistency with the existing architecture and coding conventions.

---

# License

A license has not yet been specified for this repository.

Before distributing or reusing the source code, the repository owner should select and add an appropriate license.

---

# Acknowledgments

NEXUS was developed using modern Front-End technologies and Google AI Studio as part of an exploration of AI-assisted software development and enterprise SaaS application engineering.

Special acknowledgment to the open-source communities behind:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Express.
- Recharts.
- Lucide.
- Motion.


---

<p align="center">
  <strong>NEXUS — AI Operations Platform</strong>
</p>

<p align="center">
  Intelligent Operations. Connected Teams. Better Decisions.
</p>

<p align="center">
  Built with React, TypeScript, Node.js and Google Gemini.
</p>
