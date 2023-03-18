import {
  Chat,
  PrivateChannel,
  PublicChannel,
  joinPrivateChannel,
  PrivateMessage,
  DirectMessage,
} from '../entities/chat.entity';

export class CreateChatDto extends Chat {}

export class CreatePrivateChannelDto extends PrivateChannel {}

export class CreatePublicChannelDto extends PublicChannel {}

export class JoinPrivateChannelDto extends joinPrivateChannel {}

export class PrivateMessageDto extends PrivateMessage { }

export class DirectMessageDto extends DirectMessage { }