import { randomUUID } from 'crypto';

export const sendMessage = (message: string) => {
  return {
    id: randomUUID(),
    message,
  };
};

export const sendAssistantResponse = (assistantMessage: string) => {
  return {
    id: randomUUID(),
    message: `Assistant: ${assistantMessage}`,
  };
};
