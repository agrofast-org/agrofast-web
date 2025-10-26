import { User } from "./user";

export interface Chat {
  id: number;
  uuid: string;
  name?: null;
  picture?: null;
  active: boolean;
  created_at: string;
  updated_at: string;
  inactivated_at?: null;
  users?: User[] | null;
  messages?: Message[] | null;
}

export interface Message {
  id: number;
  uuid: string;
  user_id: number;
  chat_id: number;
  message: string;
  answer_to?: Omit<Message, "answer_to">;
  active: boolean;
  created_at: string;
  updated_at: string;
  inactivated_at?: null;
}

export interface StackedMessage {
  message: string;
  answer_to?: string;
}

export interface ChatWithLastMessage extends Chat {
  last_message?: Message | null;
}
