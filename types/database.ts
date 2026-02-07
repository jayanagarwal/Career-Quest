export interface Job {
    id: string
    user_id: string
    company: string
    role: string
    job_description?: string
    resume_version?: string
    date_applied?: string
    status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'
    probability_score?: number
    link?: string
    created_at: string
    updated_at: string
}

export interface LinkedInContact {
    id: string
    user_id: string
    contact_name: string
    contact_role?: string
    company?: string
    profile_url?: string
    referral_role?: string
    status: 'Message Sent' | 'Replied' | 'Ghosted'
    created_at: string
    updated_at: string
}

export interface ColdEmail {
    id: string
    user_id: string
    contact_name: string
    contact_email: string
    company?: string
    contact_role?: string
    referral_role?: string
    status: 'Sent' | 'Replied' | 'Ghosted'
    created_at: string
    updated_at: string
}
