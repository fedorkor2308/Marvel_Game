export default function CardOnBoard({ card = null, isPlayer = false, canAttack = false, onClick }) {
    const size = isPlayer ? 'w-28 h-40' : 'w-24 h-32'

    if (!card) {
        return (
            <div className={`${size} bg-surface border border-outline-variant flex items-center justify-center`}
                 style={{ boxShadow: 'inset 4px 4px 0px 0px rgba(0,0,0,0.8)' }}>
                <span className="text-outline/30 text-2xl">+</span>
            </div>
        )
    }

    return (
        <div
            onClick={() => onClick?.(card.instanceId)}
            className={`
                ${size} border p-1.5 flex flex-col shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all
                ${canAttack
                    ? 'bg-surface-container-high border-primary cursor-pointer hover:scale-105 hover:shadow-[0_0_8px_rgba(255,180,170,0.4)]'
                    : 'bg-surface-container border-outline-variant'
                }
                ${card.exhausted && isPlayer ? 'opacity-50' : ''}
            `}
        >
            <div className="flex-1 bg-surface-container relative overflow-hidden mb-1">
                {card.image_url ? (
                    <img src={card.image_url} alt={card.alias} className="w-full h-full object-cover" />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-outline/40">ART</span>
                )}
                <div className="absolute top-1 left-1 bg-surface-container-highest px-1 border border-primary/50">
                    <span className="font-mono text-[9px] text-primary">{card.cost}</span>
                </div>
                {card.exhausted && isPlayer && (
                    <div className="absolute inset-0 bg-surface-container/60 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-outline uppercase">TIRED</span>
                    </div>
                )}
            </div>
            <span className="font-mono text-[9px] text-on-surface uppercase truncate">{card.alias || card.name}</span>
            <div className="flex justify-between mt-1">
                <span className="font-mono text-[9px] text-outline">⚔ {card.currentAtk ?? card.attack}</span>
                <span className="font-mono text-[9px] text-outline">🛡 {card.currentDef ?? card.defense}</span>
            </div>
        </div>
    )
}
