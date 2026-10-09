# Connecting the Dots 🌐

> **“Discover what you are missing. Connect with the right people. Turn your goals into progress.”**

Connecting the Dots is a goal-driven collaboration and opportunity discovery platform for startup founders, creators, independent professionals, and mentors.

Unlike social media feeds or resume directories, Connecting the Dots begins with a specific **Goal**, runs it through an explainable **Missing-Piece Discovery Engine** to uncover critical gaps, surfaces complementary people and offers, and empowers users to manage collaborative execution through shared workspaces.

---

## 🌟 Core Product Features

### 1. Goal-Driven Foundation
- Define goals across core templates:
  - **Build an Idea into a Project**
  - **Find Help for a Specific Task**
  - **Find First Users or Customers**
  - **Custom Initiatives**
- Captures existing skills, missing skills, collaboration styles, timelines, and budgets.

### 2. Missing-Piece Discovery Engine
- Deterministic, explainable rule engine that analyzes goal categories, technical vs. design capabilities, and intent.
- Provides actionable suggestions with confidence scores, explaining **why** the piece matters and **what action to take next**.
- Users can accept, edit, dismiss, resolve, or create custom missing pieces.

### 3. Transparent Matching Engine
- Every recommendation answers:
  1. *What is this user or resource?*
  2. *Why is it relevant to my goal?*
  3. *Which missing piece could it help solve?*
  4. *What can I do next?*
- Evaluates skill complementarity, collaboration style compatibility, budget affordability, and remote preferences.
- **"Explore Beyond Your Usual Circle"**: surfaces adjacent, high-leverage domains (e.g. user research or community building for an engineer).

### 4. Intentional Connection Workflow
- Senders provide personalized messages tied to specific goals or offers.
- **Recipient retains 100% control** over accepting or declining requests.
- Automatic prevention of duplicate pending requests and self-requests.

### 5. Collaboration Workspaces
- Shared workspaces initialized upon accepted connections.
- Task tracking with status (`todo`, `in_progress`, `review`, `done`) and priorities.
- Milestone tracking and real-time progress update feeds.

### 6. One-to-One Messaging
- Private messaging with conversation membership authorization.
- Real-time responsive layout and unread notification indicators.

### 7. Community Safety & Moderation
- Incident reporting for profiles, offers, goals, and messages.
- Protected admin dashboard (`/admin`) with role-based authorization to review and act on reports.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, React Server Components & Client Components)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS with custom Deep Navy & Warm Gold design system tokens
- **Icons**: Lucide React
- **Validation**: Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & `@supabase/ssr`
- **Testing**: Vitest automated test suite

---

## 📂 Project Architecture

```
connecting-the-dots/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login, Signup, Forgot Password
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── (app)/              # Authenticated App Shell & Pages
│   │   │   ├── dashboard/      # Progress-oriented Dashboard
│   │   │   ├── goals/          # Goals listing, creation, and detail
│   │   │   ├── discover/       # Matching & Discovery Engine
│   │   │   ├── offers/         # Offers & Services marketplace
│   │   │   ├── connections/    # Connection request workflow
│   │   │   ├── messages/       # 1-to-1 Messaging
│   │   │   ├── collaborations/ # Workspaces, Tasks, Milestones
│   │   │   ├── notifications/  # In-app notifications
│   │   │   ├── settings/       # Account & profile settings
│   │   │   └── admin/          # Community safety & moderation
│   │   ├── onboarding/         # New user onboarding flow
│   │   ├── about/              # Mission & background
│   │   ├── how-it-works/       # 4-step workflow breakdown
│   │   ├── privacy/            # Privacy Policy
│   │   ├── terms/              # Terms of Service
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Public landing page
│   ├── components/
│   │   ├── ui/                 # BrandLogo, Button, Badge, Card, EmptyState, Skeleton
│   │   └── layout/             # Navbar, Footer, AppHeader, AppSidebar
│   ├── lib/
│   │   ├── engine/             # missing-pieces.ts & matching.ts engines
│   │   ├── supabase/           # client.ts, server.ts, admin.ts, config.ts
│   │   ├── validations/        # Zod validation schemas
│   │   └── data-provider.ts    # Store & Supabase data bridge
│   ├── types/
│   │   └── database.ts         # TypeScript database definitions
│   └── middleware.ts           # Route protection & session validation
├── supabase/
│   ├── migrations/             # 20261009000001_initial_schema.sql (All 13 tables + RLS)
│   └── seed.sql                # Realistic seed data
├── tests/                      # Automated unit and integration tests
├── .env.example                # Sample environment variables
├── tailwind.config.ts          # Brand color configuration
├── tsconfig.json               # Strict TypeScript config
└── vitest.config.ts            # Test runner config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or newer (Tested on Node 24 LTS)
- npm 9.x or newer

### Installation
1. Clone or navigate to the project directory:
   ```bash
   cd connecting-the-dots
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note for Local Evaluation**: If `.env.local` is left unconfigured, the application automatically runs in local development mode using the rich seed dataset. You can immediately click through all pages, goals, missing piece engines, and connections!

---

## 🗄️ Database Setup & Migrations

To apply the schema to a live Supabase instance:
1. Open your Supabase SQL Editor.
2. Run the SQL in `supabase/migrations/20261009000001_initial_schema.sql`.
   - Creates all tables (`profiles`, `goals`, `goal_missing_pieces`, `offers`, `connection_requests`, `connections`, `conversations`, `messages`, `collaborations`, `tasks`, `milestones`, `notifications`, `reports`).
   - Configures triggers for `updated_at`, profile creation on signup, and `accept_connection` procedure.
   - Enables Row Level Security (RLS) on **every** table.
3. (Optional) Run `supabase/seed.sql` to populate sample profiles, goals, and offers.

### Creating an Admin Account Securely
Run the following SQL query in the Supabase SQL Editor to elevate an authorized user:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = '<USER_UUID>';
```
*(Row Level Security triggers prevent ordinary users from self-assigning admin privileges).*

---

## 🧪 Testing & Validation

Run the automated test suite:
```bash
npm test
```
Runs 13 unit and integration tests covering:
- Missing-Piece Discovery Engine logic
- Complementarity scoring and explainable matching
- Zod validation schemas
- Connection request lifecycle, self-request prevention, and task status transitions

---

## 🏗️ Production Build

To build the application for production:
```bash
npm run build
```

To run the production server:
```bash
npm start
```

---

## 🛡️ Security & Privacy Architecture

- **Row Level Security (RLS)** enforced on all exposed PostgreSQL tables.
- **Server-side authorization** checks for mutations (connection requests, task editing, messaging).
- **Service role keys** are strictly confined to server-only admin actions and never exposed to the client bundle.
- **Recipient Control**: No user can force a direct conversation without an explicit connection request acceptance.
