import { useAuth } from "@/contexts/auth-provider";
import { Message as MessageType } from "@/types/chat";
import { User } from "@/types/user";
import { Button, cn, Spinner, Tooltip } from "@heroui/react";
import { DangerCircle, Reply } from "@solar-icons/react";

export interface MessageProps {
  className?: string;
  bubbleClassName?: string;

  chatUsers: User[];
  messageBefore?: MessageType;
  message: MessageType;
  messageAfter?: MessageType;
  owner: boolean;

  isLast?: boolean;
  hideLoading?: boolean;
  isLoading?: boolean;

  errorSending?: boolean;
  retrySending?: () => void;

  answerMessage?: (message: MessageType) => void;
}

export const Message: React.FC<MessageProps> = ({
  className,
  bubbleClassName,
  chatUsers,
  messageBefore,
  message,
  messageAfter,
  owner,
  isLast,
  hideLoading,
  isLoading,
  errorSending = false,
  retrySending,
  answerMessage,
}) => {
  const { user } = useAuth();
  const answer = () => {
    if (!isLoading) {
      answerMessage?.(message);
    }
  };

  return (
    <div
      className={cn(
        "group target:-z-0 flex justify-end target:bg-default-300/25 rounded-sm target:ring-2 target:ring-default-300/25 w-full",
        owner ? "" : "flex-row-reverse",
        messageAfter?.user_id === message.user_id || isLast
          ? "mb-0.5"
          : "mb-2",
        className
      )}
      id={message.uuid}
      onDoubleClick={answer}
    >
      <div className="flex items-center p-1">
        {!isLoading && (
          <Button
            tabIndex={-1}
            className="bg-transparent opacity-0 group-hover:opacity-100 text-default-600 !duration-75"
            size="sm"
            isIconOnly
            onPress={answer}
          >
            <Reply weight="LineDuotone" />
          </Button>
        )}
        {isLast && errorSending && (
          <Tooltip
            content="Erro ao enviar. Tente novamente"
            delay={500}
            closeDelay={0}
            classNames={{
              content: "max-w-40 text-center",
            }}
            showArrow
          >
            <span
              onClick={retrySending}
              className="text-red-600 cursor-pointer"
            >
              <DangerCircle weight="Bold" />
            </span>
          </Tooltip>
        )}
      </div>
      <div
        className={cn(
          "relative rounded-2xl min-w-0 max-w-[80%] font-medium text-sm break-words whitespace-pre-wrap",
          owner
            ? "bg-primary-500 text-default-100 dark:text-default-900"
            : "bg-default-200 text-default-900",
          messageBefore?.user_id === message.user_id &&
            (owner ? "rounded-tr-none" : "rounded-tl-none"),
          messageAfter?.user_id === message.user_id &&
            (owner ? "rounded-br-none" : "rounded-bl-none"),
          isLoading && "!rounded-2xl",
          bubbleClassName
        )}
      >
        {message?.answer_to?.message && (
          <a
            href={`#${message?.answer_to.uuid}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "after:top-0 after:left-0 after:absolute relative flex flex-col m-2 mb-0 p-2 pl-3 rounded-xl after:w-1.5 after:h-full overflow-hidden text-xs cursor-pointer",
              owner
                ? "bg-primary-600/70 after:bg-primary-300"
                : "bg-default-300/70 after:bg-default-400"
            )}
          >
            <span className="font-bold">
              {message?.answer_to?.user_id === user?.id
                ? "Você"
                : chatUsers
                    .find((u) => u.id === message?.answer_to?.user_id)
                    ?.name.split(" ")[0] || "Unknown User"}
            </span>{" "}
            {message?.answer_to.message}
          </a>
        )}
        <p
          className={cn(
            "px-4 py-2 pb-0",
            message?.answer_to?.message && "pt-1"
          )}
        >
          {message.message}
        </p>
        <span
          className={cn(
            owner ? "text-right" : "text-left",
            "block opacity-70 px-4 max-h-3 text-[10px] -translate-y-[6px] select-none"
          )}
        >
          {message.created_at &&
            new Date(message.created_at).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </span>
      </div>
      {isLoading && !errorSending && (
        <div className="flex justify-center p-2 w-9">
          {hideLoading && <Spinner size="sm" />}
        </div>
      )}
    </div>
  );
};
