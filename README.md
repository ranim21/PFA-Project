# Translation Extension AI

- Interactive Sidebar: Open a chat by clicking the extension icon, ask questions or seek summaries from any webpage effortlessly.

- Content Selection Dialog: Highlight text, and a dialog box will pop up to allow direct interaction with the content.

- Vision chat: Easily ask questions about the visual information on the page (images, graphs, etc.) by using the extension to take a screenshot or select an area of the page.



### Demo
<a https://www.youtube.com/watch?v=vf8YJbv5oCk&t=1s" alt="Demo Video"></a>



## Local Setup

- `npm install`
- `npm run build:dev` (Hot reloading with `npm run dev` will not work due to WASM dependencies needed for in-memory models via `transformers.js`)
- Load the extension from `dist` folder using `Load unpacked` option in Chrome extensions ([instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked))

## Tech/Frameworks

- Chrome extension - [CRXJS](https://crxjs.dev/vite-plugin/)
- AI/LLM - [LangChain](https://github.com/langchain-ai/langchainjs), [transformers.js](https://huggingface.co/docs/transformers.js/index)
- UI - [Mantine](https://mantine.dev/)
