// src/components/PortfolioAssistant.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/** ========= CONFIG ========= */
const PROXY_URL  = "https://gpt-proxy-pink.vercel.app/api/chat?v=11";
const PROFILE_URL = "https://sharathkumarnp.github.io/profile/ai/profile.json";
const FAQ_URL     = "https://sharathkumarnp.github.io/profile/ai/faq.json";
const MODEL       = "gpt-4o-mini";
const ALLOW_GENERAL_CHAT_DEFAULT = true;
/** ========================= */

type Role = "user" | "assistant" | "system";
type ChatMessage = { role: Role; content: string; html?: string };
type FAQItem = { q: string; a: string };
type Profile = Record<string, any>;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
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
    if (Array.isArray(p.target_roles) && p.target_roles.length) parts.push(`Roles: ${p.target_roles.join(", ")}`);
    if (p.summary) parts.push(`Summary: ${p.summary}`);
    if (Array.isArray(p.skills) && p.skills.length) parts.push(`Skills: ${p.skills.join(", ")}`);
    if (Array.isArray(p.certs) && p.certs.length) parts.push(`Certs: ${p.certs.join(", ")}`);
    if (Array.isArray(p.experience) && p.experience.length) {
        const exp = p.experience.slice(0, 3).map((e: any) =>
            `${e.role} @ ${e.company} (${e.years}) — ${(e.highlights||[]).slice(0,2).join("; ")}`
        );
        parts.push(`Experience: ${exp.join(" | ")}`);
    }
    if (Array.isArray(p.projects) && p.projects.length) {
        const proj = p.projects.slice(0, 4).map((x: any) =>
            `${x.name}: ${(x.stack||[]).join("/")} — ${(x.highlights||[])[0]||""}`
        );
        parts.push(`Projects: ${proj.join(" | ")}`);
    }
    if (p.contact) {
        const c = p.contact;
        const bits = [
            c.email ? `Email: ${c.email}` : null,
            c.linkedin ? `LinkedIn: ${c.linkedin}` : null,
            c.github ? `GitHub: ${c.github}` : null,
            c.website ? `Website: ${c.website}` : null,
            c.telegram ? `Telegram: ${c.telegram}` : null,
        ].filter(Boolean);
        if (bits.length) parts.push(`Contact: ${bits.join(" • ")}`);
    }
    return parts.join("\n");
}

const chip = (text: string) =>
    `<span class="inline-block rounded-full px-2.5 py-1 text-[12px] bg-white/10 border border-white/10 mr-1 mb-1">${escapeHtml(text)}</span>`;
const anchor = (href: string, label?: string) =>
    `<a class="underline decoration-white/40 hover:decoration-white" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label || href)}</a>`;

