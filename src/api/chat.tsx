import OpenAI from "openai";

export const client = new OpenAI({
  baseURL: "https://api.liona.ai/v1/provider/openai",
  apiKey: "user-key-hkjhrazoiaabekgcjmbjzuyyhzup",
  dangerouslyAllowBrowser: true,
  maxRetries: 0,
});
