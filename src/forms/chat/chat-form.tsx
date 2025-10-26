import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { useRouter } from "next/router";
import { Chat, Message as MessageType, StackedMessage } from "@/types/chat";
import { Section } from "@/components/section";
import { useUser } from "@/contexts/auth-provider";
import { Avatar } from "@/components/avatar";
import { useRef, useState } from "react";
import { Button, cn, Form } from "@heroui/react";
import { ArrowDown, ArrowLeft, Plain2 } from "@solar-icons/react";
import { MessageInput } from "@/components/ux/chat/message-input";
import { useDebounce } from "@/hooks/use-debounce";
import { MessagesRenderer } from "./messages-renderer";
import Link from "@/components/link";

export const ChatForm: React.FC = () => {
  const router = useRouter();
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const [message, setMessage] = useState<string>("");

  const [messagesStash, setMessagesStash] = useState<StackedMessage[]>([]);
  const [sentMessagesStash, setSentMessagesStash] = useState<MessageType[]>([]);

  const [errorSending, setErrorSending] = useState<boolean>(false);

  const { data: chat, refetch: refetchChat } = useQuery<Chat>({
    queryKey: ["chat", router.query.uuid],
    queryFn: async () =>
      api.get(`/chat/${router.query.uuid}`).then(({ data }) => {
        setSentMessagesStash([]);
        return data;
      }),
    enabled: !!router.query.uuid,
    refetchInterval: 2500,
  });

  const { mutate: sendMessages, isPending: isSending } = useMutation({
    mutationFn: async (messages: StackedMessage[]) =>
      api.post(`/chat/message`, { chat_uuid: router.query.uuid, messages }),
    onSuccess: ({ data }) => {
      setSentMessagesStash(data);
      setMessagesStash([]);
      setErrorSending(false);
      refetchChat();
    },
    onError: () => {
      setErrorSending(true);
    },
  });

  const [debouncedMessage] = useDebounce((message: StackedMessage) => {
    sendMessages([...messagesStash, message]);
  }, 2500);

  const receiver = chat?.users?.find((u) => u.id !== user?.id);

  const sendMessage = (retry: boolean = false) => {
    if (isSending) return;
    const text = message.trim();
    if (!retry && text === "") return;

    setErrorSending(false);

    if (!retry) {
      setMessage("");
      setMessagesStash((prev) => [...prev, { message: text }]);
      debouncedMessage({ message: text });
      return;
    }

    if (messagesStash.length === 0) return;
    sendMessages(messagesStash);
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
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <MessageInput message={message} setMessage={setMessage} />
        </Form>
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
      </Section>
      <MessagesRenderer
        user={user!}
        chat={chat!}
        messagesStash={messagesStash}
        sentMessagesStash={sentMessagesStash}
        errorSending={errorSending}
        sendMessage={() => sendMessage(true)}
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
