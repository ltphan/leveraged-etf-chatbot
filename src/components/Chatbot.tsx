import { useState, type FormEvent } from "react";
import { throttle } from "../helpers/helpers";
import { useChat } from "../hooks/useChat";
import { v4 as uuidv4 } from "uuid";
import { client } from "../api/chat";

type Message = {
  id: string;
  type: string;
  content: string;
};

const Chatbot = () => {
  // TODO: access localStorage cache value
  // const { input, setInput, isSubmitting, messages, handleSubmit } = useChat();

  // const handleSubmitThrottle = throttle(handleSubmit, 3000);

  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const postChat = async (value: string) => {
    console.log("postChat called with:", value, "at:", Date.now());
    let aiMessage: Message | undefined = undefined;
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: value }],
      });

      aiMessage = {
        id: uuidv4(),
        type: "assistant",
        content: completion.choices[0]?.message?.content || "No response",
      };

      return aiMessage;
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit called at:", Date.now());
    e.preventDefault();
    if (!input.trim()) {
      return;
    }

    setIsSubmitting(true);

    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    console.log("user message put in state", messages);
    const currentInput = input;
    setInput("");
    // TODO: debounce or throttle

    const aiResult = await postChat(currentInput);

    setMessages((prevMessages) => {
      const clonedMessages = [...prevMessages];
      if (aiResult) {
        return [...clonedMessages, aiResult];
      }
      return clonedMessages;
    });

    setIsSubmitting(false);
  };
  return (
    <div className="w-full h-svh bg-green-100 p-10">
      <div className="h-full bg-green-200 flex flex-col gap-3.5 overflow">
        {messages.map((message) => (
          <div className="p-2 border border-purple-500" key={message.id}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex flex-col m-3.5 gap-3.5 mx-2 md:mx-0">
        <form onSubmit={handleSubmit}>
          <textarea
            name="postContent"
            className="h-28 p-2 resize-none focus:outline-none w-full"
            maxLength={200000}
            placeholder="How can I help?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex justify-between items-center p-2">
            <div>+</div>
            <div className="bg-red-100 rounded">
              <button
                className={`m-2 transition-colors ${
                  isSubmitting
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-black hover:text-red-800"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
