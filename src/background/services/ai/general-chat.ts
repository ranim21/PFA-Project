import { BaseLanguageModel } from "langchain/base_language";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { BaseMessage } from "langchain/schema";
import axios from 'axios-typescript';
const SYSTEM_PROMPT =
  "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.";

const chatPromptTemplate = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);
// we insert text -> text -> rest api -> output: text (translated)...
// General: insert text -> storing in memory -> model already chosen -> 

// randomness related to temperature: (Openai) 0 -> 1. translate Bonjour -> Good Morning.  0.7, write me a story about fruits -> encourages choices of lower probability and eliminate boundaries
// return in strict format: Json {...}
// you can control token limit, you can use optimizers, 2-bit, 4-bit, 3-bit, generate probabilities, 16 bits, time, memory, RoE -> 
// 1 token ~4 charcters; T5-small/medium, BERT: Generate a maximum of 1024 tokens ~ 4096 word -> x10

// fine-tuning; to take a general model and adapt it to one specific task; general model is called opus -> specific model is opus-fr-en
// how to fine-tune?
// 1-Prepare the data:
// Data = {'':'',
// '', '',
//}
// peft -> 5-10 lines of code, freeze the model layers, and execute fine-tuning on the last layer
// callback can potentially store messages
// in UI it's using set messages to comply with ChatMessage class
// Is there a listener between tsx and ts? 
// Key functions: executeGeneralChat, handleLLMNewToken, base-tds
// 50%50%: create custom llm based on the restapi to do the work. and integrate it as an llm to the chain
// check how custom classes are being created in JS for LLMS.

export async function executeGeneralChat(
  model: BaseLanguageModel,
  prompt: string,
  chatHistory: BaseMessage[],
  abortController: AbortController,
  onNewToken: (token: string) => void
): Promise<void> {
  // call rest api
  try {
    // Make the API request
    const response = await axios.post(
      "127.0.0.1:8000/translate",
      { text: prompt}// Adjust parameters as per API requirements
    );

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Access translated text from the response
      const translatedText = response.data.translated_text; // Adjust to match response structure
      return translatedText;
    } else {
      throw new Error(`Failed to translate text: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error translating text:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
  // receive translate text
  // chatgpt, how to make a rest api call, and receive text
  
  const chain = new ConversationChain({
    llm: model,
    prompt: chatPromptTemplate,
    memory: new BufferMemory({
      chatHistory: new ChatMessageHistory(chatHistory),
      returnMessages: true,
    }),
  });

  await chain.call(
    {
      input: prompt,
      signal: abortController.signal,
    },
    {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            if (token) {
              onNewToken(token);
            }
          },
        },
      ],
    }
  );
}
