import { Plus, Minus, MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Automation from "../Api/Automation"

type Position = "top" | "bottom" | "left" | "right" | "center"

const positionClass: Record<Position, string> = {
  top: "order-first",
  bottom: "order-last",
  left: "order-first",
  right: "order-last",
  center: "order-none",
}

type Message = {
  id: number
  role: "user" | "ai"
  text: string
}

const Counter = () => {
  const [count, setCount] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", text: "Hey! 👋 How can I help you today?" },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  const [json, setJson] = useState({
    Title: "top",
    incrementAdd: "right",
    decrementAdd: "left",
    resetAdd: "center",
    textDetails: "bottom",
    countDisplay: "center",
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, chatOpen])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { id: Date.now(), role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const data = await Automation.SendMessage(input)
      setJson(data)
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "ai",
        text: `✅ Layout updated!\n\n${Object.entries(data)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join("\n")}`,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "ai",
        text: "❌ Something went wrong. Please try again.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── Loading Modal ── */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative z-10 flex flex-col items-center gap-5
                          px-10 py-8 rounded-3xl
                          bg-slate-900/90 backdrop-blur-2xl
                          border border-white/10
                          shadow-2xl shadow-purple-500/30
                          animate-in fade-in zoom-in-95 duration-300">

            {/* Spinner ring */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-300" />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-white font-semibold text-sm tracking-wide">AI is thinking...</p>
              <p className="text-white/40 text-xs">Updating your layout</p>
            </div>

            {/* Animated dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Counter Card */}
      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10
                      w-full max-w-sm sm:max-w-md p-8 sm:p-12 rounded-3xl
                      bg-white/5 backdrop-blur-xl border border-white/10
                      shadow-2xl shadow-purple-500/20">

        <h2 className={`text-white/50 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase
                        ${positionClass[json.Title as Position]}`}>
          Counter
        </h2>

        <div className={`relative flex items-center justify-center
                        w-36 h-36 sm:w-48 sm:h-48 rounded-full
                        bg-gradient-to-br from-purple-600/30 to-pink-600/30
                        border border-white/10 shadow-inner
                        ${positionClass[json.countDisplay as Position]}`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl" />
          <span className={`relative font-black tabular-nums transition-all duration-300 text-5xl sm:text-7xl
                            ${count > 0 ? "text-purple-300" : count < 0 ? "text-pink-400" : "text-white/60"}`}>
            {count}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 w-full justify-center">
          <button onClick={() => setCount(c => c - 1)}
            className={`group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl
                       bg-white/5 border border-white/10 text-white/60
                       hover:bg-pink-500/20 hover:border-pink-400/40 hover:text-pink-300
                       active:scale-95 transition-all duration-200 shadow-lg hover:shadow-pink-500/20
                       ${positionClass[json.decrementAdd as Position]}`}>
            <Minus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button onClick={() => setCount(0)}
            className={`flex-1 max-w-[120px] sm:max-w-[140px] py-3 sm:py-4 rounded-2xl
                       bg-white/5 border border-white/10 text-white/40
                       text-xs sm:text-sm font-semibold tracking-widest uppercase
                       hover:bg-white/10 hover:text-white/70 active:scale-95 transition-all duration-200
                       ${positionClass[json.resetAdd as Position]}`}>
            Reset
          </button>

          <button onClick={() => setCount(c => c + 1)}
            className={`group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl
                       bg-purple-600/80 border border-purple-400/30 text-white
                       hover:bg-purple-500 hover:border-purple-300/50
                       active:scale-95 transition-all duration-200
                       shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                       ${positionClass[json.incrementAdd as Position]}`}>
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <p className={`text-white/20 text-xs tracking-widest ${positionClass[json.textDetails as Position]}`}>
          {count === 0 ? "Start counting..." : count > 0 ? `+${count} above zero` : `${count} below zero`}
        </p>
      </div>

      {/* ── AI Chat ── */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50
                        w-[calc(100vw-2rem)] max-w-sm flex flex-col
                        rounded-3xl overflow-hidden
                        bg-slate-900/90 backdrop-blur-2xl
                        border border-white/10 shadow-2xl shadow-purple-500/30
                        animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center shadow shadow-purple-500/40">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">AI Assistant</p>
                <p className={`text-xs flex items-center gap-1 ${loading ? "text-yellow-400" : "text-green-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${loading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
                  {loading ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center
                         text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                                  ${msg.role === "ai" ? "bg-purple-600/80" : "bg-pink-600/80"}`}>
                  {msg.role === "ai" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                                  ${msg.role === "ai"
                                    ? "bg-white/10 text-white/80 rounded-bl-sm"
                                    : "bg-purple-600/80 text-white rounded-br-sm shadow shadow-purple-500/30"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing bubble */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-600/80 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-white/10 bg-white/5">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl
                         px-4 py-2.5 text-sm text-white placeholder-white/30
                         outline-none focus:border-purple-400/50 focus:bg-white/10
                         transition-all duration-200 disabled:opacity-50"
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-purple-600/80 border border-purple-400/30
                         flex items-center justify-center text-white
                         hover:bg-purple-500 active:scale-95 transition-all duration-200
                         shadow shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-6 right-4 sm:right-8 z-50 w-14 h-14 rounded-full
                   bg-purple-600 hover:bg-purple-500 border border-purple-400/30
                   flex items-center justify-center text-white
                   shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60
                   active:scale-95 transition-all duration-200">
        {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

    </div>
  )
}

export default Counter
