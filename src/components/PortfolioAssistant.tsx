// src/components/PortfolioAssistant.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/** ========= CONFIG ========= */
const PROXY_URL  = "https://gpt-proxy-pink.vercel.app/api/chat";
const PROFILE_URL = "https://sharathkumarnp.github.io/profile/ai/profile.json";
const FAQ_URL     = "https://sharathkumarnp.github.io/profile/ai/faq.json";
const MODEL       = "gpt-4o-mini";
/** ========================= */

type Role = "user" | "assistant" | "system";
type ChatMessage = { role: Role; content: string };
type FAQItem = { q: string; a: string };
type Profile = Record<string, any>;

const normalize = (s: string) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const jaccard = (a: string, b: string) => {
    const A = new Set(normalize(a).split(/\W+/).filter(Boolean));
    const B = new Set(normalize(b).split(/\W+/).filter(Boolean));
    if (!A.size || !B.size) return 0;
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    return inter / (A.size + B.size - inter);
};

function serializeProfile(p: Profile): string {
    if (!p) return "";
    const parts: string[] = [];
    if (p.name || p.title) parts.push(`Name: ${p.name || ""} | Title: ${p.title || ""}`);
    if (Array.isArray(p.target_roles)) parts.push(`Roles: ${p.target_roles.join(", ")}`);
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

const PortfolioAssistant: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [faq, setFaq] = useState<FAQItem[] | null>(null);
    const [showTips, setShowTips] = useState(true); // FAQ/suggestions panel
    const listRef = useRef<HTMLDivElement>(null);

    // Load profile + FAQ (token-free context)
    useEffect(() => {
        (async () => {
            try {
                const [p, f] = await Promise.allSettled([
                    fetch(PROFILE_URL, { cache: "no-store" }).then(r => r.ok ? r.json() : null),
                    fetch(FAQ_URL,     { cache: "no-store" }).then(r => r.ok ? r.json() : null),
                ]);
                if (p.status === "fulfilled" && p.value) setProfile(p.value);
                if (f.status === "fulfilled" && f.value) setFaq(f.value);
            } catch {}
        })();
    }, []);

    // Restore short history
    useEffect(() => {
        try {
            const saved = localStorage.getItem("portfolio-assistant");
            if (saved) {
                const arr = JSON.parse(saved) as ChatMessage[];
                setMessages(arr);
                if (arr.length > 0) setShowTips(false);
            }
        } catch {}
    }, []);
    // Persist
    useEffect(() => {
        try { localStorage.setItem("portfolio-assistant", JSON.stringify(messages.slice(-24))); } catch {}
    }, [messages]);

    // Scroll with new content
    useEffect(() => {
        if (!open) return;
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, sending, open]);

    // Close on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const profileContext = useMemo(() => serializeProfile(profile || {}), [profile]);

    const suggestions = [
        "What roles are you targeting?",
        "List your top skills.",
        "Tell me about your recent projects.",
        "How can I contact you?"
    ];

    // Local zero-token FAQ lookup
    const tryFAQ = (q: string): string | null => {
        if (!faq) return null;
        let best = { s: 0, a: "" };
        for (const it of faq) {
            const s = jaccard(q, it.q);
            if (s > best.s) best = { s, a: it.a };
        }
        return best.s >= 0.28 ? best.a : null;
    };

    // Speedy local roles short-circuit (also enforced on server)
    const rolesFromProfile = (): string | null => {
        const roles = Array.isArray(profile?.target_roles) ? profile!.target_roles : null;
        return roles && roles.length ? `Sharath is targeting roles: ${roles.join(", ")}.` : null;
        // If you prefer: return roles ? roles.join(", ") : null;
    };

    const send = async (override?: string) => {
        const text = (override ?? input).trim();
        if (!text || sending) return;

        // Commands
        const cmd = text.trim();
        if (/^\/?(faq|help)\s*$/i.test(cmd)) {
            setShowTips(true);
            setInput("");
            return;
        }
        if (/^\/?clear\s*$/i.test(cmd)) {
            setMessages([]);
            setShowTips(true);
            setInput("");
            return;
        }

        // Local FAQ / roles (no tokens)
        const localRoles = /role|position|target/i.test(text) ? (rolesFromProfile() || tryFAQ(text)) : null;
        const localFaq = localRoles || tryFAQ(text);
        if (localFaq) {
            setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: localFaq }]);
            setShowTips(false);
            setInput("");
            return;
        }

        // Else call proxy
        const userMessage: ChatMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setShowTips(false);
        setInput("");
        setSending(true);

        try {
            const trimmed = messages.filter(m => m.role === "user" || m.role === "assistant").slice(-8);

            const payload = {
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are Sharath’s portfolio assistant. Keep answers brief, concrete (<=100 words; bullets welcome). " +
                            "Use only the provided context/history. If unknown, reply: “I don’t know yet.”"
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

            // Proxy may return either {choices: ...} (OpenAI pass-through) or {answer: "..."} (fallback)
            const data = await res.json();

            if (!res.ok) {
                const msg =
                    data?.code === "insufficient_quota"
                        ? "The assistant is temporarily unavailable (OpenAI quota). Please try again later."
                        : data?.message || "Something went wrong.";
                setMessages(prev => [...prev, { role: "assistant", content: msg }]);
                return;
            }

            const reply =
                data?.answer ??
                data?.choices?.[0]?.message?.content ??
                "Sorry, I couldn’t generate a response.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: "assistant", content: `Oops: ${e?.message || String(e)}` }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed z-[1000] right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] pointer-events-none">
            {/* FAB */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="pointer-events-auto group relative rounded-full p-4 shadow-lg bg-gradient-to-br from-fuchsia-600 to-indigo-600 hover:scale-105 transition-transform"
                    aria-label="Open chat"
                    title="Chat with me"
                >
                    <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 blur opacity-50 group-hover:opacity-70" />
                    <span className="relative text-white text-xl">💬</span>
                </button>
            )}

            {/* Panel */}
            {open && (
                <div
                    className="pointer-events-auto w-[min(92vw,26rem)] max-h-[min(80vh,38rem)]
                     backdrop-blur-xl bg-neutral-900/80 border border-white/10
                     rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-600/90 to-fuchsia-600/90 text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold">Sharath’s AI Assistant</div>
                                <div className="text-[11px] opacity-85">Ask about skills, projects, and experience</div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded hover:bg-white/20"
                                aria-label="Close chat"
                                title="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={listRef}
                        className="min-h-0 flex-1 px-3 py-3 overflow-y-auto overscroll-contain space-y-2 scroll-smooth"
                    >
                        {showTips && (
                            <div className="text-xs text-white/90 bg-white/5 border border-white/10 rounded-xl p-3">
                                👋 I can answer questions about Sharath’s background. Try a quick prompt:
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {["What roles are you targeting?","List your top skills.","Tell me about your recent projects.","How can I contact you?"].map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setShowTips(false); send(s); }}
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
                    <div className="p-3 border-t border-white/10 bg-black/40">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                                placeholder="Ask me anything about Sharath…"
                                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                                disabled={sending}
                            />

                            {/* FAQ toggle */}
                            <button
                                onClick={() => setShowTips(s => !s)}
                                className="shrink-0 p-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20"
                                title={showTips ? "Hide FAQ" : "Show FAQ"}
                                aria-label="Toggle FAQ"
                            >
                                ?
                            </button>

                            {/* Send */}
                            <button
                                onClick={() => send()}
                                disabled={sending || !input.trim()}
                                className="shrink-0 p-2 rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white hover:opacity-95 disabled:opacity-50"
                                aria-label="Send" title="Send"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2 text-[10px] text-white/60">
                            Press <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Enter</kbd> to send ·
                            <kbd className="ml-1 px-1 py-0.5 rounded bg-white/10 border border-white/10">/faq</kbd> to show tips ·
                            <kbd className="ml-1 px-1 py-0.5 rounded bg-white/10 border border-white/10">/clear</kbd> to reset
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioAssistant;
