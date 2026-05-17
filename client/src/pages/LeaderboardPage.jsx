import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { leaderboardApi } from '../services/api'

export default function LeaderboardPage() {
    const navigate = useNavigate()
    const [rows, setRows]       = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        leaderboardApi.get()
            .then(r => setRows(r.data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-svh bg-background text-on-surface flex flex-col">
            <header className="border-b border-outline-variant px-6 py-3 flex justify-between items-center">
                <h1 className="font-grotesk text-xl font-bold text-primary tracking-tighter text-glow-red">KINETIC_STRIKE</h1>
                <button onClick={() => navigate('/lobby')} className="font-mono text-[11px] text-outline hover:text-primary uppercase tracking-widest transition-colors">← BACK TO LOBBY</button>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col gap-4">
                <div className="flex items-end justify-between">
                    <h2 className="font-grotesk text-3xl font-bold text-on-surface uppercase tracking-tight">Leaderboard</h2>
                    <span className="font-mono text-[10px] text-outline uppercase tracking-widest">TOP OPERATORS</span>
                </div>

                <div className="border border-outline-variant bg-surface-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {/* Header */}
                    <div className="border-b border-outline-variant grid grid-cols-12 px-4 py-2">
                        <span className="col-span-1 font-mono text-[10px] text-outline uppercase tracking-widest">#</span>
                        <span className="col-span-5 font-mono text-[10px] text-outline uppercase tracking-widest">Operator</span>
                        <span className="col-span-2 font-mono text-[10px] text-outline uppercase tracking-widest text-center">Wins</span>
                        <span className="col-span-2 font-mono text-[10px] text-outline uppercase tracking-widest text-center">Losses</span>
                        <span className="col-span-2 font-mono text-[10px] text-outline uppercase tracking-widest text-right">Win %</span>
                    </div>

                    {loading ? (
                        <div className="px-4 py-8 text-center">
                            <span className="font-mono text-[11px] text-outline uppercase tracking-widest animate-pulse">LOADING...</span>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <span className="font-mono text-[11px] text-outline uppercase tracking-widest">No battle records yet</span>
                        </div>
                    ) : rows.map((row, i) => (
                        <div key={row.username} className={`grid grid-cols-12 px-4 py-3 border-b border-outline-variant/40 hover:bg-surface-container-high transition-colors ${i === 0 ? 'bg-primary/5' : ''}`}>
                            <span className={`col-span-1 font-mono text-xs font-bold ${i === 0 ? 'text-primary' : 'text-outline'}`}>{i + 1}</span>
                            <span className="col-span-5 font-mono text-xs text-on-surface uppercase tracking-widest">{row.username}</span>
                            <span className="col-span-2 font-mono text-xs text-tertiary text-center">{row.wins}</span>
                            <span className="col-span-2 font-mono text-xs text-outline text-center">{row.losses}</span>
                            <span className="col-span-2 font-mono text-xs text-on-surface text-right">{row.win_rate}%</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
