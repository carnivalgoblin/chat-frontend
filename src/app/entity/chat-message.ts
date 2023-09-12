import {MessageType} from "../enumeration/message-type";

export interface ChatMessage {

  user: string;

  content: string;

  type: MessageType;

  date: Date;
}
