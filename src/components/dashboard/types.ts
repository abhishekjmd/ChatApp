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

export type SidebarUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  conversationId: string;
  conversationType: "direct" | "group";
  memberCount: number;
  otherUserId?: string;
  lastMessagePreview: string;
  lastMessageTime: number;
  unreadCount: number;
  isOnline: boolean;
};

export type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isCurrentUser: boolean;
  isOnline: boolean;
  conversationId?: string;
};
