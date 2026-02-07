import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Briefcase, Mail, Linkedin, TrendingUp, Plus, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const [
        { count: jobsCount },
        { count: linkedinCount },
        { count: emailsCount },
        { data: jobs }
    ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('networking_linkedin').select('*', { count: 'exact', head: true }),
        supabase.from('networking_email').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('status')
    ])

    const repliedJobs = jobs?.filter(j => j.status === 'Interview' || j.status === 'Offer').length || 0
    const responseRate = jobsCount && jobsCount > 0 ? Math.round((repliedJobs / jobsCount) * 100) : 0

    const stats = [
        {
            label: 'Total Applications',
            value: jobsCount || 0,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-500/20',
            href: '/dashboard/jobs'
        },
        {
            label: 'LinkedIn Contacts',
            value: linkedinCount || 0,
            icon: Linkedin,
            color: 'text-cyan-600',
            bg: 'bg-cyan-100 dark:bg-cyan-500/20',
            href: '/dashboard/linkedin'
        },
        {
            label: 'Cold Emails',
            value: emailsCount || 0,
            icon: Mail,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100 dark:bg-indigo-500/20',
            href: '/dashboard/emails'
        },
        {
            label: 'Reply Rate',
            value: `${responseRate}%`,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-500/20',
            href: '#'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your search.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Action buttons could go here */}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Link
                        key={i}
                        href={stat.href}
                        className="group relative overflow-hidden bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <div className="mt-2 text-3xl font-bold text-foreground">{stat.value}</div>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Access Grid */}
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Track New Job',
                        desc: 'Log a new application',
                        icon: Plus,
                        href: '/dashboard/jobs',
                        color: 'bg-blue-600 hover:bg-blue-700'
                    },
                    {
                        title: 'Add Contact',
                        desc: 'Record a LinkedIn connection',
                        icon: Linkedin,
                        href: '/dashboard/linkedin',
                        color: 'bg-cyan-600 hover:bg-cyan-700'
                    },
                    {
                        title: 'Log Email',
                        desc: 'Track cold outreach',
                        icon: Mail,
                        href: '/dashboard/emails',
                        color: 'bg-indigo-600 hover:bg-indigo-700'
                    }
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="group flex items-center justify-between p-6 bg-card border border-border rounded-xl hover:border-blue-500/50 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${action.color} text-white shadow-md`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">{action.title}</h3>
                                <p className="text-sm text-muted-foreground">{action.desc}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
