# NexFlow CRM - Project Documentation

## Executive Summary

NexFlow CRM is a comprehensive Customer Relationship Management system designed specifically for medical equipment sales and service organizations. The platform provides end-to-end management of the sales pipeline from lead generation through quotation, demo, purchase order, and post-sale service management.

## Project Overview

**Project Name:** NexFlow CRM  
**Version:** 1.0.0  
**Platform Type:** Multi-tenant SaaS  
**Technology Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4  
**Target Users:** Medical equipment sales and service teams  
**Deployment:** Vercel (Next-lite runtime)

## Core Features

### 1. Lead Management
- Comprehensive lead tracking with customizable workflow statuses
- Lead scoring and classification (Cold, Warm, Hot, Existing Customer)
- Source tracking and lead introducer/broker management
- Territory-based assignment
- Automated follow-up reminders
- Status history with duration tracking
- Lead conversion tracking

### 2. Visit Management
- Visit scheduling with unique ID format (DDMMYYYY-XXX)
- Multiple visit types: Initial, Follow-up, Demo, Service
- Visit outcome tracking with predefined statuses
- Rescheduling management with reason tracking
- Follow-up visit scheduling
- Visit history and status tracking
- Integration with lead and customer records

### 3. Quotation Management
- Quote generation with product selection
- Multi-tier pricing (A, B, C, D, E categories)
- Approval workflow
- Quote tracking (Draft → Pending → Approved → Sent → Accepted/Declined)
- Quote validity management
- Terms and conditions customization
- Quote history and version tracking

### 4. Demo Management
- Product demonstration scheduling
- Demo outcome tracking
- Feedback collection
- Integration with quotation pipeline
- Demo-to-purchase conversion tracking

### 5. Service Request Management
- Service ticket creation and tracking
- Multiple issue types: Installation, Repair, Maintenance, Calibration, Training
- Priority management (Low, Medium, High, Urgent)
- Service scheduling and assignment
- Resolution tracking
- Service history

### 6. Dashboard & Analytics
- **Row 1:** Key Performance Indicators (8 metrics)
  - New Leads, Open Leads, Hot Leads
  - Appointments, Visits, Quotes
  - POs Received, Revenue Pipeline
  - All with trend indicators
  
- **Row 2:** Lead Funnel & Follow-up Risk
  - Horizontal lead funnel with conversion percentages
  - Overdue, Due Today, Due This Week tracking
  
- **Row 3:** Visit & Task Overview
  - Today's visits, Upcoming visits
  - Rescheduled and Missed visits
  - Task breakdown by role
  
- **Row 4:** Performance Snapshot
  - Salesperson-wise metrics
  - Target vs Achievement tracking

### 7. Workflow Management
- Custom workflow status creation
- Status transition rules
- Automation rules with triggers and actions
- Entity-specific workflows (Lead, Visit, Quotation, etc.)

### 8. Task Management
- Task creation and assignment
- Priority-based organization
- Due date tracking
- Entity linking (Link to Lead, Visit, Quote, etc.)
- Status tracking (Open → In Progress → Completed → Cancelled)

### 9. Company Management
- Company profile management
- Parent-subsidiary relationships
- Contact information tracking
- Company history and notes

### 10. Items/Services Catalog
- Product/service management
- Category organization
- Active/inactive status
- Integration with quotations

### 11. Tenant Management (Platform Admin)
- Multi-tenant organization setup
- Subscription plan management (Free, Starter, Professional, Enterprise)
- User capacity limits
- Custom domain support
- Tenant status management (Active, Inactive, Suspended)
- Admin contact management
- Billing configuration

### 12. Reports
- Comprehensive reporting module
- Custom report generation
- Data export capabilities

## Technology Stack

### Frontend Framework
- **Next.js 16:** React framework with App Router
- **React 19.2:** UI library with latest features (useEffectEvent, Activity)
- **TypeScript:** Type-safe development
- **Tailwind CSS v4:** Utility-first CSS framework with custom design tokens

### UI Components
- **shadcn/ui:** Component library
- **Radix UI:** Headless UI primitives
- **Lucide Icons:** Icon system
- **Recharts:** Data visualization

### State Management
- **Custom hooks:** useDataStore for global state
- **Local Storage:** Client-side data persistence
- **SWR:** Data fetching and caching (recommended for future)

### Development Tools
- **ESLint:** Code linting
- **Prettier:** Code formatting
- **TypeScript:** Static type checking

## Architecture

### Directory Structure

