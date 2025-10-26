import { Message } from "@/components/message";
import { Section } from "@/components/section";
import { Chat, Message as MessageType, StackedMessage } from "@/types/chat";
import { User } from "@/types/user";

export interface MessagesRendererProps {
  user: User;
  chat: Chat;
  messagesStash: StackedMessage[];
  sentMessagesStash: MessageType[];
  errorSending: boolean;
  sendMessage?: () => void;
}

export const MessagesRenderer: React.FC<MessagesRendererProps> = ({
  user,
  chat,
  messagesStash,
  sentMessagesStash,
  errorSending,
  sendMessage,
}) => {
  const getStackedMessage = (index: number) => {
    return (messagesStash[index] as MessageType) || undefined;
  };

  const finalMessages = [...(chat?.messages ?? []), ...sentMessagesStash];

  return (
    <Section className="flex-1 justify-end gap-0 mx-auto p-2 px-2 pb-0 max-w-[912px] container">
      {finalMessages?.map((message, index) => (
        <Message
          key={message.uuid}
          messageBefore={finalMessages[index - 1]}
          message={message}
          messageAfter={finalMessages[index + 1]}
          isLast={messagesStash.length === 0}
          owner={message.user_id === user?.id}
        />
      ))}
      {messagesStash.map((msg, index) => (
        <Message
          key={`stash-${index}`}
          bubbleClassName="opacity-75 !pb-2"
          messageBefore={getStackedMessage(index - 1)}
          message={getStackedMessage(index)}
          messageAfter={getStackedMessage(index + 1)}
          owner={true}
          isLast={index === messagesStash.length - 1}
          hideLoading={index === messagesStash.length - 1}
          errorSending={errorSending}
          retrySending={sendMessage}
          isLoading
        />
      ))}
    </Section>
  );
};
