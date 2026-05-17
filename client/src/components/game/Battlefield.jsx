import PlayerHUD   from './PlayerHUD'
import CardOnBoard from './CardOnBoard'
import PlayerHand  from './PlayerHand'
import TurnTimer   from './TurnTimer'
import { useState } from 'react'

export default function Battlefield({
    myPlayer, opponentPlayer,
    hand = [], isYourTurn = false, timer = 30,
    onPlayCard, onAttackWith, onEndTurn,
}) {
    const [selectedAttacker, setSelectedAttacker] = useState(null)

    function handleMyCardClick(instanceId) {
        if (!isYourTurn) return
        const card = myPlayer?.board?.find(c => c.instanceId === instanceId)
        if (!card || card.exhausted) return
        setSelectedAttacker(instanceId === selectedAttacker ? null : instanceId)
    }

    function handleOpponentTargetClick(instanceId) {
        if (!selectedAttacker) return
        onAttackWith?.(selectedAttacker, instanceId)
        setSelectedAttacker(null)
    }

    function handleAttackHero() {
        if (!selectedAttacker) return
        onAttackWith?.(selectedAttacker, 'hero')
        setSelectedAttacker(null)
    }

    const my  = myPlayer       || { username: '---', health: 20, maxHealth: 20, mana: 0, maxMana: 1, board: [] }
    const opp = opponentPlayer || { username: '---', health: 20, maxHealth: 20, mana: 0, maxMana: 1, board: [] }
    const BOARD_SLOTS = 7

    return (
        <main className="flex-1 flex flex-col overflow-hidden relative"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 20px)' }}>

            {isYourTurn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                    <h2 className="font-grotesk text-5xl font-bold text-primary tracking-widest uppercase opacity-20 select-none text-glow-red">YOUR TURN</h2>
                </div>
            )}

            {/* ── Opponent Area ── */}
            <section className="flex-none h-1/3 border-b border-outline-variant bg-surface-container-lowest p-4 flex flex-col">
                <div className="flex items-start justify-between">
                    <PlayerHUD name={opp.username} health={opp.health} maxHealth={opp.maxHealth || 20} mana={opp.mana} maxMana={opp.maxMana} cardsInHand={opp.handSize} isOpponent />
                    {selectedAttacker && (
                        <button onClick={handleAttackHero} className="border border-primary text-primary font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-primary/10 transition-colors animate-pulse">
                            ⚔ ATTACK HERO
                        </button>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-center gap-3 mt-3 flex-wrap">
                    {Array.from({ length: BOARD_SLOTS }).map((_, i) => {
                        const card = opp.board?.[i] ?? null
                        return <CardOnBoard key={i} card={card} isPlayer={false} canAttack={!!selectedAttacker && !!card} onClick={handleOpponentTargetClick} />
                    })}
                </div>
            </section>

            <TurnTimer seconds={timer} />

            {/* ── Player Area ── */}
            <section className="flex-1 border-t border-outline-variant bg-surface-container-low p-4 flex flex-col">
                <div className="flex-1 flex items-center justify-center gap-3 mb-2 flex-wrap">
                    {Array.from({ length: BOARD_SLOTS }).map((_, i) => {
                        const card = my.board?.[i] ?? null
                        return <CardOnBoard key={i} card={card} isPlayer canAttack={isYourTurn && !!card && !card.exhausted && !selectedAttacker} onClick={handleMyCardClick} />
                    })}
                </div>

                <PlayerHand cards={hand} isYourTurn={isYourTurn} onPlay={onPlayCard} />

                <div className="flex justify-between items-end mt-auto pt-4 relative z-20">
                    <PlayerHUD name={my.username} health={my.health} maxHealth={my.maxHealth || 20} mana={my.mana} maxMana={my.maxMana} />
                    {isYourTurn && (
                        <button onClick={onEndTurn} className="bg-primary text-on-primary font-mono text-xs tracking-widest uppercase py-3 px-6 corner-cut shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            END TURN
                        </button>
                    )}
                </div>
            </section>
        </main>
    )
}
