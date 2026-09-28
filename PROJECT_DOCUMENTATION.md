# MADHAV REAL ESTATE — PROJECT BLUEPRINT & TECH STACK

This document serves as the comprehensive master reference for the Madhav Real Estate platform. It details every aspect of the system, from high-level business goals to the underlying technologies, database schemas, and design philosophy.

---

## 1. BUSINESS MODEL & PLATFORM PURPOSE

**Core Concept:** A Premium Private Lead-Generation System.
- This website is **NOT** a public property portal (like MagicBricks or 99acres).
- It does **NOT** expose public property inventory, prices, owner details, or customer information.
- The platform functions as a **digital concierge** that connects clients directly with the broker (Jayeshbhai) for highly personalized property guidance.
- Customers submit requirements (Buy, Sell, Rent, Rent Out) privately.

---

## 2. TECH STACK

**Frontend:**
- **Framework:** React 18 (built with Vite for fast HMR and optimized builds)
- **Routing:** React Router v6 (`react-router-dom`)
- **Styling:** Tailwind CSS v3 (Utility-first CSS framework)
- **Animations:** Framer Motion (used for cinematic transitions, scroll reveals, and micro-interactions)
- **Icons:** Lucide React
- **Typography:** Google Fonts (`Outfit` for a premium, sans-serif, modern aesthetic)

**Backend & Database:**
- **BaaS (Backend as a Service):** Supabase
- **Database:** PostgreSQL (Relational Database)
- **Authentication:** Supabase Auth (for Admin access)
- **Security:** PostgreSQL Row Level Security (RLS) policies

---

## 3. DATABASE SCHEMA & SECURITY (SUPABASE)

### Table: `enquiries`
Stores all customer requirements and leads securely.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `intent` | Text | 'Buy', 'Sell', 'Rent', 'RentOut' |
| `name` | Text | Customer Name |
| `phone` | Text | Customer Phone Number |
| `location` | Text | Preferred Area / Location |
| `property_type` | Text | e.g., Apartment, Villa, Commercial |
| `bhk` | Text | e.g., 1 BHK, 2 BHK, 3 BHK |
| `budget` | Text | Expected Budget |
| `purpose` | Text | e.g., Residential, Investment |
| `move_in_time` | Text | e.g., Immediate, 1 Month |
| `property_area` | Text | Square footage/yards |
| `furnishing_status`| Text | e.g., Fully Furnished, Unfurnished |
| `additional_details`| Text | Any extra notes from the customer |
| `status` | Text | Lead status (e.g., 'new', 'contacted') |
| `created_at` | Timestamp| When the enquiry was submitted |
| `updated_at` | Timestamp| Last update time |

### Security Model (Row Level Security - RLS)
The system is heavily locked down to protect privacy.
- **PUBLIC / ANONYMOUS USERS:** 
  - ✅ Can **INSERT** (submit) new enquiries via the Lead Form.
  - ❌ Cannot `SELECT` (read) any enquiries.
  - ❌ Cannot `UPDATE` any enquiries.
  - ❌ Cannot `DELETE` any enquiries.
- **AUTHENTICATED ADMINS (Jayeshbhai/Team):**
  - ✅ Can `SELECT`, `UPDATE`, and `DELETE` enquiries.
  - Managed via an `is_admin()` PostgreSQL function and an `admin_users` table structure.

---

## 4. UI/UX DESIGN SYSTEM

**Philosophy:** "LESS, BUT BETTER"
The design aims for a cinematic, editorial, and highly polished luxury real-estate aesthetic.

### Brand Colors (`tailwind.config.js`):
- **Primary / Dark (`brand-900`):** Charcoal/Near-black (e.g., `#171717`) — Used for backgrounds, primary text, and dark mode sections.
- **Accent (`brand-500`):** Muted Bronze/Gold (e.g., `#C6A15B`) — Used sparingly for active states, small text (eyebrows), icons, and hover highlights.
- **Light (`brand-50` / `white`):** Warm whites — Used for light section backgrounds.

### Typography:
- **Font Family:** `Outfit` (sans-serif).
- **Scale:** High contrast. Very large, bold tracking-tight headings (e.g., `text-[84px]`) paired with small, uppercase, tracking-widest text (e.g., `text-[10px] tracking-[0.3em]`) for metadata/eyebrows.

### Micro-Interactions & Transitions:
- **Duration:** Kept snappy. Generally `300ms` (`duration-300 ease-out`).
- **Hover Effects:** Subtle glassmorphism, slight group-hover arrow translations (`translate-x-2`), and grayscale-to-color image transitions. Avoid excessive blur or sluggish 700ms animations.

---

## 5. CORE COMPONENTS & ROUTING

### Public Routes:
- `/` — Home (Cinematic hero, services intent cards, broker profile, areas)
- `/services` — Detailed breakdown of Buy/Sell/Rent services
- `/about` — About Madhav Real Estate & Jayeshbhai
- `/contact` — Standard contact information

*Note: There are NO public routes for property listings (`/properties` or `/properties/:id` were removed to enforce the private business model).*

### Key Components:
1. **`Navbar.jsx`:**
   - Features a dynamic scrolling state. 
   - Top of page (Hero): Transparent background, white text.
   - Scrolled: Transitions into a floating, rounded, blurred container with dark text for contrast.
   - Mobile: Edge-to-edge animated drawer using Framer Motion.

2. **`LeadFormModal.jsx`:**
   - The primary conversion engine.
   - Triggered via URL query parameters (`?intent=Buy`, `?intent=Rent`).
   - Dynamically parses the URL for parameters like `?area=Vesu` to automatically pre-fill the `location` field in the form.
   - Multi-step form that captures data and securely inserts it into Supabase.

3. **`Home.jsx`:**
   - **Hero:** Full-screen cinematic architecture image with text-readability gradients and high-impact typography.
   - **Intent Cards:** Asymmetrical, editorial-style layout numbered 01-04 for Buy/Sell/Rent/Rent Out.
   - **Areas Section:** Interactive grid. Clicking an area (e.g., Vesu) links to `/?intent=Buy&area=Vesu`, launching the pre-filled lead form.

4. **`Footer.jsx`:**
   - Dark, sophisticated footer.
   - Contains genuine trust signals ("Direct Broker Communication", "No middlemen").
   - Direct WhatsApp integration links.

---

## 6. EXTERNAL INTEGRATIONS

- **WhatsApp API:** 
  Direct links to Jayeshbhai's WhatsApp (`https://wa.me/919909253997?text=Hello...`). Used as a primary secondary-CTA across the site for fast, direct communication.
- **Unsplash (or similar CDNs):**
  Used for premium, high-resolution architectural placeholder imagery.

---

## 7. FUTURE EXPANSION (ADMIN)

While the public frontend is complete, the architecture supports a private Admin Dashboard. Since the Supabase RLS is configured securely, an authenticated React route (e.g., `/admin`) can safely execute `SELECT` and `UPDATE` queries to manage lead statuses (e.g., moving a lead from "New" to "Contacted").
