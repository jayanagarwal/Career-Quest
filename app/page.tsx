import Link from 'next/link'
import { ArrowRight, CheckCircle2, Layout, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              Career Quest
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 blur-[100px] rounded-full -z-10" />

          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <span className="flex w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              v1.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Your job search, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">reimagined.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop using spreadsheets. Career Quest brings your applications, networking, and outreach into one powerful, unified workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="h-12 px-8 flex items-center justify-center bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
              >
                Start Tracking Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 flex items-center justify-center bg-secondary text-secondary-foreground font-medium rounded-full hover:bg-secondary/80 transition-all hover:scale-105"
              >
                Demo the App
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Layout,
                  title: 'Organized Dashboard',
                  desc: 'See all your applications, contacts, and emails in one bird\'s-eye view.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  desc: 'Built for speed. Add jobs and contacts in seconds, not minutes.',
                },
                {
                  icon: Shield,
                  title: 'Private & Secure',
                  desc: 'Your data is yours. Securely stored and accessible only by you.',
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Career Quest. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
