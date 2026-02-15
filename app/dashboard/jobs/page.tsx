'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Job } from '@/types/database'
import { Plus, ExternalLink, Pencil, Trash2, X, Search, Filter } from 'lucide-react'

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) setJobs(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Optimistic update
        setJobs(jobs.filter(j => j.id !== id))

        const { error } = await supabase.from('jobs').delete().eq('id', id).eq('user_id', user.id)
        if (error) fetchJobs() // Revert on error
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
            case 'Interview': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
            case 'Offer': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
            default: return 'bg-secondary text-muted-foreground'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground">Manage and track your job applications.</p>
                </div>
                <button
                    onClick={() => { setEditingJob(null); setShowForm(true) }}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Track Job
                </button>
            </div>

            {/* Filters & Search (Visual Only for now) */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <button className="px-3 py-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-blue-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-xl">
                    <div className="p-4 bg-secondary rounded-full mb-4">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">Start by tracking your first job application</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Add an application
                    </button>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Relevance</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {jobs.map((job) => {
                                    const score = job.probability_score ?? 0

                                    return (
                                    <tr key={job.id} className="group hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                {job.company}
                                                {job.link && (
                                                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{job.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${score * 10}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground">{score}/10</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingJob(job); setShowForm(true) }}
                                                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <JobForm
                            job={editingJob}
                            onSuccess={() => { setShowForm(false); setEditingJob(null); fetchJobs() }}
                            onCancel={() => { setShowForm(false); setEditingJob(null) }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function JobForm({ job, onSuccess, onCancel }: { job: Job | null; onSuccess: () => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        company: job?.company || '',
        role: job?.role || '',
        link: job?.link || '',
        resume_version: job?.resume_version || '',
        status: job?.status || 'Applied',
        probability_score: job?.probability_score || 5,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setError('You must be signed in to save this.')
            setLoading(false)
            return
        }

        const payload = { ...formData, user_id: user.id }

        const { error } = job
            ? await supabase.from('jobs').update(payload).eq('id', job.id).eq('user_id', user.id)
            : await supabase.from('jobs').insert([payload])

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            onSuccess()
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{job ? 'Edit Application' : 'Track New Job'}</h2>
                <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company *</label>
                        <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Role *</label>
                        <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="e.g. Senior Developer"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Job URL</label>
                    <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="https://..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Parameters</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Confidence Score: {formData.probability_score}</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.probability_score}
                            onChange={(e) => setFormData({ ...formData, probability_score: parseInt(e.target.value) })}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Resume Version</label>
                    <input
                        type="text"
                        value={formData.resume_version}
                        onChange={(e) => setFormData({ ...formData, resume_version: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="e.g. v2_Software_Engineer.pdf"
                    />
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-200 dark:border-red-900/20">{error}</p>}

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {loading ? 'Saving...' : job ? 'Save Changes' : 'Track Application'}
                    </button>
                </div>
            </form>
        </div>
    )
}
