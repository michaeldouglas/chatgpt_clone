import { z } from "zod";
import { createAgent, tool, type BaseMessage } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const customers = {
  "1234567890": {
    name: "Maria Silva",
    email: "maria.silva@mdgpt.com.br",
    phone: "+55 11 91234-5678",
  },
  "1234567891": {
    name: "João Pereira",
    email: "joao.pereira@mdgpt.com.br",
    phone: "+55 21 99876-5432",
  },
  "1234567892": {
    name: "Ana Souza",
    email: "ana.souza@mdgpt.com.br",
    phone: "+55 31 98765-4321",
  },
};

export async function basicAgent(options: {
  input: Record<string, unknown>;
  apiKey: string;
  config: LangGraphRunnableConfig;
}) {
  const model = new ChatOpenAI({
    model: "gpt-4.1-mini",
    apiKey: options.apiKey,
    temperature: 0,
  });

  const getCustomerInformationTool = tool(
    async (input: { customerId: string }) => {
      return customers[input.customerId as keyof typeof customers];
    },
    {
      name: "obter_informacoes_de_usuarios",
      description: "Você deve obter informações dos usuários",
      schema: z.object({
        customerId: z.string(),
      }),
    }
  );

  const agent = createAgent({
    model,
    tools: [getCustomerInformationTool],
    checkpointer,
    systemPrompt:
      "Você é um agente que ajuda pessoas com dúvidas sobre os usuários da plataforma.",
  });

  const stream = await agent.stream(
    options.input as {
      messages: BaseMessage[];
    },
    {
      encoding: "text/event-stream",
      streamMode: ["values", "updates", "messages"],
      configurable: options.config.configurable,
      recursionLimit: 10,
    }
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
