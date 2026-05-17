const ROTATIONS = ['-rotate-6', '-rotate-3', 'rotate-0', 'rotate-3', 'rotate-6']
const OFFSETS   = ['translate-y-4', 'translate-y-2', '', 'translate-y-2', 'translate-y-4']

export default function PlayerHand({ cards = [], isYourTurn = false, onPlay }) {
    if (cards.length === 0) {
        return (
            <div className="h-48 w-full flex justify-center items-center">
                <span className="font-mono text-[11px] text-outline uppercase tracking-widest">No cards in hand</span>
            </div>
        )
    }

    return (
        <div className="h-48 w-full flex justify-center items-end gap-2 pb-0">
            {cards.map((card, i) => {
                const rot = ROTATIONS[i % ROTATIONS.length]
                const off = OFFSETS[i % OFFSETS.length]
                const canPlay = isYourTurn && onPlay

                return (
                    <div
                        key={card.instanceId || card.id || i}
                        onClick={() => canPlay && onPlay(card.instanceId)}
                        className={`
                            w-32 h-48 bg-surface-container-high border
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex flex-col
                            transition-transform select-none
                            ${rot} ${off}
                            ${canPlay
                                ? 'border-primary/60 hover:-translate-y-4 cursor-pointer'
                                : 'border-outline-variant/40 opacity-70 cursor-not-allowed'
                            }
                        `}
                    >
                        {/* Art */}
                        <div className="h-24 w-full bg-surface border border-outline-variant mb-2 relative overflow-hidden">
                            {card.image_url ? (
                                <img src={card.image_url} alt={card.alias} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 blueprint-grid opacity-40" />
                            )}
                            <div className="absolute top-1 left-1 bg-surface-container-highest px-1 border border-primary/60">
                                <span className="font-mono text-[10px] text-primary">{card.cost}</span>
                            </div>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface font-bold uppercase truncate">{card.alias || card.name}</span>
                        <div className="mt-auto flex justify-between">
                            <span className="font-mono text-[9px] text-outline">⚔ {card.attack}</span>
                            <span className="font-mono text-[9px] text-outline">🛡 {card.defense}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
