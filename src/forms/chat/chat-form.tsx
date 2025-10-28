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
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [answerMessage, setAnswerMessageState] = useState<
    MessageType | undefined
  >(undefined);

  const setAnswerMessage = (message: MessageType | undefined) => {
    setAnswerMessageState(message);
    document.querySelector<HTMLInputElement>("#message-form input[name='message']")?.focus();
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

  const receiver = chat?.users?.find((u) => u.id !== user?.id) || user;

  const sendMessage = (retry: boolean = false) => {
    if (isSending) return;
    const text = message.trim();
    if (!retry && text === "") return;

    setErrorSending(false);

    if (!retry) {
      setMessage("");
      setMessagesStack((prev) => [
        ...prev,
        { message: text, answer_to: answerMessage?.uuid },
      ]);
      setAnswerMessage(undefined);
      debouncedMessage({ message: text, answer_to: answerMessage?.uuid });
      return;
    }

    if (messagesStack.length === 0) return;
    sendMessages(messagesStack);
  };

  const [isNotAtBottom, setIsNotAtBottom] = useState<boolean>(false);

  return (
    <div
      ref={chatWrapperRef}
      onScroll={() => {
        if (chatWrapperRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            chatWrapperRef.current;
          const threshold = 5; // tolerance for fractional pixels / rounding
          const isAtBottom =
            Math.abs(scrollHeight - (scrollTop + clientHeight)) <= threshold ||
            scrollTop <= threshold;
          // if at bottom -> not "not at bottom"
          setIsNotAtBottom(!isAtBottom);
        }
      }}
      className="relative flex flex-col-reverse px-02 border-divider border-x w-full max-w-xl h-full overflow-y-auto"
    >
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
      <Section className="bottom-0 z-10 sticky flex-row gap-2 bg-default-100 mx-auto p-2 px-2 !pt-0 max-w-[912px] container">
        <Form
          id="message-form"
          className="gap-0 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          {answerMessage && (
            <div className="relative mb-1 w-full">
              <div className="bg-default-200 p-2 pr-10 border-4 border-default-300 rounded-xl max-h-16 overflow-y-auto">
                <p className="text-tiny">
                  <strong>
                    {answerMessage?.user_id === user?.id
                      ? "Você"
                      : receiver?.name.split(" ")[0]}
                  </strong>
                  : {answerMessage.message}
                </p>
              </div>
              <Button
                className="top-0 right-0 absolute bg-transparent m-1 text-default-600"
                onPress={() => setAnswerMessage(undefined)}
                size="sm"
                isIconOnly
              >
                <CloseCircle weight="BoldDuotone" />
              </Button>
            </div>
          )}
          <div className="flex gap-2 w-full">
            <MessageInput message={message} setMessage={setMessage} />
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
      <MessagesRenderer
        users={chat?.users || []}
        chat={chat!}
        messagesStash={messagesStack}
        sentMessagesStack={sentMessagesStack}
        errorSending={errorSending}
        sendMessage={() => sendMessage(true)}
        answerMessage={setAnswerMessage}
      />
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
    </div>
  );
};
