import { Message } from "@/components/message";
import { Section } from "@/components/section";
import { useAuth } from "@/contexts/auth-provider";
import { Chat, Message as MessageType, StackedMessage } from "@/types/chat";
import { User } from "@/types/user";
import { useMemo } from "react";

export interface MessagesRendererProps {
  users?: User[];
  chat: Chat;
  messagesStash: StackedMessage[];
  sentMessagesStack: MessageType[];
  answerMessage?: (message: MessageType) => void;
  errorSending: boolean;
  sendMessage?: () => void;
}

export const MessagesRenderer: React.FC<MessagesRendererProps> = ({
  users,
  chat,
  messagesStash,
  sentMessagesStack,
  answerMessage,
  errorSending,
  sendMessage,
}) => {
  const { user } = useAuth();
  const getStackedMessage = (index: number) => {
    return (messagesStash[index] as MessageType) || undefined;
  };

  const finalMessages = useMemo(
    () =>
      [
        ...[
          ...(Array.isArray(sentMessagesStack) ? sentMessagesStack : []),
          ...(chat?.messages ?? []),
        ],
      ].reverse(),
    [chat?.messages, sentMessagesStack]
  );

  return (
    <Section className="flex-col flex-1 justify-end gap-0 mx-auto p-2 px-2 pb-0 max-w-[912px] container">
      {finalMessages.map((message, index, arr) => (
        <Message
          key={message.uuid}
          chatUsers={users || []}
          messageBefore={arr[index - 1]}
          message={message}
          messageAfter={arr[index + 1]}
          isLast={messagesStash.length === 0}
          owner={message.user_id === user?.id}
          answerMessage={answerMessage}
        />
      ))}
      {[...(messagesStash ?? [])].reverse().map((_, index, arr) => (
        <Message
          key={`stash-${index}`}
          chatUsers={users || []}
          bubbleClassName="opacity-75 !pb-2"
          messageBefore={getStackedMessage(index - 1)}
          message={getStackedMessage(index)}
          messageAfter={getStackedMessage(index + 1)}
          owner={true}
          isLast={index === arr.length - 1}
          hideLoading={index === arr.length - 1}
          errorSending={errorSending}
          retrySending={sendMessage}
          isLoading
        />
      ))}
    </Section>
  );
};