function rolesHtml(roles: string[]): string {
    return `
    <div class="space-y-2">
      <div class="text-[13px] uppercase tracking-wide text-white/70">Target Roles</div>
      <div class="flex flex-wrap">${roles.map(chip).join("")}</div>
    </div>`;
}
function skillsHtml(skills: string[]): string {
    return `
    <div class="space-y-2">
      <div class="text-[13px] uppercase tracking-wide text-white/70">Top Skills</div>
      <div class="flex flex-wrap">${skills.map(chip).join("")}</div>
    </div>`;
}
function contactHtml(c: any): string {
    const lines: string[] = [];
    if (c.email)   lines.push(`${chip("Email")} ${anchor(`mailto:${c.email}`, c.email)}`);
    if (c.linkedin)lines.push(`${chip("LinkedIn")} ${anchor(c.linkedin)}`);
    if (c.github)  lines.push(`${chip("GitHub")} ${anchor(c.github)}`);
    if (c.website) lines.push(`${chip("Website")} ${anchor(c.website)}`);
    if (c.telegram)lines.push(`${chip("Telegram")} ${anchor(c.telegram)}`);
    if (!lines.length) return `<div>No contact details provided.</div>`;
    return `
    <div class="space-y-2">
      <div class="text-[13px] uppercase tracking-wide text-white/70">Contact</div>
      <ul class="space-y-1">${lines.map(l => `<li class="text-[14px]">${l}</li>`).join("")}</ul>
    </div>`;
}
function projectsHtml(projects: any[]): string {
    const items = projects.slice(0, 4).map(p => {
        const title = `<span class="font-medium">${escapeHtml(p.name || "Project")}</span>`;
        const stack  = (p.stack && p.stack.length) ? `<span class="text-white/70"> — ${escapeHtml(p.stack.join(", "))}</span>` : "";
        const link   = p.link ? ` · ${anchor(p.link, "Link")}` : "";
        return `<li class="text-[14px] leading-relaxed">${title}${stack}${link}</li>`;
    });
    return `
    <div class="space-y-2">
      <div class="text-[13px] uppercase tracking-wide text-white/70">Recent Projects</div>
      <ul class="list-disc pl-5 space-y-1">${items.join("")}</ul>
    </div>`;
}
function escapeHtml(s: string) {
    return (s || "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function escapeAttr(s: string) { return escapeHtml(s); }

const PortfolioAssistant: React.FC = () => {
    // Visibility + animation state
    const [open, setOpen] = useState(false);     // mounted/visible
    const [closing, setClosing] = useState(false); // play closing animation

    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [typingLocal, setTypingLocal] = useState(false);

    // Knowledge
    const [profile, setProfile] = useState<Profile | null>(null);
    const [faq, setFaq] = useState<FAQItem[] | null>(null);
    const [kbReady, setKbReady] = useState(false);

    // UI flags
    const [showWelcome, setShowWelcome] = useState(true);
    const [showTips, setShowTips] = useState(true);
    const [allowGeneral, setAllowGeneral] = useState(ALLOW_GENERAL_CHAT_DEFAULT);

    const listRef = useRef<HTMLDivElement>(null);

    const openChat = () => { setClosing(false); setOpen(true); };
    const closeChat = () => { setClosing(true); setTimeout(() => { setOpen(false); setClosing(false); }, 260); };

    useEffect(() => {
        (async () => {
            try {
                const p = await fetch(PROFILE_URL, { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
                const f = await fetch(FAQ_URL, { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
                if (p) setProfile(p);
                if (f) setFaq(f);
                else if (p?.faqs && Array.isArray(p.faqs)) setFaq(p.faqs);
            } finally { setKbReady(true); }
        })();
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("portfolio-assistant");
            if (saved) {
                const arr = JSON.parse(saved) as ChatMessage[];
                setMessages(arr);
                if (arr.length > 0) { setShowWelcome(false); setShowTips(false); }
            }
        } catch {}
    }, []);
    useEffect(() => {
        try { localStorage.setItem("portfolio-assistant", JSON.stringify(messages.slice(-24))); } catch {}
    }, [messages]);
    useEffect(() => {
        if (!(open && !closing)) return;
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, sending, typingLocal, open, closing]);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) closeChat(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const profileContext = useMemo(() => serializeProfile(profile || {}), [profile]);
    const suggestions = ["What roles are you targeting?","List your top skills.","Tell me about your recent projects.","How can I contact you?"];

    const tryFAQ = (q: string): string | null => {
        if (!faq) return null;
        let best = { s: 0, a: "" };
        for (const it of faq) {
            const s = jaccard(q, it.q);
            if (s > best.s) best = { s, a: it.a };
        }
        return best.s >= 0.28 ? best.a : null;
    };

    const localRich = (text: string): ChatMessage | null => {
        if (!kbReady) return null;
        const s = normalize(text);

        if (/^(hi|hello|hey)\b/.test(s)) {
            return {
                role: "assistant",
                html: `<div class="space-y-2">
          <div>Hi! I can help with questions about <b>Sharath’s roles, skills, projects, experience, and contact info</b>.</div>
          <div class="flex flex-wrap">${suggestions.map(chip).join("")}</div>
        </div>`
            };
        }
        if (/role|position|target/.test(s)) {
            const roles = Array.isArray(profile?.target_roles) ? profile!.target_roles : null;
            if (roles?.length) return { role: "assistant", html: rolesHtml(roles), content: "" };
            const a = tryFAQ(text); if (a) return { role: "assistant", content: a };
            return null;
        }
        if (/skill|stack/.test(s)) {
            const skills = Array.isArray(profile?.skills) ? profile!.skills : null;
            if (skills?.length) return { role: "assistant", html: skillsHtml(skills), content: "" };
            const a = tryFAQ(text); if (a) return { role: "assistant", content: a };
            return null;
        }
        if (/contact|reach|email|linkedin|github|telegram|website/.test(s)) {
            const c = profile?.contact;
            if (c) return { role: "assistant", html: contactHtml(c), content: "" };
            const a = tryFAQ(text); if (a) return { role: "assistant", content: a };
            return null;
        }
        if (/project|work|recent/.test(s)) {
            const p = profile?.projects;
            if (Array.isArray(p) && p.length) return { role: "assistant", html: projectsHtml(p), content: "" };
            const a = tryFAQ(text); if (a) return { role: "assistant", content: a };
            return null;
        }
        const a = tryFAQ(text);
        return a ? { role: "assistant", content: a } : null;
    };

    const isPortfolioIntent = (text: string): boolean => {
        const s = normalize(text);
        if (/(role|skills?|projects?|experience|contact|resume|cv|cert|salary|relocat|github|linkedin|portfolio|education|availability|notice|location)\b/.test(s)) return true;
        if (/\b(sharath|you|your)\b/.test(s) && /(role|skill|project|experience|contact|resume|cv|cert|salary|relocat|github|linkedin|site|portfolio|about)/.test(s)) return true;
        return false;
    };

    const send = async (override?: string) => {
        const text = (override ?? input).trim();
        if (!text || sending || typingLocal) return;

        setShowWelcome(false);

        const cmd = text.trim();
        if (/^\/?(faq|help)\s*$/i.test(cmd)) { setShowTips(true); setInput(""); return; }
        if (/^\/?clear\s*$/i.test(cmd))     { setMessages([]); setShowWelcome(true); setShowTips(true); setInput(""); return; }
        if (/^\/?chat\s+on\s*$/i.test(cmd)) { setAllowGeneral(true); setMessages(p=>[...p,{role:"assistant",content:"General chat is now ON for this session. Type /chat off to disable."}]); setInput(""); return; }
        if (/^\/?chat\s+off\s*$/i.test(cmd)){ setAllowGeneral(false); setMessages(p=>[...p,{role:"assistant",content:"General chat is now OFF. I’ll answer only Sharath-related questions."}]); setInput(""); return; }

        const maybe = localRich(text);
        if (maybe) {
            setMessages(prev => [...prev, { role: "user", content: text }]);
            setShowTips(false);
            setInput("");
            setTypingLocal(true);
            await sleep(1000 + Math.floor(Math.random() * 1000)); // ⚡️typing effect for local answers
            setTypingLocal(false);
            setMessages(prev => [...prev, maybe]);
            return;
        }

        if (!isPortfolioIntent(text) && !allowGeneral) {
            setMessages(prev => [
                ...prev,
                { role: "user", content: text },
                {
                    role: "assistant",
                    html: `
            <div class="space-y-2">
              <div><b>Out of scope:</b> This assistant is for questions about <b>Sharath</b> (roles, skills, projects, experience, contact).</div>
              <div class="text-[13px] text-white/70">To save tokens, general tech Q&A is disabled.</div>
              <div class="flex flex-wrap">${suggestions.map(chip).join("")}</div>
              <div class="text-[13px] text-white/70">
                Need general help just once? Type <code>/chat on</code> to enable model replies, then <code>/chat off</code> to disable.
              </div>
              <div class="text-[13px]">Docs: <a class="underline decoration-white/40 hover:decoration-white" href="https://kubernetes.io/docs/home/" target="_blank" rel="noopener noreferrer">kubernetes.io/docs</a></div>
            </div>`
                }
            ]);
            setInput("");
            return;
        }

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
                    { role: "system", content: "You are Sharath’s portfolio assistant. Keep answers factual, concise, nicely formatted; use lists when helpful; linkify URLs/emails." },
                    ...(profileContext ? [{ role: "system" as const, content: "Sharath’s profile (trusted):\n" + profileContext }] : []),
                    ...trimmed,
                    userMessage
                ],
                temperature: 0.35,
                max_tokens: 256
            };

            const res = await fetch(PROXY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();

            if (!res.ok) {
                const msg = data?.code === "insufficient_quota"
                    ? "The assistant is temporarily unavailable (OpenAI quota). Please try again later."
                    : data?.message || "Something went wrong.";
                setMessages(prev => [...prev, { role: "assistant", content: msg }]);
                return;
            }

            const reply = data?.answer ?? data?.choices?.[0]?.message?.content ?? "Sorry, I couldn’t generate a response.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e: any) {
            setMessages(prev => [...prev, { role: "assistant", content: `Oops: ${e?.message || String(e)}` }]);
        } finally {
            setSending(false);
        }
    };

    const autoLink = (text: string) => {
        const urlRe = /((https?:\/\/|www\.)[^\s)]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
        const parts: React.ReactNode[] = [];
        let last = 0; let m: RegExpExecArray | null;
        while ((m = urlRe.exec(text)) !== null) {
            const idx = m.index; if (idx > last) parts.push(text.slice(last, idx));
            const raw = m[0];
            if (raw.includes("@") && !raw.startsWith("http")) {
                parts.push(<a key={idx} className="underline decoration-white/40 hover:decoration-white" href={`mailto:${raw}`}>{raw}</a>);
            } else {
                const href = raw.startsWith("http") ? raw : `https://${raw}`;
                parts.push(<a key={idx} className="underline decoration-white/40 hover:decoration-white" href={href} target="_blank" rel="noopener noreferrer">{raw}</a>);
            }
            last = idx + raw.length;
        }
        if (last < text.length) parts.push(text.slice(last));
        return parts;
    };

    const isShowing = open && !closing;

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
            {/* FAB (bottom-right) with fade/scale */}
            {!open && (
                <button
                    onClick={openChat}
                    className="pointer-events-auto fixed
                     bottom-[max(1rem,env(safe-area-inset-bottom))]
                     right-[max(1rem,env(safe-area-inset-right))]
                     group rounded-full p-4 shadow-lg
                     bg-gradient-to-br from-fuchsia-600 to-indigo-600
                     hover:scale-105 transition-transform duration-200 ease-out
                     animate-[fadeIn_.18s_ease-out]"
                    aria-label="Open chat"
                    title="Chat with me"
                >
                    <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 blur opacity-50 group-hover:opacity-70" />
                    <span className="relative text-white text-xl">💬</span>
                </button>
            )}

            {/* Backdrop on mobile; fade in/out */}
            {(open || closing) && (
                <div
                    onClick={closeChat}
                    className={`pointer-events-auto fixed inset-0 md:hidden transition-opacity duration-200
                     ${isShowing ? "opacity-100" : "opacity-0"}`}
                />
            )}

            {/* Panel with enter/exit transitions */}
            {(open || closing) && (
                <div>
                    <div
                        className={`
              pointer-events-auto fixed
              md:right-[max(1.25rem,env(safe-area-inset-right))]
              md:bottom-[max(1.25rem,env(safe-area-inset-bottom))]
              md:w-[26rem] md:h-[36rem] md:rounded-2xl

              left-0 right-0 bottom-0 md:left-auto
              w-[calc(100vw-1rem)] md:w-auto
              h-[min(80dvh,calc(100dvh-5rem))] md:h-[36rem]
              rounded-t-2xl md:rounded-2xl

              mx-auto md:mx-0
              backdrop-blur-xl bg-neutral-900/80 border border-white/10 shadow-2xl overflow-hidden flex flex-col

              transition-all duration-250 ease-out
              ${isShowing
                            ? "md:opacity-100 md:translate-y-0 md:scale-100 translate-y-0"
                            : "md:opacity-0   md:translate-y-2 md:scale-[0.98] translate-y-full"}
            `}
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
                                    onClick={closeChat}
                                    className="p-1 rounded hover:bg-white/20 transition-colors"
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
                        <div ref={listRef} className="min-h-0 flex-1 px-3 py-3 overflow-y-auto overscroll-contain space-y-2 scroll-smooth">
                            {showWelcome && !messages.length && (
                                <div className="text-xs text-white/90 bg-white/5 border border-white/10 rounded-xl p-3">
                                    👋 I can answer questions about Sharath’s background. Try a quick prompt:
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {["What roles are you targeting?","List your top skills.","Tell me about your recent projects.","How can I contact you?"].map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setShowWelcome(false); setShowTips(false); send(s); }}
                                                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/90 transition"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`md:max-w-[80%] max-w-[88%] text-sm leading-relaxed px-3 py-2 rounded-2xl border
                                  ${m.role === "user"
                                        ? "bg-gradient-to-br from-blue-600/80 to-indigo-600/80 text-white border-white/10"
                                        : "bg-white/10 text-white/90 border-white/10 backdrop-blur"}`}>
                                        {m.html ? (
                                            <div className="prose-invert prose-p:my-0 prose-ul:my-0 prose-li:my-0 text-[14px]" dangerouslySetInnerHTML={{ __html: m.html }} />
                                        ) : m.role === "assistant" ? (
                                            <div className="text-[14px]">
                                                {m.content.split(/\n{2,}/).map((p, j) => <p key={j} className="my-1">{autoLink(p)}</p>)}
                                            </div>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {(sending || typingLocal) && (
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
                        <div className="relative p-3 border-t border-white/10 bg-black/40">
                            {showTips && !showWelcome && messages.length > 0 && (
                                <div className="absolute bottom-full left-3 right-3 mb-2 z-20 transition-all duration-200 ease-out">
                                    <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-3 shadow-lg">
                                        <div className="text-xs text-white/90">
                                            Quick prompts:
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {["What roles are you targeting?","List your top skills.","Tell me about your recent projects.","How can I contact you?"].map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setShowWelcome(false); setShowTips(false); send(s); }}
                                                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/90 transition"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                                    placeholder="Ask me anything about Sharath…"
                                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
                                    disabled={sending || typingLocal}
                                />
                                <button
                                    onClick={() => { setShowWelcome(false); setShowTips(s => !s); }}
                                    className="shrink-0 p-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
                                    title={showTips ? "Hide FAQ" : "Show FAQ"}
                                    aria-label="Toggle FAQ"
                                >
                                    ?
                                </button>
                                <button
                                    onClick={() => send()}
                                    disabled={sending || typingLocal || !input.trim()}
                                    className="shrink-0 p-2 rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white hover:opacity-95 disabled:opacity-50 transition"
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
                                <kbd className="ml-1 px-1 py-0.5 rounded bg-white/10 border border-white/10">/clear</kbd> to reset ·
                                <kbd className="ml-1 px-1 py-0.5 rounded bg-white/10 border border-white/10">/chat on</kbd> enable general Q&A
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioAssistant;
