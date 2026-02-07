import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-secondary/30 dark:bg-background">
            <DashboardNav userEmail={user.email || ''} />

            {/* Content Area - Offset for sidebar on desktop, header/footer on mobile */}
            <main className="md:pl-64 pt-16 md:pt-0 pb-20 md:pb-8 min-h-screen transition-all">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
