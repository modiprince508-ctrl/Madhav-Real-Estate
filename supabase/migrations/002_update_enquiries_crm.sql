-- Migration to support CRM features for enquiries

-- 1. Add new columns for CRM tracking
ALTER TABLE enquiries 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Update the status check constraint to include CRM statuses
-- In 001_initial_schema.sql, the constraint was inline: status text default 'New' check (status in (...))
-- In Postgres, this is often named `enquiries_status_check`.
ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS enquiries_status_check;

ALTER TABLE enquiries ADD CONSTRAINT enquiries_status_check 
CHECK (status IN ('New', 'Contacted', 'Follow-up', 'Visit Planned', 'Converted', 'Closed', 'Not Interested'));

-- 3. Create a trigger to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_enquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_enquiries_updated_at ON enquiries;

CREATE TRIGGER trg_enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW
EXECUTE FUNCTION update_enquiries_updated_at();
