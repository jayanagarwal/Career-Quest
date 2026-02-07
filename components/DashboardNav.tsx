'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LayoutDashboard, Briefcase, Linkedin, Mail, LogOut, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'

interface DashboardNavProps {
    userEmail: string
}

export default function DashboardNav({ userEmail }: DashboardNavProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Applications', href: '/dashboard/jobs', icon: Briefcase },
        { name: 'Network', href: '/dashboard/linkedin', icon: Linkedin },
        { name: 'Outreach', href: '/dashboard/emails', icon: Mail },
    ]

    return (
        <>
            {/* Sidebar for Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 bg-card border-r border-border hidden md:flex flex-col z-50 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-border relative">
                    {!collapsed && (
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 animate-in fade-in">
                            Career Quest
                        </span>
                    )}
                    {collapsed && (
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto">
                            DQ
                        </span>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm hover:shadow-md transition-all z-50"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                title={collapsed ? item.name : ''}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground group-hover:text-foreground'
                                    } ${collapsed ? '' : 'mr-3'}`} />

                                {!collapsed && (
                                    <span className="animate-in fade-in duration-200">{item.name}</span>
                                )}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-border space-y-4">
                    <div className={`flex items-center ${collapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                        <span className={`text-xs text-muted-foreground capitalize truncate ${collapsed ? 'hidden' : 'block'}`}>
                            {userEmail.split('@')[0]}
                        </span>
                        {/* Swapped order: Name Left, Theme Toggle Right (when expanded) */}
                        <div className={`${collapsed ? '' : 'ml-auto'}`}>
                            <ThemeToggle />
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
                        title="Sign Out"
                    >
                        <LogOut className={`w-4 h-4 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Spacer Style Injection */}
            <style jsx global>{`
        main {
          transition: padding-left 300ms ease-in-out;
          padding-left: ${collapsed ? '5rem' : '16rem'}; /* 5rem = 20 (w-20), 16rem = 64 (w-64) */
        }
        @media (max-width: 768px) {
          main {
            padding-left: 0 !important;
          }
        }
      `}</style>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
                <span className="font-bold text-lg">Career Quest</span>
                <ThemeToggle />
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
