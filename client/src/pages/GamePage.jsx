import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth }    from '../hooks/useAuth'
import { useGame }    from '../hooks/useGame'
import Battlefield    from '../components/game/Battlefield'
import CoinFlip       from '../components/game/CoinFlip'
import GameEndOverlay from '../components/game/GameEndOverlay'

export default function GamePage() {
    const { user }    = useAuth()
    const location    = useLocation()
    const navigate    = useNavigate()
    const { gameState, hand, timer, gameOver, opponentLeft, playCard, attackWith, endTurn } = useGame()

    const firstPlayerId = location.state?.firstPlayerId
    const [coinDone, setCoinDone] = useState(false)

    const myId      = user?.id
    const myPlayer  = gameState?.players?.[myId]
    const oppId     = gameState
        ? Object.keys(gameState.players).find(id => Number(id) !== Number(myId))
        : null
    const oppPlayer = oppId ? gameState.players[oppId] : null
    const isMyTurn  = gameState ? String(gameState.currentPlayerId) === String(myId) : false

    // Coin flip screen
    if (firstPlayerId && !coinDone) {
        const iGoFirst = String(firstPlayerId) === String(myId)
        return <CoinFlip autoResult={iGoFirst ? 'YOU' : 'OPPONENT'} onComplete={() => setCoinDone(true)} />
    }

    // Game over screen
    if (gameOver) {
        const isVictory = String(gameOver.winnerId) === String(myId)
        const stats = [
            { id: 'MOD-01', icon: '✦', label: 'Result',       value: isVictory ? 'VICTORY' : 'DEFEAT',               valueColor: isVictory ? 'text-primary' : 'text-outline' },
            { id: 'MOD-02', icon: '⚔', label: 'Winner',       value: (gameOver.winnerUsername || '---').toUpperCase(), valueColor: 'text-on-surface' },
            { id: 'MOD-03', icon: '↺', label: 'Turn',         value: String(gameState?.turn ?? '--'),                  valueColor: 'text-tertiary' },
        ]
        return <GameEndOverlay isVictory={isVictory} stats={stats} playerName={user?.username?.toUpperCase()} />
    }

    // Waiting for game state
    if (!gameState) {
        return (
            <div className="min-h-svh bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="font-mono text-[11px] text-outline uppercase tracking-widest animate-pulse">LOADING BATTLE DATA...</span>
                    <button onClick={() => navigate('/lobby')} className="font-mono text-[10px] text-outline hover:text-primary uppercase tracking-widest transition-colors">← RETURN TO LOBBY</button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full overflow-hidden flex bg-background">
            <aside className="w-56 shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col h-screen">
                <div className="p-4 border-b border-outline-variant">
                    <h1 className="font-grotesk text-lg font-bold text-primary tracking-tighter text-glow-red">KINETIC_STRIKE</h1>
                </div>
                <div className="p-4 border-b border-outline-variant flex items-center gap-3">
                    <div className="w-9 h-9 bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                        <span className="font-mono text-[10px] text-outline">OPR</span>
                    </div>
                    <div>
                        <p className="font-mono text-[11px] text-on-surface uppercase tracking-wider">{user?.username}</p>
                        <p className={`font-mono text-[9px] uppercase tracking-widest ${isMyTurn ? 'text-primary animate-pulse' : 'text-outline'}`}>
                            {isMyTurn ? 'YOUR TURN' : 'WAITING...'}
                        </p>
                    </div>
                </div>
                {opponentLeft && (
                    <div className="p-4 border-b border-outline-variant">
                        <span className="font-mono text-[10px] text-primary uppercase tracking-widest animate-pulse">⚠ OPPONENT DISCONNECTED</span>
                    </div>
                )}
                <div className="p-3 mt-auto border-t border-outline-variant">
                    <p className="font-mono text-[9px] text-outline uppercase tracking-widest">Turn {gameState.turn}</p>
                </div>
            </aside>

            <Battlefield
                myPlayer={myPlayer}
                opponentPlayer={oppPlayer}
                hand={hand}
                isYourTurn={isMyTurn}
                timer={timer}
                onPlayCard={playCard}
                onAttackWith={attackWith}
                onEndTurn={endTurn}
            />
        </div>
    )
}
