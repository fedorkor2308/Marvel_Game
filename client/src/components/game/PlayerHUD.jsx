export default function PlayerHUD({ name, health, maxHealth, mana, maxMana, cardsInHand, isOpponent = false }) {
    return (
        <div className={`flex ${isOpponent ? 'justify-between' : 'justify-between'} items-start`}>
            {/* Avatar + name + health */}
            <div className="flex items-center gap-3 bg-surface-container-high border border-outline-variant p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className={`${isOpponent ? 'w-14 h-14' : 'w-18 h-18'} bg-surface-container border border-outline shrink-0 overflow-hidden`}>
                    <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                        <span className="font-mono text-[10px] text-outline/50">IMG</span>
                    </div>
                </div>
                <div className="flex flex-col">
          <span className={`font-mono text-[11px] tracking-widest uppercase font-bold ${isOpponent ? 'text-on-surface' : 'text-primary'}`}>
            {name}
          </span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-primary text-xs">♥</span>
                        <span className={`font-mono text-xs ${isOpponent ? 'text-on-surface-variant' : 'text-primary'}`}>
              {health}/{maxHealth}
            </span>
                    </div>
                </div>
            </div>

            {/* Mana + cards */}
            <div className="flex flex-col items-end gap-2">
                <div className="bg-surface-container-highest border border-outline-variant p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                    <span className="text-tertiary text-xs">◇</span>
                    <span className="font-mono text-[11px] text-tertiary tracking-widest">
            MANA: {mana}/{maxMana}
          </span>
                </div>
                {cardsInHand !== undefined && (
                    <div className="bg-surface-container-highest border border-outline-variant px-3 py-1">
            <span className="font-mono text-[10px] text-outline tracking-widest uppercase">
              CARDS IN HAND: {cardsInHand}
            </span>
                    </div>
                )}
            </div>
        </div>
    )
}