```
nexflow-crm/
├── app/
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles and design tokens
│   └── dashboard/
│       ├── page.tsx              # Main dashboard
│       ├── leads/                # Lead management routes
│       ├── visits/               # Visit management routes
│       ├── quotations/           # Quotation routes
│       ├── demos/                # Demo routes
│       ├── service/              # Service request routes
│       ├── companies/            # Company management
│       ├── items-services/       # Product catalog
│       ├── tasks/                # Task management
│       ├── workflow/             # Workflow configuration
│       ├── reports/              # Reporting module
│       └── tenants/              # Tenant management (admin)
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard components
│   │   ├── dashboard-shell.tsx  # Main layout wrapper
│   │   ├── breadcrumb-navigation.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── lead-funnel-chart.tsx
│   │   ├── follow-up-risk.tsx
│   │   ├── visit-activity-overview.tsx
│   │   ├── task-overview.tsx
│   │   └── performance-snapshot.tsx
│   ├── leads/                    # Lead components
│   ├── visits/                   # Visit components
│   ├── quotations/               # Quotation components
│   ├── demos/                    # Demo components
│   ├── service/                  # Service components
│   ├── companies/                # Company components
│   ├── items-services/           # Product catalog components
│   ├── tasks/                    # Task components
│   ├── tenants/                  # Tenant management components
│   └── theme/                    # Theme switcher
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── data-store.ts             # Global state management
│   ├── mock-data.ts              # Sample data for development
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

### Data Models

#### Core Entities

1. **Lead**
   - Personal information (name, email, phone)
   - Company details
   - Status and workflow tracking
   - Lead scoring and classification
   - Source tracking
   - Product interests
   - Status history

2. **Visit**
   - Unique ID format: DDMMYYYY-XXX
   - Customer/Lead reference
   - POC details
   - Visit type and purpose
   - Schedule and status
   - Outcome tracking
   - Follow-up management

3. **Quotation**
   - Quote number
   - Customer reference
   - Product line items
   - Pricing tiers
   - Approval workflow
   - Validity period
   - Terms and conditions

4. **Service Request**
   - Ticket number
   - Customer and product reference
   - Issue type and priority
   - Assignment and scheduling
   - Resolution tracking

5. **Tenant**
   - Organization details
   - Subscription plan
   - User capacity
   - Admin contact
   - Status and billing

#### Supporting Entities
- User (with role-based access)
- Company
- Product/Service
- Demo
- Task
- WorkflowStatus
- Activity

### User Roles

1. **Sales Manager**
   - Full access to sales pipeline
   - Team performance monitoring
   - Approval authority

2. **Sales Coordinator**
   - Lead management
   - Visit coordination
   - Quotation support

3. **Sales Executive**
   - Lead handling
   - Visit execution
   - Customer interaction

4. **Field Executive (FE)**
   - On-site visit execution
   - Customer engagement
   - Field reporting

5. **Customer Care Executive (CCE)**
   - Customer support
   - Service coordination
   - Follow-up management

6. **Service Manager**
   - Service team oversight
   - Service quality monitoring

7. **Service Coordinator**
   - Service scheduling
   - Technician assignment

8. **Service Executive**
   - Service execution
   - Issue resolution

9. **Admin**
   - System configuration
   - User management
   - Workflow setup

10. **Platform Admin** (Super Admin)
    - Tenant management
    - System-wide configuration
    - Multi-tenant oversight

## Design System

### Color Themes

NexFlow CRM features 6 pre-built color themes inspired by modern SaaS applications:

1. **Default (Green)** - Fresh, professional
2. **Blue** - Trust, corporate
3. **Green** - Growth, success
4. **Orange** - Energy, creative
5. **Rose** - Elegant, modern
6. **Teal** - Balance, calm

### Design Tokens

```css
--background: Clean white/light backgrounds
--foreground: Dark text for readability
--primary: Theme-specific accent color
--card: White cards with subtle shadows
--sidebar: Dark navy (#1A1D2E) for navigation
--border: Light gray borders
--radius: 0.75rem (12px) for rounded corners
```

### Status Colors

- **Active/Success:** Green (#10B981)
- **Prospect/Warning:** Yellow/Amber (#F59E0B)
- **Inactive/Neutral:** Gray (#6B7280)
- **Error/Urgent:** Red (#EF4444)

### Typography

- **Font Family:** Geist Sans (primary), Geist Mono (code)
- **Font Sizes:** Responsive scale from 0.75rem to 2rem
- **Line Heights:** 1.4-1.6 for body text
- **Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Layout Principles

1. **Flexbox-first:** Use flex for most layouts
2. **Grid for complex layouts:** 2D arrangements
3. **Spacing scale:** Consistent 4px-based spacing
4. **Responsive design:** Mobile-first approach
5. **Card-based UI:** Information grouped in white cards
6. **Generous whitespace:** Clean, uncluttered interface

### Component Patterns

- **Dashboard Cards:** Rounded, shadowed, hover effects
- **Data Tables:** Striped rows, hover highlights
- **Forms:** Clear labels, validation feedback
- **Buttons:** Primary (green), secondary (gray), destructive (red)
- **Status Badges:** Colored pills with clear labels
- **Breadcrumbs:** Navigation hierarchy
- **Modals:** Centered dialogs for focused tasks

## Key Features Implementation

### Dashboard Command Center

The dashboard follows a structured layout designed to provide critical information at a glance:

**Row 1 - KPI Cards (8 cards)**
- Visual metrics with trend indicators
- Color-coded status
- Percentage changes from previous period

**Row 2 - Pipeline & Risks (2 sections)**
- Horizontal lead funnel with conversion rates
- Follow-up risk indicators (Overdue, Today, This Week)

**Row 3 - Activity Overview (2 sections)**
- Visit activity breakdown
- Task summary by role

**Row 4 - Performance Metrics**
- Salesperson performance snapshot
- Individual targets and achievements

### Workflow System

The workflow system allows complete customization:

1. **Status Definition**
   - Custom status names
   - Color coding
   - Order sequencing

2. **Transition Rules**
   - Define allowed status changes
   - Prevent invalid transitions

3. **Automation Rules**
   - Trigger-based actions
   - Field updates
   - Notifications
   - Task creation

### Multi-tenant Architecture

The platform supports multiple organizations:

1. **Tenant Isolation**
   - Data segregation
   - User isolation
   - Configuration independence

2. **Subscription Management**
   - Plan-based feature access
   - User capacity limits
   - Billing integration ready

3. **Admin Portal**
   - Tenant creation and management
   - Status monitoring
   - User analytics

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

### Installation

1. **Download the project**
   ```bash
   # Download ZIP from v0.dev or clone from repository
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open browser**
   ```
   Navigate to http://localhost:3000
   ```

### Configuration

1. **Environment Variables** (if needed in future)
   ```
   NEXT_PUBLIC_API_URL=
   DATABASE_URL=
   ```

2. **Theme Customization**
   - Edit `app/globals.css` for design tokens
   - Modify color variables in the `:root` selector

3. **Mock Data**
   - Sample data is in `lib/mock-data.ts`
   - Customize for your use case

## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Click "Publish" in v0.dev interface
   - Or import GitHub repository to Vercel

2. **Configure Project**
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`

3. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for branches

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Self-hosted with Node.js

## Future Enhancements

### Phase 1 - Backend Integration
- Database integration (Supabase/Neon recommended)
- User authentication
- API development
- Real-time updates

### Phase 2 - Advanced Features
- Email integration
- WhatsApp notifications
- SMS alerts
- Document generation (PDF quotations)
- E-signature for approvals

### Phase 3 - Business Intelligence
- Advanced analytics
- Custom report builder
- Data export (Excel, CSV)
- Dashboard customization
- Forecasting and predictions

### Phase 4 - Mobile App
- React Native mobile app
- Offline mode
- Push notifications
- Camera integration for site visits

### Phase 5 - Integrations
- Email providers (Gmail, Outlook)
- Calendar sync
- Accounting software
- Payment gateways
- Third-party CRM export

## Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions

### Performance
- Use React Server Components where possible
- Implement pagination for large lists
- Lazy load heavy components
- Optimize images and assets

### Security
- Implement authentication before production
- Use Row Level Security (RLS) for database
- Validate all inputs
- Sanitize user-generated content
- Use HTTPS in production

### Data Management
- Never use localStorage for production (security risk)
- Implement database with proper relationships
- Use transactions for critical operations
- Implement data backup strategy

## Support & Maintenance

### Documentation
- Keep this document updated
- Document custom modifications
- Maintain API documentation
- Create user guides

### Testing
- Implement unit tests
- Add integration tests
- Perform user acceptance testing
- Test across browsers and devices

### Monitoring
- Implement error tracking (Sentry recommended)
- Monitor performance metrics
- Track user analytics
- Set up uptime monitoring

## License & Credits

**Project:** NexFlow CRM  
**Created with:** v0.dev by Vercel  
**Framework:** Next.js 16  
**UI Components:** shadcn/ui  
**Icons:** Lucide Icons  

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained by:** Development Team
