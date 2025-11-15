import { NextRequest } from "next/server";
import { basicAgent } from "./agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return basicAgent(body);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
