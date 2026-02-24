# FaiconLingo Algorithms & Workflows

This document outlines the core logical flows and algorithms that dictate how the FaiconLingo platform behaves, ensuring a robust, engaging, and personalized experience.

---

## 1. The Spaced Repetition System (SRS) Algorithm

The objective of SRS is to present vocabulary for review just as the user is about to forget it, locking it into long-term memory. It operates completely deterministically (no AI required in Phase 1).

**Variables:**
*   `EF` (Ease Factor): Starts at 2.5
*   `I` (Interval in days): Time until next review
*   `Q` (Quality of response): 0 to 5 based on user performance

**The SuperMemo-2 (SM-2) Variation Workflow:**
1.  **Initial Encounter:** User sees a new word. `EF` = 2.5, `I` = 1 day.
2.  **Review Session:** User is tested on the word.
3.  **Grading the Response (`Q`):**
    *   **5:** Perfect, immediate recall.
    *   **4:** Correct, but after hesitation (took longer than 3 seconds).
    *   **3:** Correct, but after a hint/second try.
    *   **2:** Incorrect, but the correct answer seemed familiar.
    *   **1:** Incorrect, remembered encountering it but forgot it entirely.
    *   **0:** Complete blackout.
4.  **Calculating the Next Interval:**
    *   If `Q >= 3` (Passed): 
        *   If it's the 1st repetition: `I = 1`
        *   If it's the 2nd repetition: `I = 6`
        *   If > 2 repetitions: `I = I_previous * EF`
    *   If `Q < 3` (Failed):
        *   `I = 1` (Reset interval, must review tomorrow).
5.  **Adjusting the Ease Factor (`EF`):**
    *   `EF_new = EF_old + (0.1 - (5 - Q) * (0.08 + (5 - Q) * 0.02))`
    *   *Constraint: `EF` cannot fall below 1.3.*

---

## 2. Offline Synchronization Algorithm ("The Reconciler")

Handling offline state ensures that users in rural areas don't lose progress and aren't blocked from learning.

**Workflow:**
1.  **Network State Change:** Flutter's `connectivity_plus` package detects a drop in WAN connection.
2.  **Intercept Writes:** API calls to update Firebase are instantly routed to the local SQLite `sync_event_queue`. The UI immediately reflects success (optimistic UI rendering)—the user's XP and Streak increase locally.
3.  **Network Restoration:** Connection detected.
4.  **Batch Processing:** A background worker reads all `pending` events in the local queue, ordered by `timestamp` ASC.
5.  **Conflict Resolution & Push:**
    *   The payload is pushed to a secure Firebase Cloud Function: `/api/syncOfflineBatch`.
    *   **Timezone & Cheat Check:** The server validates the timestamps against the user's localized time. It prevents a user from artificially rolling their device clock back 3 days to repair a broken streak.
6.  **Acknowledge & Prune:** Server returns HTTP 200. Flutter deletes the `pending` rows from the local SQLite database.

---

## 3. The Flame Streak Logic

The streak is a powerful gamification lever. It must be brutally harsh to encourage daily play, while accommodating edge cases (time zones, offline syncs).

**Algorithm:**
```javascript
function evaluateStreak(user, newLessonCompletionTime) {
  let userTimezoneOffset = user.timezone; 
  let lastActiveLocal = convertToLocal(user.lastLessonCompletedAt, userTimezoneOffset);
  let newCurrentLocal = convertToLocal(newLessonCompletionTime, userTimezoneOffset);
  
  let dayDifference = calculateMidnightCrossings(lastActiveLocal, newCurrentLocal);

  if (dayDifference === 0) {
    // Already did a lesson today. No streak change.
    return { streak: user.currentStreak, flame_status: 'lit' };
  } else if (dayDifference === 1) {
    // Consecutive day. Increment streak.
    return { streak: user.currentStreak + 1, flame_status: 'lit' };
  } else if (dayDifference > 1) {
    // Missed a day. Streak broken.
    // Check if user has a "Streak Freeze" item from the shop
    if (user.inventory.streak_freeze > 0) {
       consumeStreakFreeze(user.uid);
       return { streak: user.currentStreak + 1, flame_status: 'frozen' };
    } else {
       // Brutal reset
       return { streak: 1, flame_status: 'lit' }; 
    }
  }
}
```

---

## 4. User Segmentation & Matchmaking Workflow

During the Onboarding flow, the user's choices fundamentally alter the curriculum query.

**Workflow:**
1.  User selects a target language (e.g., Nyanja).
2.  User answers: "Why are you learning?" -> Selected: "Tourism".
3.  **The Routing Decision:** The Flutter client requests the "Path Snake" for `Nyanja`. It passes `segment=tourist` in the API header.
4.  **Backend Filtering (Laravel):**
    *   The DB queries `lesson_nodes` where `language_id = 'lang_nyanja'` AND (`segment_target` IN ('all', 'tourist')).
    *   It *excludes* nodes tagged specifically for 'diaspora' (e.g., deeply complex family tree titles) or 'local' (e.g., academic grade school grammar).
5.  **Result:** The generated learning path for the Tourist user is significantly shorter, more practical, and completely visual. It focuses on currency, directions, and greetings, improving immediate First-Session UX.
