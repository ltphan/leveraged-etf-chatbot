import type { APIRoute } from 'astro';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
    });
 
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI API error:', error);
    return new Response('Error processing request', { status: 500 });
  }
};