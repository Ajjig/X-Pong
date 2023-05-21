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
