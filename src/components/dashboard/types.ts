export type NavItem = {
  id: string;
  label: string;
  icon: IconName;
  active?: boolean;
};

export type IconName =
  | "chat"
  | "forum"
  | "call"
  | "person"
  | "star"
  | "archive"
  | "settings"
  | "search"
  | "videocam"
  | "more"
  | "doneAll"
  | "addCircle"
  | "image"
  | "mood"
  | "send";

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  active?: boolean;
  unreadCount?: number;
  online?: boolean;
};

export type ChatMessage = {
  id: string;
  author: "self" | "other";
  text: string;
  time: string;
  avatar?: string;
};
