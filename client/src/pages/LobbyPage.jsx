import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }   from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'
import { roomsApi }  from '../services/api'
import * as E from '../constants/events'

export default function LobbyPage() {
    const { user, logout }  = useAuth()
    const { socket }        = useSocket()
    const navigate          = useNavigate()

    const [rooms,      setRooms]      = useState([])
    const [roomCode,   setRoomCode]   = useState('')
    const [joinCode,   setJoinCode]   = useState('')
    const [queuing,    setQueuing]    = useState(false)
    const [statusMsg,  setStatusMsg]  = useState('')
    const [createdCode, setCreatedCode] = useState(null)

    // Load open rooms
    useEffect(() => {
        roomsApi.getOpen().then(r => setRooms(r.data)).catch(() => {})
    }, [])

    // Socket events
    useEffect(() => {
        if (!socket) return

        const onRoomState = (data) => {
            if (data.status === 'both_joined' || data.status === 'starting') {
                setStatusMsg('Opponent joined! Starting...')
            }
        }
        const onMatchFound = () => setStatusMsg('Match found! Loading game...')
        const onGameStart  = (data) => navigate('/game', { state: { firstPlayerId: data.firstPlayerId } })
        const onError      = ({ message }) => { setStatusMsg(message); setQueuing(false) }

        socket.on(E.ROOM_STATE,  onRoomState)
        socket.on(E.MATCH_FOUND, onMatchFound)
        socket.on(E.GAME_START,  onGameStart)
        socket.on(E.ERROR,       onError)

        return () => {
            socket.off(E.ROOM_STATE,  onRoomState)
            socket.off(E.MATCH_FOUND, onMatchFound)
            socket.off(E.GAME_START,  onGameStart)
            socket.off(E.ERROR,       onError)
        }
    }, [socket, navigate])

    function handleFindMatch() {
        if (!socket) return
        setQueuing(true)
        setStatusMsg('Searching for opponent...')
        socket.emit(E.MATCH_JOIN_QUEUE)
    }

    function handleLeaveQueue() {
        socket?.emit(E.MATCH_LEAVE_QUEUE)
        setQueuing(false)
        setStatusMsg('')
    }

    function handleCreateRoom() {
        if (!socket) return
        socket.emit(E.ROOM_CREATE)
        socket.once(E.ROOM_STATE, (data) => {
            setCreatedCode(data.code)
            setStatusMsg('Room created! Share the code with your opponent.')
        })
    }

    function handleJoinRoom() {
        if (!socket || !joinCode.trim()) return
        socket.emit(E.ROOM_JOIN, { code: joinCode.trim().toUpperCase() })
        setStatusMsg('Joining room...')
    }

    function handleReady() {
        socket?.emit(E.ROOM_READY)
        setStatusMsg('Ready! Waiting for opponent...')
    }

    return (
        <div className="min-h-svh bg-background text-on-surface flex flex-col">

            {/* Top bar */}
            <header className="border-b border-outline-variant px-6 py-3 flex justify-between items-center">
                <h1 className="font-grotesk text-xl font-bold text-primary tracking-tighter text-glow-red">KINETIC_STRIKE</h1>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] text-outline uppercase tracking-widest">OPR: {user?.username}</span>
                    <button onClick={() => navigate('/leaderboard')} className="font-mono text-[11px] text-outline hover:text-primary uppercase tracking-widest transition-colors">LEADERBOARD</button>
                    <button onClick={logout} className="font-mono text-[11px] text-outline hover:text-primary uppercase tracking-widest transition-colors">LOGOUT</button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-6">

                {/* Status */}
                {statusMsg && (
                    <div className="border border-primary/40 bg-primary/10 px-4 py-3">
                        <span className="font-mono text-[11px] text-primary uppercase tracking-widest">{statusMsg}</span>
                    </div>
                )}

                {/* Actions row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Find match */}
                    <div className="border border-outline-variant bg-surface-container p-5 flex flex-col gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <p className="font-mono text-[10px] text-outline uppercase tracking-widest">Auto-Match</p>
                        <h2 className="font-grotesk text-lg font-bold text-on-surface">Find Opponent</h2>
                        {!queuing ? (
                            <button onClick={handleFindMatch} className="mt-auto w-full bg-primary text-on-primary font-mono text-xs tracking-widest uppercase py-3 corner-cut shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                                FIND MATCH
                            </button>
                        ) : (
                            <button onClick={handleLeaveQueue} className="mt-auto w-full border border-outline-variant text-outline font-mono text-xs tracking-widest uppercase py-3 hover:border-primary hover:text-primary transition-colors">
                                CANCEL SEARCH
                            </button>
                        )}
                    </div>

                    {/* Create room */}
                    <div className="border border-outline-variant bg-surface-container p-5 flex flex-col gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <p className="font-mono text-[10px] text-outline uppercase tracking-widest">Private Room</p>
                        <h2 className="font-grotesk text-lg font-bold text-on-surface">Create Room</h2>
                        {createdCode ? (
                            <div className="flex flex-col gap-2">
                                <p className="font-mono text-[10px] text-outline uppercase tracking-widest">Room code:</p>
                                <p className="font-grotesk text-3xl font-bold text-primary text-glow-red tracking-widest">{createdCode}</p>
                                <button onClick={handleReady} className="w-full bg-primary text-on-primary font-mono text-xs tracking-widest uppercase py-3 corner-cut shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                                    READY
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleCreateRoom} className="mt-auto w-full border border-outline-variant text-on-surface font-mono text-xs tracking-widest uppercase py-3 hover:border-primary hover:text-primary transition-colors">
                                CREATE ROOM
                            </button>
                        )}
                    </div>

                    {/* Join by code */}
                    <div className="border border-outline-variant bg-surface-container p-5 flex flex-col gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <p className="font-mono text-[10px] text-outline uppercase tracking-widest">Join Room</p>
                        <h2 className="font-grotesk text-lg font-bold text-on-surface">Enter Code</h2>
                        <input
                            value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="XXXXXX" maxLength={6}
                            className="bg-surface-container-high border border-outline-variant text-on-surface font-grotesk text-center text-xl tracking-[0.3em] px-4 py-3 outline-none focus:border-primary"
                        />
                        <button onClick={handleJoinRoom} className="w-full bg-surface-container-high border border-outline-variant text-on-surface font-mono text-xs tracking-widest uppercase py-3 hover:border-primary hover:text-primary transition-colors">
                            JOIN ROOM
                        </button>
                    </div>
                </div>

                {/* Open rooms list */}
                <div className="border border-outline-variant bg-surface-container">
                    <div className="border-b border-outline-variant px-4 py-3 flex justify-between items-center">
                        <span className="font-mono text-[11px] text-outline uppercase tracking-widest">Open Rooms</span>
                        <button onClick={() => roomsApi.getOpen().then(r => setRooms(r.data))} className="font-mono text-[10px] text-outline hover:text-primary uppercase tracking-widest transition-colors">↻ REFRESH</button>
                    </div>
                    {rooms.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <span className="font-mono text-[11px] text-outline uppercase tracking-widest">No open rooms — create one or find a match</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-outline-variant">
                            {rooms.map(room => (
                                <div key={room.id} className="px-4 py-3 flex justify-between items-center hover:bg-surface-container-high transition-colors">
                                    <div>
                                        <span className="font-mono text-xs text-on-surface uppercase tracking-widest">{room.host}</span>
                                        <span className="font-mono text-[10px] text-outline ml-3 tracking-widest">#{room.code}</span>
                                    </div>
                                    <button
                                        onClick={() => { setJoinCode(room.code); handleJoinRoom() }}
                                        className="font-mono text-[10px] text-primary hover:text-glow-red uppercase tracking-widest transition-colors"
                                    >
                                        JOIN →
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
