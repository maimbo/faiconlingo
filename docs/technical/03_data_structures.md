# FaiconLingo Data Structures & Schemas

The FaiconLingo platform utilizes a hybrid database approach: **Firestore (NoSQL)** for high-speed, real-time client state, and **MySQL (Relational)** for structured curriculum and enterprise reporting. Local on-device storage uses **Hive/SQLite** for offline continuity.

---

## 1. Firebase (Firestore) NoSQL Schemas
Firestore is optimized for read-heavy operations from the mobile clients. It stores user "hot" state.

### `users` Collection
Stores authentication metadata and high-level progression.
```json
{
  "uid": "a1b2c3d4",
  "displayName": "Maimbolwa",
  "tier": "free", // or "premium", "academy"
  "primaryLanguageRef": "languages/bemba",
  "totalXP": 1450,
  "currentStreak": 12,
  "longestStreak": 30,
  "lastLessonCompletedAt": "2026-02-24T12:00:00Z",
  "timezone": "Africa/Lusaka",
  "segment": "tourist" // tourist, diaspora, local
}
```

### `user_progress` Collection (Sub-collection of `users`)
Tracks granular completion of specific nodes on the learning path.
```json
{
  "lessonId": "bem_basic_greetings_01",
  "status": "completed", // locked, unlocked, completed
  "starsEarned": 3,
  "attempts": 2,
  "timeSpentSeconds": 145,
  "lastAttemptAt": "2026-02-24T12:00:00Z"
}
```

### `srs_queue` Collection (Spaced Repetition tracking per user)
Items that need to be reviewed to cement long-term memory.
```json
{
  "vocabularyId": "vocab_muli_bwanji",
  "easeFactor": 2.5,
  "intervalDays": 3,
  "nextReviewDate": "2026-02-27T00:00:00Z",
  "consecutiveCorrect": 2
}
```

---

## 2. Laravel (MySQL) Relational Schemas
MySQL holds the immutable "truth" of the curriculum, ensuring data integrity for all 73 languages.

### Table: `languages`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | UUID (e.g., 'lang_bemba') |
| `name` | VARCHAR(100) | "Bemba" |
| `region` | VARCHAR(100) | "Northern/Copperbelt" |
| `is_active` | BOOLEAN | Feature flag for Phase launches |

### Table: `lesson_nodes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | UUID |
| `language_id` | VARCHAR(36) | Foreign Key |
| `segment_target` | ENUM | 'all', 'tourist', 'local', 'diaspora' |
| `title` | VARCHAR(100) | "Market Negotiations" |
| `order_index` | INT | Position on the path snake |

### Table: `content_items` (The atomic questions)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | UUID |
| `node_id` | VARCHAR(36) | FK to lesson_nodes |
| `type` | ENUM | 'multiple_choice', 'audio_match', 'translation' |
| `question_text` | TEXT | E.g., "Translate: How much is this?" |
| `correct_answer` | TEXT | E.g., "Ni shinga iyi?" |
| `audio_url` | VARCHAR(255) | Pointer to Firebase Storage CDN |
| `image_url` | VARCHAR(255) | Pointer to CDN for visual aids |

### Table: `academies` (B2B Module)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | UUID |
| `institution_name` | VARCHAR(255)| E.g., "Lusaka International School" |
| `educator_id` | VARCHAR(36) | FK to admin users table |
| `join_code` | VARCHAR(10) | E.g., "LUSAKA-26" |

---

## 3. Local Storage Schemas (Flutter - Hive/SQLite)

To support complete offline functionality, the Flutter app maintains specific local tables.

### `cached_curriculum` (Hive Box)
A fast key-value store containing the JSON representation of the next 5-10 unlocked `lesson_nodes` and their associated `content_items`. This is pre-fetched on Wi-Fi.

### `sync_event_queue` (SQLite Table)
Crucial for offline reconciliation.
| Column | Type | Description |
| :--- | :--- | :--- |
| `event_id` | INTEGER | Auto-increment primary key |
| `event_type` | VARCHAR(50) | 'lesson_complete', 'srs_update', 'xp_gain' |
| `payload` | JSON | The data to send `{lessonId: 'abc', stars: 3}` |
| `timestamp` | DATETIME | When the event actually occurred offline |
| `sync_status` | ENUM | 'pending', 'failed', 'synced' |
