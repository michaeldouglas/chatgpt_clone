"use client";

import { useCallback, useMemo } from "react";
import { type Message } from "@langchain/langgraph-sdk";
import {
  useStream,
  FetchStreamTransport,
} from "@langchain/langgraph-sdk/react";
import { AIMessage, ToolCall, ToolMessage } from "@langchain/core/messages";

import { WelcomeScreen } from "./Welcome";
import { ToolCallBubble, type ToolCallState } from "./ToolCall";
import { ErrorBubble } from "./ErrorBubble";
import { ChatInput } from "./ChatInput";
import {
  isAIMessage,
  isToolMessage,
  isHumanMessage,
  extractTextContent,
} from "../utils";

interface ChatInterfaceProps {
  apiKey: string;
}

export default function ChatInterface({ apiKey }: ChatInterfaceProps) {
  const transport = useMemo(() => {
    const apiKeyValue = apiKey;
    return new FetchStreamTransport({
      apiUrl: "/api/basic",
      onRequest: async (url: string, init: RequestInit) => {
        const customBody = JSON.stringify({
          ...(JSON.parse(init.body as string) || {}),
          apiKey: apiKeyValue,
        });

        return {
          ...init,
          body: customBody,
        };
      },
    });
  }, [apiKey]);

  const stream = useStream({
    transport,
  });

  const toolCallsByMessage = useMemo(() => {
    const map = new Map<Message, ToolCallState[]>();

    stream.messages.forEach((message) => {
      if (!isAIMessage(message)) {
        return;
      }

      const aiMessage = message as AIMessage;

      let toolCalls: ToolCall[] = [];

      if (aiMessage.tool_calls && Array.isArray(aiMessage.tool_calls)) {
        toolCalls = aiMessage.tool_calls as ToolCall[];
      }

      const toolMessages: ToolMessage[] = [];
      for (const msg of stream.messages) {
        if (isToolMessage(msg)) {
          const toolMessage = msg as ToolMessage;
          const toolCallId = toolMessage.tool_call_id;

          if (toolCallId && toolCalls.some((tc) => tc.id === toolCallId)) {
            toolMessages.push(msg as ToolMessage);
          }
        }
      }

      if (toolCalls.length > 0) {
        const toolCallStates: ToolCallState[] = [];
        for (const toolCall of toolCalls) {
          const toolMessage = toolMessages.find((tm) => {
            return tm.tool_call_id === toolCall.id;
          });

          toolCallStates.push({
            toolCall,
            toolMessage,
          });
        }
        map.set(message, toolCallStates);
      }
    });

    return map;
  }, [stream.messages]);

  const handleSend = useCallback(
    (messageOverride?: string) => {
      const messageToSend = messageOverride || "";

      if (!messageToSend.trim() || stream.isLoading) {
        return;
      }

      if (!apiKey.trim()) {
        return;
      }

      stream.submit({
        messages: [{ content: messageToSend, type: "human" }],
      });
    },
    [apiKey, stream]
  );

  const handleInputSubmit = useCallback(
    (message: string) => {
      handleSend(message);
    },
    [handleSend]
  );

  const isLoading = stream.isLoading;
  const errorMessage =
    stream.error instanceof Error
      ? stream.error.message
      : typeof stream.error === "string"
      ? stream.error
      : undefined;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-8">dsa</div>

      <ChatInput onSubmit={handleInputSubmit} isLoading={isLoading} />
    </div>
  );
}
