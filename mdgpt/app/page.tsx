"use client";

import ChatInterface from "./components/ChatInterface";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "";

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface apiKey={apiKey} />
      </main>
    </div>
  );
}
