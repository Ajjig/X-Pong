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
  receiver: string;
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