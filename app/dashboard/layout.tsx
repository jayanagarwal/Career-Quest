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

            {/* Content Area - Padding is handled by global styles injected by DashboardNav for dynamic collapse */}
            <main className="pt-16 md:pt-0 pb-20 md:pb-8 min-h-screen transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
