import { useState, type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: string;
  type: string;
  content: FormDataEntryValue | null;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const messageContent = formData.get("postContent");
    const messageType = "user";
    const messageId = uuidv4();
    const userMessage: Message = {
      id: messageId,
      type: messageType,
      content: messageContent,
    };
    setMessages((prevMessages) => {
      return [...prevMessages, userMessage].filter(
        (message) => message.content !== null
      );
    });

    e.currentTarget.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="w-full h-svh bg-green-100 p-10">
      <div className="h-full bg-green-200 flex flex-col gap-3.5 overflow">
        {messages.map((message) => (
          <div className="p-2 border border-purple-500" key={message.id}>
            {message.content as string}
          </div>
        ))}
      </div>
      <div className="flex flex-col m-3.5 gap-3.5 mx-2 md:mx-0">
        <form method="post" onSubmit={handleSubmit}>
          <textarea
            name="postContent"
            className="h-28 p-2 resize-none focus:outline-none w-full"
            maxLength={200000}
            placeholder="How can I help?"
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
