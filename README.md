# Mohd Faiz Qureshi — Portfolio Website

A dark-themed, animated personal portfolio single-page application built with **React 19** and **Vite**, showcasing my resume: professional summary, career timeline, skills, leadership responsibilities, and a contact form. The site is fully static and designed to be deployed to **AWS S3 + CloudFront**.

Live sections: Hero · About · Journey (Timeline) · Skills · Leadership · Contact

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Getting Started (Local Development)](#getting-started-local-development)
5. [Available Scripts](#available-scripts)
6. [Building for Production](#building-for-production)
7. [Previewing the Production Build](#previewing-the-production-build)
8. [Deploying to AWS S3 + CloudFront](#deploying-to-aws-s3--cloudfront)
9. [Git Workflow: Add, Commit & Push to GitHub](#git-workflow-add-commit--push-to-github)
10. [Customizing Content](#customizing-content)
11. [Contact Form Note](#contact-form-note)
12. [Code Conventions](#code-conventions)
13. [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Concern              | Choice                                            |
| --------------------- | -------------------------------------------------- |
| UI library            | [React 19](https://react.dev/)                     |
| Build tool / bundler  | [Vite](https://vite.dev/)                           |
| Animations            | [Framer Motion](https://motion.dev/)                |
| Icons                 | [react-icons](https://react-icons.github.io/react-icons/) (Font Awesome, Simple Icons, Tabler) |
| Styling               | Plain CSS with CSS custom properties (design tokens), component-scoped stylesheets |
| Language              | JavaScript (JSX) with JSDoc annotations             |
| Linting               | [oxlint](https://oxc.rs/)                           |

No backend, database, or server-side rendering is used — the app builds down to static HTML/CSS/JS assets.

---

## Project Structure

```
portfolio-website/
├── public/                      # Static assets copied as-is to the build output
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/               # Profile photo and other images bundled by Vite
│   ├── components/
│   │   ├── common/                # Reusable, presentation-only building blocks
│   │   │   ├── AnimatedSection/   # Framer Motion scroll-reveal wrapper
│   │   │   ├── SectionHeading/    # Shared eyebrow + title + subtitle heading
│   │   │   └── SocialLinks/       # Email/LinkedIn/GitHub icon link row
│   │   ├── layout/                # App shell components
│   │   │   ├── Navbar/            # Fixed nav with scroll-spy + mobile menu
│   │   │   └── Footer/
│   │   └── sections/              # One folder per page section (maps 1:1 to the resume)
│   │       ├── Hero/
│   │       ├── About/             # Summary + animated stats + key achievements
│   │       ├── Timeline/          # Education + experience + projects, chronological
│   │       ├── Skills/            # Technologies grouped by category
│   │       ├── Leadership/        # Leadership & additional responsibilities
│   │       └── Contact/           # Contact form (UI only, see note below)
│   ├── data/                      # Resume content as plain JS data modules (no JSX)
│   │   ├── personalInfo.js
│   │   ├── summaryData.js
│   │   ├── achievementsData.js
│   │   ├── timelineData.js
│   │   ├── skillsData.js
│   │   ├── leadershipData.js
│   │   └── navigationData.js
│   ├── hooks/                     # Reusable stateful logic, one responsibility per hook
│   │   ├── useActiveSection.js    # Scroll-spy for the navbar
│   │   ├── useScrollPosition.js   # Navbar condensed/blurred state
│   │   ├── useTypewriter.js       # Hero role-title typing effect
│   │   ├── useCountUp.js          # Animated stat counters
│   │   └── useContactForm.js      # Contact form state/validation/submission
│   ├── styles/                    # Global design tokens and resets
│   │   ├── variables.css          # Colors, spacing, typography, motion tokens
│   │   ├── global.css             # Reset + base element styles + layout utilities
│   │   └── animations.css         # Shared @keyframes
│   ├── utils/
│   │   └── iconMap.js             # Maps data-layer icon keys to react-icons components
│   ├── App.jsx                    # Composes the navbar, all sections, and footer
│   ├── main.jsx                   # React root entry point
│   └── index.css                  # Font imports + global.css import
├── index.html                     # Vite HTML entry point (meta tags, title, favicon)
├── vite.config.js
├── package.json
├── .gitignore
├── task_description.md            # Notes on what was built and how, for this project
└── README.md
```

**Design principles used throughout:**

- **Single Responsibility Principle** — each component renders one thing (a card, a badge, a form field); each hook manages one piece of behavior; each data file describes one resume section.
- **Data/presentation separation** — all resume content lives in `src/data/*.js` as plain objects/arrays. Components read from these files instead of hard-coding text, so updating the site's content never requires touching JSX.
- **JSDoc everywhere** — every component, hook, and utility function has a docblock describing its purpose, parameters, and return value.

---

## Prerequisites

- **Node.js** version 20 or later ([download](https://nodejs.org/))
- **npm** version 10 or later (bundled with Node.js)

Verify your versions:

```bash
node -v
npm -v
```

---

## Getting Started (Local Development)

1. **Clone the repository** (or navigate into the project folder if you already have it):

   ```bash
   git clone <your-repository-url>
   cd portfolio-website
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. Open the printed local URL (typically `http://localhost:5173`) in your browser. The page hot-reloads as you edit files under `src/`.

---

## Available Scripts

| Command           | Description                                                        |
| ------------------ | -------------------------------------------------------------------- |
| `npm run dev`       | Starts the Vite development server with hot module replacement.     |
| `npm run build`     | Type-checks nothing (JS project) and builds an optimized production bundle into `dist/`. |
| `npm run preview`   | Serves the contents of `dist/` locally to sanity-check the production build. |
| `npm run lint`      | Runs `oxlint` against the codebase.                                  |

---

## Building for Production

```bash
npm run build
```

This runs Vite's production build and outputs static, deployable artifacts into a **`dist/`** folder at the project root:

```
dist/
├── index.html
└── assets/
    ├── index-<hash>.js
    ├── index-<hash>.css
    └── profile-photo-<hash>.jpeg
```

Every filename is content-hashed for cache-busting, so the `dist/` folder can be uploaded as-is behind a CDN.

---

## Previewing the Production Build

Before deploying, verify the build works exactly as it will in production:

```bash
npm run build
npm run preview
```

This serves `dist/` locally (default `http://localhost:4173`) using the actual built assets rather than the dev server.

---

## Deploying to AWS S3 + CloudFront

Since this project builds to a fully static `dist/` folder, it's a natural fit for S3 + CloudFront hosting.

### 1. Build the site

```bash
npm run build
```

### 2. Create (or reuse) an S3 bucket

```bash
aws s3 mb s3://your-portfolio-bucket-name
```

- Keep the bucket **private**; CloudFront should access it via an **Origin Access Control (OAC)**, not public bucket policies.

### 3. Upload the build output

```bash
aws s3 sync dist/ s3://your-portfolio-bucket-name --delete
```

- `--delete` removes stale files from the bucket that are no longer part of the current build.

### 4. Configure CloudFront

- Create a CloudFront distribution with the S3 bucket as its origin (using OAC).
- Set **`index.html`** as both the default root object and the custom error response target for 403/404 errors (this SPA has no server-side routing, so unknown paths should fall back to `index.html`).
- Attach an SSL certificate (via AWS Certificate Manager) if using a custom domain.

### 5. Invalidate the CloudFront cache after each deploy

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 6. (Optional) Automate steps 1–5

Wrap the build, sync, and invalidate steps into a single deploy script (e.g. `deploy.sh`) or a CI/CD pipeline (GitHub Actions, AWS CodePipeline, etc.) once your AWS resources are provisioned.

---

## Git Workflow: Add, Commit & Push to GitHub

If this project isn't already a Git repository:

```bash
git init
git branch -M main
```

**Day-to-day workflow:**

1. **Check what changed:**

   ```bash
   git status
   ```

2. **Stage your changes:**

   ```bash
   git add <file-or-folder>
   # or, to stage everything:
   git add .
   ```

3. **Commit with a clear message:**

   ```bash
   git commit -m "Describe what changed and why"
   ```

4. **Connect to a GitHub remote** (only needed once, after creating an empty repository on GitHub):

   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   ```

5. **Push your changes:**

   ```bash
   git push -u origin main
   ```

   For subsequent pushes, `git push` is sufficient once the upstream branch is set.

**Tips:**

- Run `git status` before `git add .` to make sure you're not accidentally staging build artifacts (`dist/`) or environment files — both are already excluded via `.gitignore`.
- Write commit messages in the imperative mood ("Add timeline animation" rather than "Added timeline animation") to match common Git conventions.

---

## Customizing Content

All resume content lives under `src/data/` — no JSX editing required to update text:

| File                    | Controls                                             |
| ------------------------- | ------------------------------------------------------ |
| `personalInfo.js`         | Name, title, location, email, LinkedIn/GitHub URLs      |
| `summaryData.js`          | Professional summary paragraph and headline stats       |
| `achievementsData.js`     | "Key Achievements" cards                                |
| `timelineData.js`         | Education, experience, and every project on the journey timeline |
| `skillsData.js`           | Technology categories and individual skill badges       |
| `leadershipData.js`       | Leadership & additional responsibilities                |
| `navigationData.js`       | Navbar link labels/order                                |

To change the profile photo, replace `src/assets/images/profile-photo.jpeg` and keep the same filename, or update the `import` in `src/components/sections/Hero/Hero.jsx`.

To adjust the color palette, edit the CSS custom properties in `src/styles/variables.css` — every component consumes these tokens rather than hard-coded colors.

---

## Contact Form Note

The Contact section's form (`src/components/sections/Contact/`) is **UI-complete but not wired to a backend**. It currently:

- Validates name, email, and message fields client-side (`src/hooks/useContactForm.js`).
- Shows a loading state, then a success confirmation, on submit.
- Logs the submitted values to the browser console instead of sending them anywhere.

To make it functional, replace the `submitContactForm` function inside `src/hooks/useContactForm.js` with a real API call — e.g. to an AWS API Gateway + Lambda endpoint, or a third-party service like EmailJS or Formspree.

---

## Code Conventions

- **JSDoc** comments on every component, hook, and exported function describing purpose, parameters, and return values.
- **One component per file**, colocated with its own CSS file where relevant.
- **Data/UI separation**: JSX files contain no resume content strings; all copy lives in `src/data/`.
- **CSS custom properties** for every color, spacing, and motion value — no magic numbers in component stylesheets.

---

## Troubleshooting

- **Blank page after `npm run dev`** — confirm you're using Node 20+ (`node -v`) and re-run `npm install`.
- **Animations not triggering** — some scroll-reveal animations only fire once per session (`viewport={{ once: true }}` in Framer Motion); refresh the page to replay them.
- **Icons missing** — if you add a new skill/achievement with an unrecognized `iconKey`, it silently falls back to a generic icon; check `src/utils/iconMap.js` for the full list of supported keys.
