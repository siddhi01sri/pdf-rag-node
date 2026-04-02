const ollama = require("ollama").default;
const logger = require("../utils/logger");

const CHAT_MODEL = process.env.CHAT_MODEL || "qwen2.5-coder:1.5b";

const generateAnswer = async (question, contextChunks, chatHistory = []) => {
  try {
    logger.info("Answer generation started", {
      questionLength: question?.length || 0,
      totalContextChunks: contextChunks?.length || 0,
      historyCount: chatHistory?.length || 0,
      model: CHAT_MODEL
    });

    const contextText = contextChunks
      .map((chunk, index) => `Context ${index + 1}:\n${chunk.content}`)
      .join("\n\n");

    const historyText = chatHistory.length
      ? chatHistory
          .map((item, index) => {
            return `Turn ${index + 1} - User: ${item.question}\nTurn ${index + 1} - Assistant: ${item.answer}`;
          })
          .join("\n\n")
      : "No previous conversation history.";

    const prompt = `
You are a helpful AI assistant for question answering over uploaded PDF documents.

Rules:
1. Answer the user's question only from the provided context.
2. Use previous conversation history only to understand follow-up questions.
3. If the answer is not present in the context, say:
"Answer not found in the uploaded PDF."

Previous Conversation:
${historyText}

Context:
${contextText}

Current Question:
${question}
`;

    logger.info("Sending prompt to chat model", {
      model: CHAT_MODEL,
      promptLength: prompt.length,
      totalContextChunks: contextChunks?.length || 0,
      historyCount: chatHistory?.length || 0
    });

    const response = await ollama.chat({
      model: CHAT_MODEL,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const answer = response?.message?.content || "";

    logger.info("Answer generation completed", {
      model: CHAT_MODEL,
      answerLength: answer.length
    });

    return answer;
  } catch (error) {
    logger.error("Answer generation failed", {
      error: error.message,
      questionLength: question?.length || 0,
      totalContextChunks: contextChunks?.length || 0,
      historyCount: chatHistory?.length || 0,
      model: CHAT_MODEL
    });

    throw new Error(`Answer generation failed: ${error.message}`);
  }
};

module.exports = {
  generateAnswer
};