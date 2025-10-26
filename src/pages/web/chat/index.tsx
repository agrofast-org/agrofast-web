import { Avatar } from "@/components/avatar";
import Body from "@/components/body";
import { Input } from "@/components/input/input";
import { useUser } from "@/contexts/auth-provider";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { api } from "@/service/api";
import { ChatWithLastMessage } from "@/types/chat";
import { Magnifer } from "@solar-icons/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const { user } = useUser();

  const { data: chats } = useQuery<ChatWithLastMessage[]>({
    queryKey: ["user-chats"],
    queryFn: async () => api.get("/chat").then(({ data }) => data),
  });

  return (
    <>
      <Head>
        <title>TerraMov - Chat</title>
        <meta name="description" content="Chat page" />
      </Head>
      <Body className="flex flex-col items-center !pb-0 h-[calc(100vh-calc(65px+73px))]">
        <div className="relative flex flex-col px-0 border-divider border-x w-full max-w-xl h-full overflow-y-auto">
          <div className="px-4 py-2 border-divider border-b">
            <Input
              startContent={
                <Magnifer
                  weight="LineDuotone"
                  className="scale-80 -translate-x-0.5"
                />
              }
              placeholder="Pesquise por conversas"
            />
          </div>
          {chats?.map((chat) => {
            const receiver = chat?.users?.find((u) => u.id !== user?.id);
            return (
              <div
                key={chat.uuid}
                onClick={() => {
                  router.push(`/web/chat/${chat.uuid}`);
                }}
                className="flex gap-4 px-4 py-2 border-divider border-b cursor-pointer hover:bg-default-200/40 transition-colors"
              >
                <Avatar src={receiver?.profile_picture} />
                <div className="relative flex-1">
                  <h2 className="font-bold">
                    {receiver?.name || "Unknown User"}
                  </h2>
                  <p className="bottom-0 absolute max-w-xs text-default-600 text-xs truncate">
                    {chat.last_message && <span className="font-medium">{chat.last_message?.user_id === user?.id ? "Você: " : <>{receiver?.name}: </>}</span>}
                    {chat.last_message
                      ? `"${chat.last_message.message}"`
                      : "No messages yet."}
                  </p>
                  <span className="top-0 right-0 absolute opacity-70 text-[10px] select-none">
                    {chat?.last_message?.created_at &&
                      new Date(
                        chat?.last_message.created_at
                      ).toLocaleTimeString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
