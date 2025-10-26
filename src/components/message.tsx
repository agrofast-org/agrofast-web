import { Message as MessageType } from "@/types/chat";
import { cn, Spinner, Tooltip } from "@heroui/react";
import { DangerCircle } from "@solar-icons/react";

export interface MessageProps {
  className?: string;
  bubbleClassName?: string;

  messageBefore?: MessageType;
  message: MessageType;
  messageAfter?: MessageType;
  owner: boolean;

  isLast?: boolean;
  hideLoading?: boolean;
  isLoading?: boolean;

  errorSending?: boolean;
  retrySending?: () => void;
}

export const Message: React.FC<MessageProps> = ({
  className,
  bubbleClassName,
  messageBefore,
  message,
  messageAfter,
  owner,
  isLast,
  hideLoading,
  isLoading,
  errorSending = false,
  retrySending,
}) => {
  return (
    <div
      className={cn(
        "flex w-full",
        owner ? "justify-end" : "justify-start",
        messageAfter?.user_id === message.user_id || !isLast
          ? "mb-0.5"
          : "mb-2",
        className
      )}
    >
      <div className="flex items-center p-1">
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
          "relative rounded-2xl min-w-12 max-w-[80%] font-medium text-sm break-words whitespace-pre-wrap",
          owner
            ? "bg-primary-500 text-default-100 dark:text-default-900 text-end"
            : "bg-default-200 text-default-900 text-start",
          messageBefore?.user_id === message.user_id &&
            (owner ? "rounded-tr-none" : "rounded-tl-none"),
          messageAfter?.user_id === message.user_id &&
            (owner ? "rounded-br-none" : "rounded-bl-none"),
          isLoading && "!rounded-2xl",
          bubbleClassName
        )}
      >
        <p className="px-4 py-2 pb-0">{message.message}</p>
        <span
          className={cn(
            "block opacity-70 text-[10px] max-h-3 -translate-y-[6px] px-4 select-none"
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
