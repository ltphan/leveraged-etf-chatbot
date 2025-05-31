import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";

// TODO: save after user stops typing after X amounts of seconds? (debounce)

const Chatbot = () => {
  const cachedContent = localStorage.getItem("content");
  console.log({ cachedContent });

  const { messages, input, handleInputChange, status, handleSubmit } = useChat({
    initialMessages: cachedContent ? JSON.parse(cachedContent) : [],
    api: "/api/chat",
    onError: (error) => {
      console.log("useChat error:", error);
    },
    onFinish: (message) => {
      console.log("Chat finished:", message);
    },
  });

  useEffect(() => {
    return () => {
      // cons of this is if AI responds and user navigatse away from page which will lose information
      // think about using browser api of beforeunload
      localStorage.setItem("content", JSON.stringify(messages));
    };
  }, [messages]);

  const isSubmitting = status !== "ready";

  return (
    <div className="w-full h-svh bg-green-100 p-10">
      <div className="h-full bg-green-200 flex flex-col gap-3.5 overflow">
        {messages.map((message) => (
          <div
            className={`p-2 border ${
              message.role === "assistant"
                ? "border-red-500"
                : "border-purple-500"
            }`}
            key={message.id}
          >
            {message.content as string}
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
            onChange={handleInputChange}
            disabled={isSubmitting}
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
