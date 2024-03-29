import {
  Chat,
  PrivateChannel,
  PublicChannel,
  joinPrivateChannel,
  PrivateMessage,
  DirectMessage,
  PublicChannelMessage,
  GetPrivateConversations,
  notifications,
  joinPublicChannel,
  AnyMessage,
  PrivateMessageRequest,
  SavePublicChannelMessage,
  PublicMessageRequest,
  SearchQuery,
  AcceptFriendRequest,
  SocketResponse,
  AddFriendRequest,
} from '../entities/chat.entity';

export class CreateChatDto extends Chat {}

export class CreatePrivateChannelDto extends PrivateChannel {}

export class JoinPublicChannelDto extends PublicChannel {}

export class JoinPrivateChannelDto extends joinPrivateChannel {}

export class PrivateMessageDto extends PrivateMessage {}

export class DirectMessageDto extends DirectMessage {}

export class PublicChannelMessageDto extends PublicChannelMessage {}

export class GetPrivateConversationsDto extends GetPrivateConversations {}

export class notificationsDto extends notifications {}

export class joinPublicChannelDto extends joinPublicChannel {}

export class AnyMessageDto extends AnyMessage {}

export class PrivateMessageRequestDto extends PrivateMessageRequest {}

export class SavePublicChannelMessageDto extends SavePublicChannelMessage {}

export class PublicMessageRequestDto extends PublicMessageRequest {}

export class SearchQueryDto extends SearchQuery {}

export class AcceptFriendRequestDto extends AcceptFriendRequest {}

export class SocketResponseDto extends SocketResponse {}

export class AddFriendRequestDto extends AddFriendRequest {}