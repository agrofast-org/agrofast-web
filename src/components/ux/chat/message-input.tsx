import { Textarea, TextAreaProps } from "@heroui/react";
import { useRef } from "react";

export interface MessageInputProps extends TextAreaProps {
  message: string;
  setMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  ref,
  message,
  setMessage,
}) => {
  const reference = useRef<HTMLTextAreaElement>(null);
  return (
    <Textarea
      ref={ref || reference}
      classNames={{
        base: "!relative",
        label: "!top-6 !-translate-y-[3.25em] start-0 text-foreground",
        helperWrapper: "!absolute !-bottom-[20px] !-left-0.5 max-w-full",
        errorMessage: "!truncate",
        input: "!transition-colors !duration-100",
        inputWrapper: "!transition-colors !duration-100 bg-default-100 group-data-[focus=true]:border-default-400",
      }}
      minRows={1}
      maxRows={3}
      labelPlacement="outside"
      variant="bordered"
      name="message"
      autoComplete="off"
      autoCapitalize="sentences"
      autoCorrect="on"
      placeholder="Escreva sua mensagem..."
      value={message}
      onValueChange={setMessage}
      onKeyDown={(e) => {
        const { key, ctrlKey, shiftKey, currentTarget, preventDefault } = e;
        if (key.toLowerCase() === "enter") {
          if (ctrlKey || shiftKey) {
            return;
          }
          currentTarget?.form?.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
          );
          preventDefault();
          setMessage("");
        }
      }}
    />
  );
};
