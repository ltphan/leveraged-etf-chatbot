import { useState, type FormEvent } from "react"
import { v4 as uuidv4 } from "uuid";
import { client } from "../api/chat";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
};

export const useChat = () => {
    const [input, setInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const postChat = async (value: string) => {
        console.log("postChat called with:", value, "at:", Date.now())
        let aiMessage: Message | undefined = undefined
        try {
             const completion = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: value }],
            });

            aiMessage = 
            {
                id: uuidv4(),
                type: "assistant",
                content: completion.choices[0]?.message?.content || "No response",
            };

            return aiMessage
        } catch(e) {
            console.log("ERROR", e);
        } 
    }
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit called at:", Date.now())
        e.preventDefault()
        if (!input.trim()) {
            return
        }

        setIsSubmitting(true)

        const userMessage: Message = {
            id: uuidv4(),
            type: "user",
            content: input
        }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        console.log("user message put in state", messages)
        const currentInput = input
        setInput("")
        // TODO: debounce or throttle

        const aiResult = await postChat(currentInput) 

        setMessages((prevMessages) => {
            const clonedMessages = [...prevMessages] 
            if (aiResult) {
                return [...clonedMessages, aiResult]
            } 
            return clonedMessages
        })

        setIsSubmitting(false)
  
    }

    return {
        input,
        setInput,
        isSubmitting,
        setIsSubmitting,
        messages,
        handleSubmit
    }
}