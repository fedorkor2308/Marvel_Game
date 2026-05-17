import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import * as E from '../constants/events';
import { TURN_DURATION_SEC } from '../constants/game';

export function useGame() {
  const { socket } = useSocket();

  const [gameState,    setGameState]    = useState(null);
  const [hand,         setHand]         = useState([]);
  const [timer,        setTimer]        = useState(TURN_DURATION_SEC);
  const [gameOver,     setGameOver]     = useState(null);   // { winnerId, winnerUsername }
  const [opponentLeft, setOpponentLeft] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onGameState      = (s)   => setGameState(s);
    const onPlayerHand     = (h)   => setHand(h);
    const onTurnTick       = ({remaining}) => setTimer(remaining);
    const onGameEnd        = (data) => setGameOver(data);
    const onDisconnect     = ()    => setOpponentLeft(true);
    const onReconnect      = ()    => setOpponentLeft(false);

    socket.on(E.GAME_STATE,        onGameState);
    socket.on(E.PLAYER_HAND,       onPlayerHand);
    socket.on(E.TURN_TICK,         onTurnTick);
    socket.on(E.GAME_END,          onGameEnd);
    socket.on(E.PLAYER_DISCONNECT, onDisconnect);
    socket.on(E.PLAYER_RECONNECT,  onReconnect);

    return () => {
      socket.off(E.GAME_STATE,        onGameState);
      socket.off(E.PLAYER_HAND,       onPlayerHand);
      socket.off(E.TURN_TICK,         onTurnTick);
      socket.off(E.GAME_END,          onGameEnd);
      socket.off(E.PLAYER_DISCONNECT, onDisconnect);
      socket.off(E.PLAYER_RECONNECT,  onReconnect);
    };
  }, [socket]);

  const playCard   = useCallback((instanceId) =>
    socket?.emit(E.CARD_PLAY,   { instanceId }), [socket]);

  const attackWith = useCallback((attackerInstanceId, targetId) =>
    socket?.emit(E.CARD_ATTACK, { attackerInstanceId, targetId }), [socket]);

  const endTurn    = useCallback(() =>
    socket?.emit(E.TURN_END), [socket]);

  const sendChat   = useCallback((text) =>
    socket?.emit(E.CHAT_MESSAGE, { text }), [socket]);

  return { gameState, hand, timer, gameOver, opponentLeft, playCard, attackWith, endTurn, sendChat };
}
