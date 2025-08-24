import React, { useEffect, useMemo, useState } from "react";

type Role = "user" | "assistant" | "system";
type ChatMessage = { role: Role; content: string };
type FAQItem = { q: string; a: string };

const PROXY_URL = "https://gpt-proxy-pink.vercel.app/api/chat";
const FAQ_URL = "https://sharathkumarnp.github.io/profile/ai/faq.json";

function normalize(s: string) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}
function score(a: string, b: string) {
    const A = new Set(normalize(a).split(/\W+/).filter(Boolean));
    const B = new Set(normalize(b).split(/\W+/).filter(Boolean));
    if (!A.size || !B.size) return 0;
    let inter = 0;
    for (const w of A) if (B.has(w)) inter++;
    return inter / (A.size + B.size - inter);
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [faq, setFaq] = useState<FAQItem[] | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(FAQ_URL, { cache: "no-store" });
                if (r.ok) setFaq(await r.json());
            } catch {/* ignore */}
        })();
    }, []);

    const bestFAQ = useMemo(() => {
        const q = input.trim();
        if (!q || !faq) return null;
        let best = { score: 0, item: null as FAQItem | null };
        for (const it of faq) {
            const s = score(q, it.q);
            if (s > best.score) best = { score: s, item: it };
        }
        return best.score >= 0.3 ? best.item : null;
    }, [input, faq]);

    const toggleChat = () => setIsOpen(v => !v);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || sending) return;

        // 1) local FAQ fallback (free)
        if (bestFAQ) {
            setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: bestFAQ.a }]);
            setInput("");
            return;
        }

        // 2) model call (minimal history)
        const userMessage: ChatMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            // only keep last few exchanges to save tokens; server trims too
            const trimmed = messages.filter(m => m.role === "user" || m.role === "assistant").slice(-8);

            const payload = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are Sharath’s portfolio assistant. Keep answers brief and concrete (<=100 words, bullets welcome). " +
                            "If unrelated, reply in one line and guide back to Sharath’s skills/projects."
                    },
                    ...trimmed,
                    userMessage
                ]
            };

            const res = await fetch(PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
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

            const reply =
                data?.choices?.[0]?.message?.content ??
                "Sorry, I couldn’t generate a response.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e: any) {
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: `Oops, something went wrong: ${e?.message || String(e)}` }
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={toggleChat}
                className="bg-black text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
                aria-label="Open chat"
                title="Chat with me"
            >
                💬
            </button>

            {isOpen && (
                <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col mt-2">
                    <div className="px-4 py-2 border-b text-sm font-semibold text-gray-800">
                        Sharath’s AI Assistant
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-2">
                        {messages.map((msg, idx) => (
                            <div key={idx}
                                 className={`text-sm ${msg.role === "user" ? "text-right" : "text-left text-gray-800"}`}>
                                <div className={`inline-block max-w-[85%] px-3 py-2 rounded ${
                                    msg.role === "user" ? "bg-blue-100" : "bg-gray-100"
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="text-left text-sm text-gray-500">
                                <span className="inline-block bg-gray-100 px-3 py-2 rounded">Thinking…</span>
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t flex">
                        <input
                            type="text"
                            className="flex-1 border rounded px-2 py-1 text-sm text-black"
                            placeholder="Ask me anything about Sharath…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            disabled={sending}
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 px-3 py-1 bg-black text-white rounded text-sm disabled:opacity-60"
                            disabled={sending}
                        >
                            {sending ? "…" : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
