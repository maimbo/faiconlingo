# FaiconLingo Components and Modules

This document details the distinct logical engines, sub-systems, and components that make up the FaiconLingo platform. Each module has a specific role in driving acquisition, learning, retention, or cultural preservation.

---

## 1. User Onboarding & Segmentation Module

The onboarding flow is critical for retention and is not just a signup screen, but an initialization engine that generates a customized curriculum.

*   **Welcome Sequence:** Animated introduction featuring "Njovu" the Mascot.
*   **Language Selection Map:** Visual representation of Zambia where users select their target language.
*   **Segmentation Engine ("The Core Router"):** Queries the user's intent.
    *   *Visitor/Tourist:* Routes to survival vocabulary, directions, basic transactions.
    *   *Diaspora/Heritage Learner:* Routes to deeper cultural elements, proverbs, family structures.
    *   *Local Student:* Routes to structured, balanced academic curriculum.
*   **Placement Test Sub-module:** A 3-to-5 question branching logic quiz that determines if a user can skip alphabet/beginner levels.
*   **Commitment Protocol:** Users select learning velocity (e.g., 5 mins vs. 15 mins daily) which sets parameters for push notifications and daily XP goals.

---

## 2. Core Learning Engine

This is the primary runtime environment where users spend the most time, executing the lessons requested by the curriculum backend.

*   **Lesson Renderer:** A dynamic Flutter widget engine that interprets JSON lesson structures and renders the correct UI view (e.g., multiple choice, matchmaking, fill-in-the-blank).
*   **Audio Player Component:** A latency-optimized audio playback service handling native speaker pronunciations. Features tap-to-replay and slow-motion playback.
*   **Interactive Exercises:**
    *   *Flashcard View:* Picture-to-word association.
    *   *Translation Blocks:* Drag-and-drop sentence building.
    *   *Listening Comprehension:* Audio-only prompts requiring text or picture selection.
*   **Spaced Repetition System (SRS) Interface:** Every answer is tracked (correct/incorrect/time-taken) and immediately passed to the local database to influence the future review queue.

---

## 3. Gamification & Retention Engine

The system responsible for maintaining the "sticky" aspects of the application that drive daily active usage.

*   **Flame Streak Service:** Tracks consecutive days of activity. Uses localized time-zone checks to determine if a user has completed a lesson before midnight. Triggers visual UI state changes (e.g., the flame icon lighting up, or looking dim/frozen).
*   **Experience Point (XP) Ledger:** Calculates and awards points based on lesson difficulty, speed, and accuracy.
*   **Clan Badges System (Achievements):** Unlocks specific badges based on milestones (e.g., "The Baobab Badge" for a 30-day streak, or the "Eagle Badge" for perfecting 50 Nyanja lessons). Includes logic to keep initial badges "greyed out" to incite achievement desire.
*   **Leaderboard Engine:** A global or localized ranking system syncing with Firestore. Paginates users into leagues based on weekly XP generation (Bronze, Silver, Gold, Platinum).

---

## 4. The Nsaka (Cultural Hub)

A unique differentiator for FaiconLingo, distinguishing it from standard translation apps by providing a digital "fireplace" for deep cultural teaching.

*   **Stories & Lore Repository:** Short, readable, and listenable folktales relevant to the selected language variant.
*   **Proverb Engine ("Amapinda / Nthano"):** Daily or weekly proverb unlocks explaining literal translations vs. cultural meanings.
*   **Mascot Interaction (Njovu's Wisdom):** Tapping the Mascot anywhere in the UI triggers a bottom-sheet modal rendering a culturally relevant tip or piece of linguistic history.
*   **Viral Content Generator (Shareables):** A utility component that takes a learned proverb or phrase, overlays it on beautiful Zambian-themed backgrounds, and generates a native export share intent for social media (Instagram Stories, WhatsApp status).

---

## 5. Offline Sync & Local Caching Manager

Handles the complex logic of ensuring a seamless experience when internet connectivity drops.

*   **Asset Bundler:** Proactively downloads small packages of text and audio for the *next* 3-5 nodes on the user's learning path while they are on Wi-Fi.
*   **State Reconciler:** A background service in Flutter. If a user completes 5 lessons offline, the Reconciler queues the API payloads in local SQLite. Upon network connection, it replays the events to Firebase/Laravel to ensure the server-side streak and XP are updated without conflicts.

---

## 6. FaiconLingo Academies (B2B Module)

A separate but interconnected subsystem for institutional deployments (schools, universities, NGOs).

*   **Educator Portal (Web):** A Laravel-based dashboard where teachers can log in, create a "Classroom", and generate join codes.
*   **Cohort Tracking Engine:** Aggregates the data of all students within a join code. Provides the teacher with views on average completion rates, common vocabulary struggle points, and overall engagement hours.
*   **Assignment Dispatcher:** Allows educators to "lock" or "highlight" specific lesson modules on the students' apps to align with real-world weekly syllabus goals.

---

## 7. Administrative & CMS Engine (Mission Control)

The backend tooling required for the FaiconLingo team to maintain and grow the product.

*   **Curriculum Management Interface:** A web panel to visually build lessons, upload audio snippets, add new language trees, and fix typographical errors in real-time without releasing an App Store update.
*   **Analytics Dashboards:** High-level metrics visualization (Daily Active Users, Drop-off points in the onboarding funnel, most popular languages).
*   **Notification Dispatcher:** Interface to craft and send manual push notifications to specific user segments (e.g., "Happy Independence Day! Learn the national anthem in Tonga today").
