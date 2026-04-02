const ollama = require("ollama").default;

const CHAT_MODEL = process.env.CHAT_MODEL || "qwen2.5-coder:1.5b";

const generateAnswer = async (question, contextChunks) => {
  const contextText = contextChunks
    .map((chunk, index) => `Context ${index + 1}:\n${chunk.content}`)
    .join("\n\n");

  const prompt = `
You are a helpful AI assistant for question answering over uploaded PDF documents.

Answer the user's question only from the provided context.
If the answer is not present in the context, say:
"Answer not found in the uploaded PDF."

Context:
${contextText}

Question:
${question}
`;

  const response = await ollama.chat({
    model: CHAT_MODEL,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.message.content;
};

module.exports = {
  generateAnswer
};