"use client";

import ChatInterface from "./components/ChatInterface";

export default function Home() {
  const apiKey =
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";

  console.log("env", process.env.ENV_VAR);
  console.log("apiKey", apiKey);

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex flex-col overflow-hidden">
        <p>AQUI: {process.env.ENV_VAR}</p>
        <ChatInterface apiKey={apiKey} />
      </main>
    </div>
  );
}
