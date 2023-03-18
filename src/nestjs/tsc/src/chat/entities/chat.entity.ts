export class PrivateChannel {
  user1: string;
  user2: string;
  id: string;
}

export class Chat {
  msg: string;
  user: string;
}

export class PublicChannel {
  name: string;
  id: string;
}

export class joinPrivateChannel {
  user: string;
  channelId: string;
}

export class PrivateMessage {
  msg: string;
  user: string;
  channelId: string;
}

export class DirectMessage {
  msg: string;
  sender: string;
  receiver: string;
  PrivateChannelId : string;
}