import { useNavigate } from 'react-router-dom'

const MOCK_STATS = [
    { id: 'MOD-01', icon: '✦', label: 'Mission Rating', value: 'S-CLASS',     valueColor: 'text-primary'  },
    { id: 'MOD-02', icon: '⏱', label: 'Time Elapsed',   value: '04:12:09',    valueColor: 'text-on-surface' },
    { id: 'MOD-03', icon: '⊘', label: 'Threat Level',   value: 'NEUTRALIZED', valueColor: 'text-tertiary'  },
]

function StatBlock({ id, icon, label, value, valueColor }) {
    return (
        <div className="border border-outline-variant bg-surface-container-low p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary-container px-1.5 py-0.5">
                <span className="font-mono text-[9px] text-on-surface-variant">{id}</span>
            </div>
            <span className="text-outline text-xl mb-2">{icon}</span>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">{label}</span>
            <span className={`font-grotesk text-2xl font-bold uppercase ${valueColor}`}>{value}</span>
        </div>
    )
}

export default function GameEndOverlay({ isVictory = true, stats = MOCK_STATS, playerName = 'OPR-092' }) {
    const navigate = useNavigate()
    const title    = isVictory ? 'VICTORY!'  : 'DEFEAT'
    const status   = isVictory ? 'SECURE'    : 'COMPROMISED'
    const dotColor = isVictory ? 'bg-tertiary' : 'bg-primary'

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden blueprint-grid">
            <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />

            {/* Top HUD bars */}
            <div className="absolute top-0 left-0 border-b border-r border-outline-variant/30 px-4 py-2 flex items-center gap-2">
                <span className="text-tertiary text-xs">◎</span>
                <span className="font-mono text-[10px] text-outline tracking-widest uppercase">
          SEC-7 // {playerName}
        </span>
            </div>
            <div className="absolute top-0 right-0 border-b border-l border-outline-variant/30 px-4 py-2 flex items-center gap-2">
        <span className="font-mono text-[10px] text-tertiary tracking-widest uppercase">
          STATUS: {status}
        </span>
                <span className={`w-2 h-2 ${dotColor}`} style={{ boxShadow: isVictory ? '0 0 8px rgba(150,204,255,0.8)' : '0 0 8px rgba(255,85,70,0.8)' }} />
            </div>

            {/* Main content */}
            <main className="relative z-20 w-full max-w-[1000px] px-6 md:px-10 flex flex-col items-center">

                {/* Hero card */}
                <div className="relative w-full aspect-[21/9] border border-outline shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-surface-container-high overflow-hidden mb-10">
                    {/* Corner crosshairs */}
                    {['top-2 left-2 border-t-2 border-l-2', 'top-2 right-2 border-t-2 border-r-2',
                        'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2']
                        .map((cls, i) => (
                            <div key={i} className={`absolute w-4 h-4 border-primary/50 z-20 ${cls}`} />
                        ))}

                    {/* Background placeholder */}
                    <div className="absolute inset-0 blueprint-grid opacity-60" />
                    <div className="absolute inset-0 bg-surface-container-lowest/60" />

                    {/* Gradient for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                    {/* Big overlapping title */}
                    <div className="absolute bottom-0 left-0 w-full flex justify-center z-30 pointer-events-none"
                         style={{ transform: 'translateY(33%)' }}>
                        <h1
                            className={`font-grotesk font-black uppercase tracking-tighter select-none
                ${isVictory ? 'text-primary text-glow-red' : 'text-on-surface-variant'}
              `}
                            style={{ fontSize: 'clamp(60px, 12vw, 120px)', WebkitTextStroke: '2px #000' }}
                        >
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Stats bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-3xl mb-10 mt-10">
                    {stats.map(stat => <StatBlock key={stat.id} {...stat} />)}
                </div>

                {/* Action */}
                <button
                    onClick={() => navigate('/lobby')}
                    className="bg-primary text-on-primary px-8 py-4 font-mono text-xs tracking-widest uppercase corner-cut shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3"
                >
                    <span>▶</span> RETURN TO COMMAND
                </button>
            </main>
        </div>
    )
}