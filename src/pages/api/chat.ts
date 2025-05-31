import type { APIRoute } from 'astro';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openaiProvider = createOpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});


export const POST: APIRoute = async ({ request }) => {
  try {
    
    const { messages } = await request.json();
    

    const result = streamText({
      model: openaiProvider('gpt-4o-mini'),
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};