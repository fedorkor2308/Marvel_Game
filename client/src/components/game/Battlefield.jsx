import PlayerHUD   from './PlayerHUD'
import CardOnBoard from './CardOnBoard'
import PlayerHand  from './PlayerHand'
import TurnTimer   from './TurnTimer'

const BOARD_SLOTS = 3

const MOCK_OPPONENT = { name: 'DR. STRANGE', health: 20, maxHealth: 20, mana: 4,  maxMana: 10, cardsInHand: 5 }
const MOCK_PLAYER   = { name: 'THOR',        health: 18, maxHealth: 20, mana: 6,  maxMana: 10 }

export default function Battlefield({ isYourTurn = true }) {
    return (
        <main className="flex-1 flex flex-col overflow-hidden relative"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 20px)' }}>

            {/* YOUR TURN overlay */}
            {isYourTurn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                    <h2 className="font-grotesk text-5xl font-bold text-primary tracking-widest uppercase opacity-20 select-none text-glow-red">
                        YOUR TURN
                    </h2>
                </div>
            )}

            {/* ── Opponent Area ── */}
            <section className="flex-none h-1/3 border-b border-outline-variant bg-surface-container-lowest p-4 flex flex-col">
                <PlayerHUD {...MOCK_OPPONENT} isOpponent />
                <div className="flex-1 flex items-center justify-center gap-4 mt-3">
                    {Array.from({ length: BOARD_SLOTS }).map((_, i) => (
                        <CardOnBoard key={i} isPlayer={false} />
                    ))}
                </div>
            </section>

            {/* ── Timer ── */}
            <TurnTimer seconds={30} />

            {/* ── Player Area ── */}
            <section className="flex-1 border-t border-outline-variant bg-surface-container-low p-4 flex flex-col">
                {/* Player board slots */}
                <div className="flex-1 flex items-center justify-center gap-4 mb-2">
                    {Array.from({ length: BOARD_SLOTS }).map((_, i) => (
                        <CardOnBoard key={i} isPlayer />
                    ))}
                </div>

                {/* Player hand */}
                <PlayerHand />

                {/* Player HUD + End Turn */}
                <div className="flex justify-between items-end mt-auto pt-4 relative z-20">
                    <PlayerHUD {...MOCK_PLAYER} />
                    <div className="flex flex-col items-end gap-3">
                        <button className="bg-primary text-on-primary font-mono text-xs tracking-widest uppercase py-3 px-6 corner-cut shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            END TURN
                        </button>
                    </div>
                </div>
            </section>
        </main>
    )
}