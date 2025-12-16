# AIGI Dual-Portal Design Guidelines

## Design Approach
**Selected Approach:** Professional Design System with Luxury Scientific Aesthetics

Drawing inspiration from high-trust institutional sites like GIA (Gemological Institute of America) and luxury science platforms, combining Material Design's structured approach with gemological sophistication. This creates credibility while showcasing the beauty of precious stones.

**Core Principles:**
- Scientific precision with elegant presentation
- Trust through clean, professional layouts
- Gemstone-inspired visual hierarchy
- Dual-portal clarity (distinct yet connected experiences)

## Typography

**Font Families:**
- Primary: Inter (headings, UI elements) - clean, professional, scientific
- Secondary: Crimson Pro (accent headlines, luxury touch)
- System: SF Pro/Segoe UI for body text (readability)

**Hierarchy:**
- Hero Headlines: 3xl to 5xl, font-weight-600
- Section Headers: 2xl to 3xl, font-weight-600
- Subsections: xl, font-weight-500
- Body Text: base to lg, font-weight-400, leading-relaxed
- Captions/Labels: sm, font-weight-500

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6, p-8
- Section spacing: py-16, py-20, py-24
- Card gaps: gap-6, gap-8
- Margins: m-4, m-6, m-8

**Grid Structure:**
- Max container: max-w-7xl
- Content sections: max-w-6xl
- Text content: max-w-4xl
- Multi-column: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for features/services

## Component Library

### Public Website Components

**Navigation:**
- Sticky header with transparent-to-solid on scroll
- Logo left, nav center/right
- "Verify Certificate" CTA button (prominent)
- "Staff Login" link (subtle, top-right)
- Mobile: Hamburger menu

**Hero Section:**
- Full-width with large hero image (gemstones, laboratory equipment, or precision testing)
- Overlay with semi-transparent gradient
- Centered headline + subheadline
- Two CTAs: "Verify Certificate" (primary) + "Learn More" (secondary)
- Height: 70vh to 85vh
- Button backgrounds: backdrop-blur-md with subtle transparency

**About AIGI Section:**
- Two-column layout: Timeline/history left, achievements/stats right
- Key metrics highlighted: "Since 2004", "5 Locations", "Research Since 2006"
- Cards with subtle borders, not heavy shadows

**Services Grid:**
- 3-column grid (lg), 2-column (md), 1-column (mobile)
- Icon + title + description cards
- Hover: subtle lift effect (transform translate-y-1)

**Certificate Verification:**
- Centered section with prominent input field
- Large search box with "Verify" button
- Results display as card with certificate details
- Security badge/seal visual indicator

**Client Sectors:**
- Horizontal scrolling cards or 4-column grid
- Icons representing each sector
- Brief descriptions
- Professional imagery (diamonds, jewelry, mining)

**Gallery:**
- Masonry grid layout (Pinterest-style) or 3-column grid
- Lightbox modal on click
- Categories: Labs, Equipment, Seminars, Research
- Lazy loading for performance

**Announcements/Research:**
- Card-based layout, newest first
- Each card: title, date, excerpt, "Read More" link
- Sidebar for filtering by category
- Auto-updates from staff uploads

**Education Section:**
- Hero sub-section for seminars
- Course cards with registration links
- Clear "Student Login" button
- Upcoming events calendar

**Contact Page:**
- Two-column: Form left, branch info + map right
- Branch cards with addresses, phones
- Embedded Google Maps
- Query form with validation

**Footer:**
- Four-column layout: About, Quick Links, Contact, Social
- Newsletter signup (optional)
- All branch addresses
- Certifications/accreditations logos

### Staff Admin Portal Components

**Login Page:**
- Centered card design
- Username/password fields
- Secure badge/icon
- Clean, minimal - no distractions
- "AIGI Staff Portal" branding

**Dashboard:**
- Sidebar navigation (persistent)
- Top bar with user info + logout
- Grid of action cards: Upload Certificate, Manage Announcements, View Submissions
- Recent activity feed
- Quick stats overview

**Certificate Upload:**
- Multi-step form: Details → Upload PDF/Image → Preview → Submit
- Drag-and-drop file upload area
- Auto-generated certificate number option
- Preview before publishing
- Success confirmation with link to public verification

**Content Managers:**
- Table layouts for viewing existing items
- Action buttons: Edit, Delete, Archive
- "Add New" button (prominent)
- Rich text editor for announcements/research
- Image upload for gallery with crop/resize

**Branch Manager:**
- Editable cards for each location
- Map integration for address verification
- Phone/email validation
- Add/remove branch capability

**Submissions Viewer:**
- Table with filters: Date, Status, Branch
- Click to view full submission
- Mark as read/responded
- Export capability

## Images

**Hero Image:**
Large, high-quality hero image required for public homepage showing:
- Close-up of diamond/gemstone under microscopic examination, OR
- Professional laboratory with testing equipment, OR
- Gemologist examining stones with precision tools
- Placement: Full-width hero section with overlay gradient (dark bottom to transparent top)
- Dimensions: 1920x1080 minimum for desktop

**Additional Images:**
- Services Section: Icons/illustrations for each service (not photos)
- Client Sectors: Professional stock imagery of diamonds, jewelry manufacturing, retail
- Gallery: Actual lab photos, seminar shots, equipment close-ups, research activities
- About Section: Timeline graphics, laboratory interior, team at work
- Certificate Verification: Security badge/seal graphic when verification succeeds

**Image Treatment:**
- Subtle overlays where text appears on images
- Consistent aspect ratios: 16:9 for hero, 4:3 for cards, 1:1 for thumbnails
- Professional color grading - avoid oversaturation

## Visual Elements

**Borders & Shadows:**
- Subtle borders: border-gray-200
- Cards: shadow-sm on default, shadow-md on hover
- Inputs: focus:ring-2 for accessibility
- No heavy drop shadows - keep it clean

**Icons:**
Use Heroicons throughout:
- Navigation: menu, X, search, user
- Services: beaker, sparkles, academic-cap, document-check
- Admin: upload, edit, trash, eye, check-circle

**Spacing & Rhythm:**
- Section padding: py-20 on desktop, py-12 on mobile
- Consistent card padding: p-6 or p-8
- Form spacing: space-y-6 for inputs
- Grid gaps: gap-6 or gap-8

**Responsive Behavior:**
- Mobile-first approach
- Collapse multi-column to single on mobile
- Hamburger menu below lg breakpoint
- Touch-friendly targets (min 44x44px)

## Distinctive Design Elements

**Public Site:**
- Gemstone-inspired accent patterns (subtle geometric backgrounds)
- Professional photography showcasing precision and luxury
- Trust indicators: Security badges, certifications, "Since 2004"
- Clear separation between informational and action sections

**Staff Portal:**
- High contrast for readability
- Data-dense tables with proper spacing
- Confirmation modals for destructive actions
- Success/error state feedback
- Upload progress indicators

## Interaction Patterns

**Buttons:**
- Primary: Solid with hover:brightness-110
- Secondary: Outline with hover:bg-gray-50
- Text buttons for tertiary actions
- Disabled state: opacity-50, cursor-not-allowed

**Forms:**
- Clear labels above inputs
- Helper text below fields
- Validation messages inline
- Required field indicators

**No Animations:**
Minimal animations - only subtle hover states and page transitions. No scroll-triggered animations, parallax, or complex effects. Keep it professional and fast.