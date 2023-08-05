import { type } from 'os';

export class PrivateChannel {
  user2: string;
}

export class Chat {
  msg: string;
  user: string;
}

export class PublicChannel {
  username: string;
  channelName: string;
}

export class joinPrivateChannel {
  receiver: string;
}

export class PrivateMessage {
  msg: string;
  receiver: string;
}

export class DirectMessage {
  msg: string;
  sender: string;
  receiverID: number;
  PrivateChannelId: string;
}

export class PublicChannelMessage {
  msg: string;
  username: string;
  channelName: string;
}

export class GetPrivateConversations {
  username: string;
}

export class notifications {
  id: number;
  type: string;
  from: string;
  to: string;
  status: string;
  msg: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  avatarUrl: string;
}

export class joinPublicChannel {
  channelID: number;
  password: string | null;
}

export class AnyMessage {
  avatarUrl: string;
  content: string;

  updatedAt: Date;
  createdAt: Date;

  channelName: string | null;
  channelId: number | null;

  privateChannelId: string | null;

  senderUsername: string;
  senderId: number;
  senderName: string;

  receiverId: number | null;
  receiverName: string | null;
  receiverUsername: string | null;
}

export class PrivateMessageRequest {
  receiverID: number;
  content: string;
}

export class SavePublicChannelMessage {
  content: string;
  senderId: number;
  channelId: number;
  senderAvatarUrl: string;
}

export class PublicMessageRequest {
  content: string;
  id: number;
}

export class SearchQuery {
  query: string;
}

export class AcceptFriendRequest {
  id: number;
}

export class SocketResponse {
  message: string | null;
  status: number;
}

export class AddFriendRequest {
  id: number;
}