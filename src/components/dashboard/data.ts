import type { ChatMessage, Conversation, NavItem } from "./types";

export const leftNavItems: NavItem[] = [
  { id: "messages", label: "Messages", icon: "forum", active: true },
  { id: "calls", label: "Calls", icon: "call" },
  { id: "contacts", label: "Contacts", icon: "person" },
  { id: "favorites", label: "Favorites", icon: "star" },
  { id: "archive", label: "Archive", icon: "archive" },
];

export const conversations: Conversation[] = [
  {
    id: "alice",
    name: "Alice Smith",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJLPF_eBGqUU4FRuTA2c2xoxNoC5OlTwkqOlKxjlfy1dLn52hT_Qj1Xr95yFsJYU_c1g7Dq2NQ1LyI3qZ2nn6uig1Rf_VfQxE_Vsrf-4gSp1WwVS4ttM-MqYwG3JJGVJAnl6H1Gnv41_bVcrUsS-Ho6c8fKsHU_f6LOpZgSqPcZh8PglWacXHZ9RobFrGtjMZZzT8RBibWMax-7sWqbMrfG37gAgN5efypKzhIty1d1ONFrsLk2BwNVy76CQQR7GNqFl7egTxoWfPv",
    preview: "See you at the meeting!",
    time: "10:45 AM",
    active: true,
    online: true,
  },
  {
    id: "design-group",
    name: "Design Group",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc3SC4d1ijqkzj8VhLzE5UGOzKABX4ohUbCNQ4Sey9v9frMeEhOZONBGRZVIu3gIt0Z0Ji-XvF5MudXETlIgbGv4UETtLXEeSf14rRpdcHWfiiCsUnXJCIJmXNHS7Q-5Pk3nE4qBeSuVrJac1uBomtChXXsTk91Ixemm1mkgoJU-Z9gYhsH3saPb2PWncFlENH-_b0iCGGfNXEwLFvls81cv1q71YeKYfK-4lIlGC7ikC7DZKLFh60lRMRgMpS3SaSxou3iGAxElTe",
    preview: "Bob: The new UI looks great!",
    time: "Just now",
    unreadCount: 2,
  },
  {
    id: "john",
    name: "John Doe",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMpGM6jmKcLhyo8mmrtUbju4wjV12nffECyJagEIZzx5R6LeUDUAJplT1eZzhb4Jy98b9UF5tOZ-5sovfV3NXo81cFqU5jnB3ia2fAETANCAdMTGMzaZJxcp-eo_my9AS3lq0ifYhiv3LKpCaJt4-MnS5FE8-GjIonAbw7fZEO__IXUbZfLenoygRK_mIEX7j939c7Fjt_bezN0PHFb6Wx_ks-e4AOj7Z6-HwqykI6gESMVRbx1yWGTHmJ3czMLl_OEWTBh9cbGyBG",
    preview: "Sent a photo",
    time: "Yesterday",
  },
  {
    id: "sarah",
    name: "Sarah Wilson",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACSphT5zAXHLATvj3FslYSmlICk2HO8zVyyvCiDiLpp_oN_6_CYPghIjfzr4y5NaRzkvJZzgRLTtdl5zMWqcxpcw0Q3nBuTnn2CB-zW7mK64Dy079IrH6hjpaL3XRAoGY9sYkZ_FqeB_dw1ozisobzSbPPQimTgpxF0eMFKMz0va1bAgaL19e0cD5N_DVRPawCqw-3_NYzi1kKa6XQmRTTzjb79Fl42TyM9l9-XFE1xmx0rzA-4Ife7kspkzucr08Urx21UQBsZM3x",
    preview: "Let's catch up soon!",
    time: "Monday",
  },
  {
    id: "michael",
    name: "Michael Scott",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVFw2PM2SFQiGkj2NuSCNX6MClYmmba8lAPAHwjh26X1HTubF4NK1s2SIGsCV-o23QZZDGaXLV4jRY4JWtc06dbimP2kzVtbJ5LXm9dMKtB9MowSULbndi7n7ZV9WSgurDfoB7rowQZCokdGBo_tkDcDyVJKNnIJRUUAatHHnVakPpdnsuGSQz2xoD9_tqoEUCcL1QncHWAk9pOJxlwMBOhnHFT3AIzeLrpeYzOgQdYDqSTm43B2OTjf6XkPckPDax-Y583aBL5YCQ",
    preview: "That's what she said!",
    time: "Sunday",
  },
];

export const activeConversation = {
  name: "Alice Smith",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ23GPfi-gSXzR2ZXMffe-ArgQEtk0j_zCSjABAYytIjgphX_0P-077GGd_kr-XN2PjJoP-W9_raEvba23I1cITIzcQ_T4JSuo_R_e0zMo9QkFS7hnWjEoe6SU1Cy77OvovJe7RCBFmx7JCVPVYQca723fvH2zchH-6Yp45xtXV1Gf10is_jAY-tkdjAwJhKjleAtz8oC2MKBxKK66kkHvsLMUGOmB2Iqdmjz4iCJmPnRgL0GdQIYJLf9Hqn92QTRHTA79-jC_FvPv",
  status: "Active Now",
};

export const messages: ChatMessage[] = [
  {
    id: "m1",
    author: "other",
    text: "Hey! Did you have a chance to look at the new UI designs for the dashboard?",
    time: "10:40 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOCUqJoDc26UYmauaj0aKE1-mAJhsig3hlTmPVJdf8Aa0GyNtrWbXnE8rYlDqRLrcVgw-DtwGj4fuYiuzEvFb_THspBdsgmqDa6uMY9WdwvNXTXgZppbCeNsYp493n9ODPiKKly-hOptEknFl17-_-1UlsQslwbSf7nEnhJdKTjxvX6EV6AS6xEwch0LtAagjez96_PVMk0KDM9KiBIKK_CMQCzprlhjO4U6xNi_SsSuuuKPdzcd0yhsTOu6Tf6j-zRFIbqPpWYM1C",
  },
  {
    id: "m2",
    author: "self",
    text: "Yes, I just finished reviewing them. They look incredibly clean! The dark mode transition is seamless.",
    time: "10:42 AM",
  },
  {
    id: "m3",
    author: "other",
    text: "Glad you liked it! See you at the meeting!",
    time: "10:45 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB9FXgFpjQ9OO9uPXU5kTaFbqwvOTur1rhKX74IVqPyUTjA1QF09PmmWG85rhF051Lo8WQzvry1GGZKrP8oi0h4HjkZJbC8TqtNOszMkqtkRfGOg3bO9DjYHQ4iqul2e4606IN0jZoTdriLdrTSCzEQW9yWUfNrQGW620o0iX1KAeKeWCpmj7nzuU_inM7qc_WKSu-HKI0dE7_ixUhdJGPm3bCD_gh_M0WgVLF9ER2tY0O2Eqw0lQMjZpAGrK-cohX7EGETJYVrth1",
  },
  {
    id: "m4",
    author: "self",
    text: "Perfect, I'll be there with the feedback notes.",
    time: "10:46 AM",
  },
];
