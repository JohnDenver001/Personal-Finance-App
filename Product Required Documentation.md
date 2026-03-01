# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Pulse — AI-Assisted Personal Finance Mobile App

---

## Project Overview

Pulse is a mobile-first, AI-assisted personal finance application focused on budget control.

The goal is to help users track income and expenses manually, detect spending patterns, and receive intelligent financial insights. The app prioritizes simplicity, clarity, and behavioral feedback over complexity.

This MVP starts with manual transaction input only. AI assistance is layered on top of user-provided data to generate insights, detect patterns, and suggest improvements.

Pulse is not an accounting system.  
It is a budgeting intelligence system.

---

## Level

Medium

---

## Type of Project

- Mobile App Development  
- AI-Assisted Financial Tool  
- Behavioral Finance Application  

---

## Skills Required

- React Native / Flutter (Mobile Development)
- Backend (Node.js / Supabase / Firebase)
- Database Design (PostgreSQL / Firestore)
- OpenAI API Integration
- Financial Data Modeling
- Minimal UI/UX Design

---

# 1. What is the App?

## Product Definition

Pulse is an AI-assisted budgeting app that helps users control spending through:

- Manual expense tracking
- Smart categorization
- Behavioral pattern detection
- Weekly financial insights
- Budget performance scoring

The core focus is budget control.

---

## Core Objective

Help users gain visibility and control over:

- Where their money goes
- When they overspend
- Why spending patterns occur
- How to adjust behavior

---

## Target Users

- Students
- Young professionals
- Freelancers
- Anyone earning income but struggling with budgeting
- Users overwhelmed by complex finance apps

---

# 2. How Do I Use the App?

## Onboarding Flow

1. Create account
2. Input:
   - Monthly income
   - Fixed recurring expenses
   - Current savings
   - Debt (optional)
3. Set monthly budget limit
4. Select financial focus:
   - Strict Control
   - Balanced
   - Flexible

AI generates:
- Suggested category budgets
- Overspending risk level
- Initial financial insight

---

## Daily Usage

User logs a transaction:

- Amount
- Category (manual or AI suggestion)
- Optional note

AI automatically:
- Suggests category based on description
- Updates remaining monthly budget
- Tracks spending velocity

Home Dashboard Displays:

- Remaining budget
- Daily safe-to-spend amount
- Spending progress bar
- Financial discipline score

---

## Weekly Flow

Every 7 days, AI generates:

- Spending pattern summary
- Overspending categories
- Time-based behavior insights
- Budget adjustment suggestions

Example Insight:
"You spent 35% of your food budget in the first 10 days of the month."

---

## Monthly Flow

At month-end, the system generates:

- Budget performance report
- Spending vs planned comparison
- Behavior trend summary
- Recommended adjustments for next month

---

# 3. What Are the Patterns Behind the App?

Pulse is built on behavioral finance patterns.

---

## Pattern 1: Cash Flow Control

Income – Spending = Control

The system monitors spending relative to time passed in the month.

If 60% of the budget is spent within 40% of the month → early warning trigger.

---

## Pattern 2: Spending Velocity

Tracks:

- Percentage of budget used
- Percentage of month passed
- Velocity ratio

If Velocity Ratio > 1 → Overspending risk alert.

---

## Pattern 3: Category Weak Points

Identifies:

- Top 3 highest variance categories
- Most frequent impulse category
- Weekend vs weekday spending differences

---

## Pattern 4: Payday Effect

Detects spending spikes within 72 hours after income is received.

---

## Pattern 5: Consistency Score

Measures:

- Logging consistency
- Staying within total budget
- Category adherence
- Savings allocation

---

# 4. How Do I Excel at the App?

Pulse includes a Financial Discipline Score (0–100).

Score Factors:

1. Staying within total monthly budget
2. Staying within category budgets
3. Controlling spending velocity
4. Logging transactions consistently
5. Allocating savings

---

## User Progression Levels

- Level 1: Aware (Tracks regularly)
- Level 2: Controlled (Stays within budget)
- Level 3: Stable (Builds savings)
- Level 4: Optimized (Low spending variance)
- Level 5: Disciplined (Predictable financial behavior)

---

# Key Features

---

## Milestone 1: Core Budget Engine (MVP)

- Manual transaction input
- Custom categories
- Monthly budget setup
- Real-time remaining balance
- Spending progress visualization
- Secure authentication
- Local currency support

Deliverable: Functional manual budgeting mobile app.

---

## Milestone 2: AI Assistance Layer

- AI category suggestion
- Weekly financial summary generation
- Overspending alerts
- Behavioral insights
- Budget adjustment recommendations

Deliverable: AI-powered feedback system.

---

## Milestone 3: Intelligence Dashboard

- Spending heatmap (day/time)
- Spending velocity indicator
- Financial health score visualization
- Risk alerts
- Streak tracking system

Deliverable: Advanced insights dashboard.

---

# Success Metrics (MVP)

- 70% weekly retention
- 60% of users log transactions 4+ days per week
- 50% stay within budget for first month
- Average session time > 2 minutes

---

# Design Principles

- Minimal UI
- Maximum 3 taps to log expense
- Clear typography
- No financial jargon
- Dark and Light mode
- Bottom navigation:
  - Dashboard
  - Add Transaction
  - Insights
  - Profile

---

# High-Level Data Model

## User

- id
- monthly_income
- monthly_budget_limit
- preferences
- created_at

## Transaction

- id
- user_id
- amount
- category_id
- timestamp
- note
- created_at

## Category

- id
- user_id
- name
- monthly_budget_allocation

## Insight

- id
- user_id
- type
- generated_text
- created_at

---

# Recommended Tech Stack

## Frontend

- React Native (Expo)

## Backend

- Supabase / Firebase

## Database

- PostgreSQL (Supabase) or Firestore (Firebase)

## AI Layer

- OpenAI API for:
  - Insight generation
  - Category prediction
  - Behavioral summaries

## Authentication

- Supabase Auth / Firebase Auth

---

# Future Expansion (Post-MVP)

- Bank API integration
- Investment tracking
- Debt payoff planner
- Shared budgets (couples/families)
- Web dashboard
- Advanced financial forecasting

---

# Summary

Pulse is a mobile-first AI-assisted budgeting system designed to help users control spending through visibility, pattern recognition, and behavioral feedback.

The MVP focuses on manual tracking + AI insights.

The long-term vision is to evolve into a full financial operating system.