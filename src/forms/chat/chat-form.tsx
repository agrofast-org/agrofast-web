import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { useRouter } from "next/router";
import { Chat, Message as MessageType, StackedMessage } from "@/types/chat";
import { Section } from "@/components/section";
import { useAuth } from "@/contexts/auth-provider";
import { Avatar } from "@/components/avatar";
import { useRef, useState } from "react";
import { Button, cn, Form } from "@heroui/react";
import { ArrowDown, ArrowLeft, CloseCircle, Plain2 } from "@solar-icons/react";
import { MessageInput } from "@/components/ux/chat/message-input";
import { useDebounce } from "@/hooks/use-debounce";
import { MessagesRenderer } from "./messages-renderer";
import Link from "@/components/link";

export const ChatForm: React.FC = () => {
  const router = useRouter();
  const messageTextArea = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [answerMessageRef, setAnswerMessageState] = useState<
    MessageType | undefined
  >(undefined);

  const [answerMessageHolder, setAnswerMessageHolder] = useState<
    MessageType | undefined
  >(undefined);

  const setAnswerMessage = (message: MessageType | undefined) => {
    setAnswerMessageState(message);
    if (message) {
      setAnswerMessageHolder(message);
    }
    messageTextArea.current?.focus();
  };

  const [messagesStack, setMessagesStack] = useState<StackedMessage[]>([]);
  const [sentMessagesStack, setSentMessagesStack] = useState<MessageType[]>([]);

  const [errorSending, setErrorSending] = useState<boolean>(false);

  const { data: chat, refetch: refetchChat } = useQuery<Chat>({
    queryKey: ["chat", router.query.uuid],
    queryFn: async () =>
      api.get(`/chat/${router.query.uuid}`).then(({ data }) => {
        setSentMessagesStack([]);
        return data;
      }),
    enabled: !!router.query.uuid,
    refetchInterval: 2500,
  });

  const { mutate: sendMessages, isPending: isSending } = useMutation({
    mutationFn: async (messages: StackedMessage[]) =>
      api.post(`/chat/message`, {
        chat_uuid: router.query.uuid,
        messages,
      }),
    onSuccess: ({ data }) => {
      setMessagesStack([]);
      setSentMessagesStack(data);
      setErrorSending(false);
      refetchChat();
    },
    onError: () => {
      setErrorSending(true);
    },
  });

  const [debouncedMessage] = useDebounce((message: StackedMessage) => {
    sendMessages([...messagesStack, message]);
  }, 2500);

  const receiver = chat?.users?.find((u) => u.id !== user?.id);

  const sendMessage = (retry: boolean = false) => {
    if (isSending) return;
    const text = message.trim();
    if (!retry && text === "") return;

    setErrorSending(false);

    if (!retry) {
      setMessage("");
      setMessagesStack((prev) => [
        ...prev,
        { message: text, answer_to: answerMessageRef?.uuid },
      ]);
      setAnswerMessage(undefined);
      debouncedMessage({ message: text, answer_to: answerMessageRef?.uuid });
      return;
    }

    if (messagesStack.length === 0) return;
    sendMessages(messagesStack);
  };

  const [isNotAtBottom] = useState<boolean>(false);

  return (
    <>
      <Button
        className={cn(
          "bottom-14 left-1/2 z-20 fixed scale-75 -translate-x-1/2 transform",
          isNotAtBottom ? "" : "opacity-0 pointer-events-none"
        )}
        radius="full"
        size="sm"
        isIconOnly
      >
        <ArrowDown weight="LineDuotone" />
      </Button>
      <Section className="top-0 z-10 sticky flex-row justify-start gap-2 bg-default-100 mx-auto p-2 px-4 border-divider border-b w-full max-w-[912px] min-h-[58px] container">
        <Link
          href="/web/chat"
          className="flex items-center gap-2 text-default-900"
        >
          <ArrowLeft className="scale-80" />
        </Link>
        <Avatar src={receiver?.profile_picture} />
        {receiver?.name}
      </Section>
      <MessagesRenderer
        users={chat?.users || []}
        chat={chat!}
        messagesStash={messagesStack}
        sentMessagesStack={sentMessagesStack}
        errorSending={errorSending}
        sendMessage={() => sendMessage(true)}
        answerMessage={setAnswerMessage}
      />
      <Section
        className={cn(
          "bottom-0 z-10 sticky flex-row gap-2 bg-default-100/20 backdrop-blur-sm mx-auto p-2 px-2 !pt-1 max-w-[912px] container"
        )}
      >
        <Form
          id="message-form"
          className={cn(
            "gap-0 w-full interpolate justify-end flex flex-col overflow-hidden h-12 duration-200",
            answerMessageRef ? "h-auto" : ""
          )}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          {answerMessageHolder && (
            <div className="relative flex gap-3 mb-2 w-full">
              <div className="flex-1 bg-default-100 p-2 pr-10 border-2 border-default-200 hover:border-default-400 rounded-xl max-h-16 overflow-y-auto transition-colors motion-reduce:transition-none duration-100">
                <p className="text-tiny">
                  <strong>
                    {answerMessageHolder?.user_id === user?.id
                      ? "Você"
                      : receiver?.name.split(" ")[0]}
                  </strong>
                  : {answerMessageHolder.message}
                </p>
              </div>
              <Button
                className="bg-default-200 m-0.5 mr-1 text-default-600"
                onPress={() => setAnswerMessage(undefined)}
                size="sm"
                isIconOnly
              >
                <CloseCircle weight="BoldDuotone" />
              </Button>
            </div>
          )}
          <div className="flex items-end gap-2 w-full">
            <MessageInput
              ref={messageTextArea}
              message={message}
              setMessage={setMessage}
            />
            <Button
              color="primary"
              className="text-white"
              size="md"
              isDisabled={message?.trim() === ""}
              type="submit"
              onPress={() => sendMessage()}
              isIconOnly
            >
              <Plain2 weight="LineDuotone" />
            </Button>
          </div>
        </Form>
      </Section>
    </>
  );
};
