import React, { useEffect, useMemo, useRef, useState } from "react";

/** ========= CONFIG ========= */
const PROXY_URL  = "https://gpt-proxy-pink.vercel.app/api/chat";
const PROFILE_URL = "https://sharathkumarnp.github.io/profile/ai/profile.json";
const FAQ_URL     = "https://sharathkumarnp.github.io/profile/ai/faq.json";
const MODEL       = "gpt-4o-mini"; // client hint (server also defaults)
/** ========================= */

type Role = "user" | "assistant" | "system";
type ChatMessage = { role: Role; content: string };
type FAQItem = { q: string; a: string };
type Profile = Record<string, any>;

function normalize(s: string) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}
function score(a: string, b: string) {
    const A = new Set(normalize(a).split(/\W+/).filter(Boolean));
    const B = new Set(normalize(b).split(/\W+/).filter(Boolean));
    if (!A.size || !B.size) return 0;
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    return inter / (A.size + B.size - inter);
}
function serializeProfile(p: Profile): string {
    if (!p) return "";
    const parts: string[] = [];
    if (p.name || p.title) parts.push(`Name: ${p.name || ""} | Title: ${p.title || ""}`);
    if (p.summary) parts.push(`Summary: ${p.summary}`);
    if (Array.isArray(p.skills)) parts.push(`Skills: ${p.skills.join(", ")}`);
    if (Array.isArray(p.certs)) parts.push(`Certs: ${p.certs.join(", ")}`);
    if (Array.isArray(p.experience)) {
        const exp = p.experience.slice(0, 3).map((e: any) =>
            `${e.role} @ ${e.company} (${e.years}) — ${(e.highlights||[]).slice(0,2).join("; ")}`
        );
        parts.push(`Experience: ${exp.join(" | ")}`);
    }
    if (Array.isArray(p.projects)) {
        const proj = p.projects.slice(0, 4).map((x: any) =>
            `${x.name}: ${(x.stack||[]).join("/")} — ${(x.highlights||[])[0]||""}`
        );
        parts.push(`Projects: ${proj.join(" | ")}`);
    }
    return parts.join("\n");
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [faq, setFaq] = useState<FAQItem[] | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load profile + FAQ (token-free context + local fallback)
    useEffect(() => {
        (async () => {
            try {
                const [p, f] = await Promise.allSettled([
                    fetch(PROFILE_URL, { cache: "no-store" }).then(r => r.ok ? r.json() : null),
                    fetch(FAQ_URL,     { cache: "no-store" }).then(r => r.ok ? r.json() : null),
                ]);
                if (p.status === "fulfilled" && p.value) setProfile(p.value);
                if (f.status === "fulfilled" && f.value) setFaq(f.value);
            } catch { /* ignore */ }
        })();
    }, []);

    // Persist last session (optional, small)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("sharath-chat");
            if (saved) setMessages(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);
    useEffect(() => {
        try { localStorage.setItem("sharath-chat", JSON.stringify(messages.slice(-30))); } catch {}
    }, [messages]);

    // Auto-scroll
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, sending, isOpen]);

    // Close on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const profileContext = useMemo(() => serializeProfile(profile || {}), [profile]);

    // Quick suggestions (appear on empty thread)
    const suggestions = [
        "What roles are you targeting?",
        "List your top skills.",
        "Tell me about your recent projects.",
        "How can I contact you?"
    ];

    const bestFAQFor = (q: string): FAQItem | null => {
        if (!faq || !q.trim()) return null;
        let best = { s: 0, item: null as FAQItem | null };
        for (const it of faq) {
            const s = score(q, it.q);
            if (s > best.s) best = { s, item: it };
        }
        return best.s >= 0.3 ? best.item : null;
    };

    const sendMessage = async (override?: string) => {
        const text = (override ?? input).trim();
        if (!text || sending) return;

        // Local FAQ fallback (zero tokens)
        const maybe = bestFAQFor(text);
        if (maybe) {
            setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: maybe.a }]);
            setInput("");
            return;
        }

        const userMessage: ChatMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            // Keep last few exchanges (token savings); server trims too
            const trimmed = messages.filter(m => m.role === "user" || m.role === "assistant").slice(-8);

            const payload = {
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are Sharath’s portfolio assistant. Keep answers brief, concrete, and helpful (<=100 words; bullets welcome). " +
                            "If unrelated, answer in one short line and guide back to Sharath’s skills/projects."
                    },
                    ...(profileContext ? [{
                        role: "system" as const,
                        content: "Sharath’s profile (trusted):\n" + profileContext
                    }] : []),
                    ...trimmed,
                    userMessage
                ],
                temperature: 0.2
            };

            const res = await fetch(PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                const msg =
                    data?.code === "insufficient_quota"
                        ? "The assistant is temporarily unavailable (OpenAI quota). Please try again later."
                        : data?.message || "Something went wrong.";
                setMessages(prev => [...prev, { role: "assistant", content: msg }]);
                return;
            }

            const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn’t generate a response.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: "assistant", content: `Oops: ${e?.message || String(e)}` }]);
        } finally {
            setSending(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* FAB */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative rounded-full p-4 shadow-lg bg-gradient-to-br from-fuchsia-600 to-indigo-600 hover:scale-105 transition-transform"
                    aria-label="Open chat"
                >
                    <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 blur opacity-50 group-hover:opacity-70" />
                    <span className="relative text-white text-xl">💬</span>
                </button>
            )}

            {/* Panel */}
            {isOpen && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    className="w-[22rem] md:w-96 h-[34rem] backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative px-4 py-3 bg-gradient-to-r from-indigo-600/90 to-fuchsia-600/90 text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold">Sharath’s AI Assistant</div>
                                <div className="text-[11px] opacity-80">Ask about skills, projects, and experience</div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded hover:bg-white/20"
                                aria-label="Close chat"
                                title="Close"
                            >
                                {/* X icon */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="flex-1 px-3 py-3 overflow-y-auto space-y-2 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="text-xs text-white/80 bg-black/30 border border-white/10 rounded-xl p-3">
                                👋 Hi! I can answer questions about Sharath’s background. Try a quick prompt:
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(s)}
                                            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/90"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] text-sm leading-relaxed px-3 py-2 rounded-2xl border
                  ${m.role === "user"
                                    ? "bg-gradient-to-br from-blue-600/80 to-indigo-600/80 text-white border-white/10"
                                    : "bg-white/10 text-white/90 border-white/10 backdrop-blur"}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {sending && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-2xl bg-white/10 text-white/80 border border-white/10">
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse [animation-delay:150ms]">●</span>
                    <span className="animate-pulse [animation-delay:300ms]">●</span>
                  </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Composer */}
                    <div className="p-3 border-t border-white/10 bg-black/40 backdrop-blur">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Ask me anything about Sharath…"
                                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                                disabled={sending}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={sending || !input.trim()}
                                className="shrink-0 p-2 rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white hover:opacity-95 disabled:opacity-50"
                                aria-label="Send"
                                title="Send"
                            >
                                {/* Send icon */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2 text-[10px] text-white/50">
                            Press <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Esc</kbd> to close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
