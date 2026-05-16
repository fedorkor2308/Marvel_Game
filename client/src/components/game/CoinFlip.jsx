import { useState } from 'react'

const STATES = { IDLE: 'idle', FLIPPING: 'flipping', RESULT: 'result' }

export default function CoinFlip({ onComplete }) {
    const [phase, setPhase] = useState(STATES.IDLE)
    const [result, setResult] = useState(null)

    const handleToss = () => {
        setPhase(STATES.FLIPPING)
        setTimeout(() => {
            const winner = Math.random() > 0.5 ? 'YOU' : 'OPPONENT'
            setResult(winner)
            setPhase(STATES.RESULT)
        }, 2000)
    }

    const statusLabel = {
        [STATES.IDLE]:     'AWAITING INITIATION',
        [STATES.FLIPPING]: 'TOSS IN PROGRESS...',
        [STATES.RESULT]:   result === 'YOU' ? 'YOU GO FIRST' : 'OPPONENT GOES FIRST',
    }[phase]

    const statusColor = phase === STATES.RESULT
        ? result === 'YOU' ? 'text-primary' : 'text-outline'
        : 'text-tertiary'

    return (
        <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center blueprint-grid">
            <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />

            {/* Main container */}
            <main className="relative z-10 w-full max-w-3xl px-6 md:px-10 flex flex-col items-center">

                {/* Header */}
                <header className="w-full flex flex-col items-center text-center gap-3 mb-10 relative">
                    <div className="flex items-center gap-2 text-tertiary">
                        <span className="text-sm animate-spin" style={{ animationDuration: '3s' }}>↻</span>
                        <p className="font-mono text-[11px] tracking-[0.2em] uppercase">Initialize Protocol</p>
                    </div>
                    <h1 className="font-grotesk text-4xl md:text-5xl font-bold uppercase text-on-surface tracking-tight">
                        Who Goes First?
                    </h1>
                    <div className="w-16 h-px bg-outline-variant mt-2" />

                    {/* Technical readout */}
                    <div className="absolute top-0 right-0 hidden md:flex flex-col text-right">
                        <span className="font-mono text-[10px] text-outline tracking-widest">OPR-092 // ACTIVE</span>
                        <span className="font-mono text-[10px] text-outline tracking-widest">SYS.TGT: COIN_TOSS</span>
                    </div>
                </header>

                {/* Coin module */}
                <div className="w-full aspect-video bg-surface-container border border-outline-variant p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative mb-8">
                    {/* Corner crosshairs */}
                    {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r',
                        'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r']
                        .map((cls, i) => (
                            <div key={i} className={`absolute w-3 h-3 border-tertiary/60 ${cls}`} />
                        ))}

                    {/* Module ID */}
                    <div className="absolute top-3 right-5 z-20">
                        <span className="font-mono text-[10px] text-outline tracking-widest">MOD-042</span>
                    </div>

                    {/* Inner recessed area */}
                    <div
                        className="relative w-full h-full bg-surface-container-low border border-outline overflow-hidden flex items-center justify-center"
                        style={{ boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.8)' }}
                    >
                        {/* Coin placeholder */}
                        <div className={`
              w-52 h-52 md:w-64 md:h-64 rounded-full border border-outline-variant bg-surface-container-high
              flex items-center justify-center relative
              ${phase === STATES.FLIPPING ? 'animate-spin' : ''}
            `}
                             style={phase === STATES.FLIPPING ? { animationDuration: '0.3s' } : {}}
                        >
                            <div className="absolute inset-0 rounded-full blueprint-grid opacity-30" />
                            <span className="font-mono text-[10px] text-outline/40 tracking-widest">COIN.ASSET</span>

                            {/* Result overlay */}
                            {phase === STATES.RESULT && (
                                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-surface-container/80">
                  <span className={`font-grotesk text-2xl font-bold uppercase tracking-wider ${statusColor}`}>
                    {result === 'YOU' ? 'HEADS' : 'TAILS'}
                  </span>
                                </div>
                            )}
                        </div>

                        {/* Slow rotating targeting ring */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className="w-72 h-72 md:w-80 md:h-80 border border-outline-variant/30 rounded-full relative flex items-center justify-center"
                                style={{ animation: 'spin 60s linear infinite' }}
                            >
                                {['top-0 left-1/2 -translate-x-1/2 w-px h-2',
                                    'bottom-0 left-1/2 -translate-x-1/2 w-px h-2',
                                    'left-0 top-1/2 -translate-y-1/2 w-2 h-px',
                                    'right-0 top-1/2 -translate-y-1/2 w-2 h-px']
                                    .map((cls, i) => (
                                        <div key={i} className={`absolute bg-tertiary/60 ${cls}`} />
                                    ))}
                            </div>
                        </div>

                        {/* Status label */}
                        <div className="absolute bottom-4 left-4 bg-surface-container/90 border border-outline-variant px-3 py-1">
              <span className={`font-mono text-[10px] tracking-widest uppercase ${statusColor}`}>
                {statusLabel}
              </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full max-w-sm flex flex-col gap-3">
                    {phase !== STATES.RESULT ? (
                        <>
                            <button
                                onClick={handleToss}
                                disabled={phase === STATES.FLIPPING}
                                className="w-full py-4 bg-primary text-on-primary font-mono text-xs tracking-widest uppercase corner-cut shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {phase === STATES.FLIPPING ? 'TOSSING...' : 'INITIATE TOSS'}
                            </button>
                            <button
                                onClick={() => onComplete?.('abort')}
                                className="w-full py-4 bg-surface-container text-on-surface font-mono text-xs tracking-widest uppercase border border-outline-variant shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-surface-container-high hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                                ✕ ABORT
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onComplete?.(result)}
                            className="w-full py-4 bg-primary text-on-primary font-mono text-xs tracking-widest uppercase corner-cut shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            PROCEED TO BATTLE →
                        </button>
                    )}
                </div>

            </main>
        </div>
    )
}