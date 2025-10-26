import { Input } from "@heroui/react";

export interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
}) => (
  <Input
    classNames={{
      base: "!relative",
      label: "!top-6 !-translate-y-[3.25em] start-0 text-foreground",
      helperWrapper: "!absolute !-bottom-[20px] !-left-0.5 max-w-full",
      errorMessage: "!truncate",
      input: "!transition-colors !duration-100",
      inputWrapper: "!transition-colors !duration-100 bg-default-100",
    }}
    labelPlacement="outside"
    variant="bordered"
    name="message"
    autoComplete="off"
    placeholder="Escreva sua mensagem..."
    value={message}
    onValueChange={setMessage}
  />
);
