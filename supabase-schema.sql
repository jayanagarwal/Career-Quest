-- Create Jobs Table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  job_description TEXT,
  resume_version TEXT,
  date_applied DATE,
  status TEXT CHECK (status IN ('Applied', 'Interview', 'Rejected', 'Offer')) DEFAULT 'Applied',
  probability_score INTEGER CHECK (probability_score >= 0 AND probability_score <= 100),
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create LinkedIn Contacts Table
CREATE TABLE networking_linkedin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_role TEXT,
  company TEXT,
  profile_url TEXT,
  referral_role TEXT,
  status TEXT CHECK (status IN ('Message Sent', 'Replied', 'Ghosted')) DEFAULT 'Message Sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create Cold Emails Table
CREATE TABLE networking_email (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  company TEXT,
  contact_role TEXT,
  referral_role TEXT,
  status TEXT CHECK (status IN ('Sent', 'Replied', 'Ghosted')) DEFAULT 'Sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_linkedin ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_email ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Jobs
CREATE POLICY "Users can view their own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for LinkedIn
CREATE POLICY "Users can view their own linkedin contacts"
  ON networking_linkedin FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own linkedin contacts"
  ON networking_linkedin FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own linkedin contacts"
  ON networking_linkedin FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own linkedin contacts"
  ON networking_linkedin FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for Email
CREATE POLICY "Users can view their own email contacts"
  ON networking_email FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email contacts"
  ON networking_email FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email contacts"
  ON networking_email FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email contacts"
  ON networking_email FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_linkedin_user_id ON networking_linkedin(user_id);
CREATE INDEX idx_email_user_id ON networking_email(user_id);
