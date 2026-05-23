# betwin – Database Setup

## Steps

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your project dashboard
3. Paste and run `schema.sql` — creates all tables + RLS policies
4. Paste and run `seed.sql` — seeds doctors, caregivers, and Terry's demo profile

## Get your keys

In your Supabase project → **Settings → API**:

| Variable | Where to find it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` key |

Copy these into the `.env` file at the project root.

## Tables

| Table | Purpose |
|---|---|
| `journals` | One row per patient — care journal, notes, module scores, doctor info |
| `users` | Patient identity (optional if using Supabase Auth later) |
| `doctors` | Reference list of oncologists (seeded from `mockRecipients.json`) |
| `caregivers` | Reference list of caregivers (seeded from `mockRecipients.json`) |

## Notes

- `journals` uses `user_id = singpass_uid` so it is compatible with the existing Firebase `saveJournalToCloud(userId, data)` call
- `module_scores` is stored as JSONB `{ jargon, screening, crisis, healing, fertility, sister, caregiver, wellness }`
- Row Level Security is enabled — patients can only access their own journal row
