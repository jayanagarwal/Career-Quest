'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LinkedInContact } from '@/types/database'
import { Plus, ExternalLink, Pencil, Trash2, X, Linkedin } from 'lucide-react'

export default function LinkedInPage() {
    const [contacts, setContacts] = useState<LinkedInContact[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingContact, setEditingContact] = useState<LinkedInContact | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        const { data, error } = await supabase
            .from('networking_linkedin')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) setContacts(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return
        setContacts(contacts.filter(c => c.id !== id))
        const { error } = await supabase.from('networking_linkedin').delete().eq('id', id)
        if (error) fetchContacts()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Replied': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            case 'Message Sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
            case 'Ghosted': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300'
            default: return 'bg-secondary text-muted-foreground'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">LinkedIn Network</h1>
                    <p className="text-muted-foreground">Manage your professional connections and referrals.</p>
                </div>
                <button
                    onClick={() => { setEditingContact(null); setShowForm(true) }}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-blue-600"></div>
                </div>
            ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-xl">
                    <div className="p-4 bg-secondary rounded-full mb-4">
                        <Linkedin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No contacts yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding a LinkedIn connection</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Add contact
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="group relative bg-card border border-border rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold text-lg">
                                    {contact.contact_name.charAt(0)}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                                    {contact.status}
                                </span>
                            </div>

                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                {contact.contact_name}
                                {contact.profile_url && (
                                    <a href={contact.profile_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">{contact.contact_role} @ {contact.company}</p>

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Referral for: <span className="text-foreground font-medium">{contact.referral_role || 'General'}</span></p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingContact(contact); setShowForm(true) }} className="p-1.5 text-muted-foreground hover:text-blue-600 transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(contact.id)} className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <ContactForm
                            contact={editingContact}
                            onSuccess={() => { setShowForm(false); setEditingContact(null); fetchContacts() }}
                            onCancel={() => { setShowForm(false); setEditingContact(null) }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function ContactForm({ contact, onSuccess, onCancel }: { contact: LinkedInContact | null; onSuccess: () => void; onCancel: () => void }) {
    const [formData, setFormData] = useState({
        contact_name: contact?.contact_name || '',
        contact_role: contact?.contact_role || '',
        company: contact?.company || '',
        profile_url: contact?.profile_url || '',
        referral_role: contact?.referral_role || '',
        status: contact?.status || 'Message Sent',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const payload = { ...formData, user_id: user.id }

        const { error } = contact
            ? await supabase.from('networking_linkedin').update(payload).eq('id', contact.id)
            : await supabase.from('networking_linkedin').insert([payload])

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
                <h2 className="text-xl font-semibold">{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
                <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Name *</label>
                        <input type="text" required value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company</label>
                        <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Their Role</label>
                    <input type="text" value={formData.contact_role} onChange={(e) => setFormData({ ...formData, contact_role: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <input type="url" value={formData.profile_url} onChange={(e) => setFormData({ ...formData, profile_url: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Referral For</label>
                        <input type="text" value={formData.referral_role} onChange={(e) => setFormData({ ...formData, referral_role: e.target.value })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                            <option value="Message Sent">Message Sent</option>
                            <option value="Replied">Replied</option>
                            <option value="Ghosted">Ghosted</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-200 dark:border-red-900/20">{error}</p>}

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">{loading ? 'Saving...' : 'Save Contact'}</button>
                </div>
            </form>
        </div>
    )
}
