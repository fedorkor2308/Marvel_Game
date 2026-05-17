import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function InputField({ label, id, type = 'text', placeholder, tag, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest flex justify-between">
                <span>{label}</span>
                <span className="text-outline/40">{tag}</span>
            </label>
            <input
                id={id} type={type} placeholder={placeholder}
                value={value} onChange={onChange} autoComplete="off"
                className="w-full bg-surface-container-high border border-outline-variant text-on-surface font-grotesk text-sm px-4 py-3.5 placeholder:text-outline/35 transition-colors outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
        </div>
    )
}

export default function LoginForm() {
    const { login }   = useAuth()
    const navigate    = useNavigate()
    const [form, setForm]   = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

    async function handleSubmit() {
        if (!form.email || !form.password) return setError('Fill in all fields')
        setError('')
        setLoading(true)
        try {
            await login(form.email, form.password)
            navigate('/lobby')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="border-b-2 border-primary pb-5 flex justify-between items-end">
                <div>
                    <h1 className="font-grotesk text-5xl font-bold text-primary uppercase leading-none tracking-tighter mb-2 text-glow-red">Authenticate</h1>
                    <p className="font-mono text-[11px] text-outline tracking-[0.2em] uppercase">KINETIC STRIKE // OPERATOR LOGIN</p>
                </div>
                <div className="w-9 h-9 border border-primary/40 corner-cut flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-primary/50" />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <InputField label="Operator Email" id="email" type="email" placeholder="operator@shield.gov" tag="REQ-01" value={form.email} onChange={set('email')} />
                <InputField label="Access Directive" id="password" type="password" placeholder="Enter secure passphrase" tag="REQ-02" value={form.password} onChange={set('password')} />
            </div>

            {error && <p className="font-mono text-[11px] text-primary tracking-widest uppercase">{error}</p>}

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-on-primary font-mono text-xs tracking-widest uppercase py-4 corner-cut transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'AUTHENTICATING...' : 'DEPLOY CREDENTIALS'}
                </button>
                <div className="border-t border-outline-variant pt-4 text-center">
                    <p className="font-mono text-[11px] text-outline tracking-widest uppercase">
                        No credentials?{' '}
                        <Link to="/register" className="text-primary underline underline-offset-4 hover:text-glow-red transition-colors">REQUEST ACCESS</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
