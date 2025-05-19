import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";

type Message = {
  id: string;
  user: "me" | "other";
  content: string;
  timestamp: string;
};

export default function WebChat() {
  // const t = useTranslations("Pages.Web.Chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    const text = content.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      user: "me",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <>
      {/* <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head> */}
      <Layout className="flex flex-col gap-4 mx-auto pt-20 w-full max-w-2xl h-screen">

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 bg-gray-50 p-4 overflow-y-auto"
        >
          <MessageList messages={messages} />
        </div>
        <ChatInput onSend={handleSend} />
      </Layout>
    </>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.user === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs break-words px-4 py-2 rounded-lg ${
          isMe
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (content: string) => void }) {
  // const t = useTranslations("Pages.Web.Chat");
  const [text, setText] = useState("");

  const send = () => {
    onSend(text);
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex bg-white border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Digite sua mensagem..."
        className="flex-1 px-4 py-3 focus:outline-none"
      />
      <button
        onClick={send}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-white transition"
      >
        Enviar
      </button>
    </div>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
