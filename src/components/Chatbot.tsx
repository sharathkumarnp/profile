import React, { useState } from "react";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const PROXY_URL = "https://gpt-proxy-delta.vercel.app/api/chat"; // ← your Vercel endpoint

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim() || sending) return;

        const userMessage: ChatMessage = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            // Build payload: include a short system persona plus the chat history and the new user message
            const payload = {
                messages: [
                    {
                        role: "system",
                        content:
                            "You are Sharath’s portfolio assistant. Be concise, friendly, and helpful. \
              Answer questions about his skills (SRE, cloud, CI/CD, K8s, observability), projects, and experience. \
              If a question is unrelated, answer briefly and steer back to portfolio topics.",
                    },
                    ...messages,
                    userMessage,
                ],
            };

            const response = await fetch(PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                const detail =
                    (data && (data.detail || data.message)) || "Unknown error from proxy";
                throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
            }

            // OpenAI chat/completions shape
            const reply =
                data?.choices?.[0]?.message?.content ??
                "Sorry, I couldn’t generate a response.";

            const botMessage: ChatMessage = { role: "assistant", content: reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err: any) {
            const botMessage: ChatMessage = {
                role: "assistant",
                content: `Oops, something went wrong: ${err?.message || String(err)}`,
            };
            setMessages((prev) => [...prev, botMessage]);
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
                            <div
                                key={idx}
                                className={`text-sm ${
                                    msg.role === "user"
                                        ? "text-right"
                                        : "text-left text-gray-800"
                                }`}
                            >
                                <div
                                    className={`inline-block max-w-[85%] px-3 py-2 rounded ${
                                        msg.role === "user" ? "bg-blue-100" : "bg-gray-100"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="text-left text-sm text-gray-500">
                <span className="inline-block bg-gray-100 px-3 py-2 rounded">
                  Thinking…
                </span>
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
