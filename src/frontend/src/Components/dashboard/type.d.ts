export class TypeMessage {
    avatarUrl: string;
    content: string;

    updatedAt: Date;
    createdAt: Date;

    channelName: string | null;
    channelId: number | null;

    senderUsername: string;
    senderId: number;
    senderName: string;

    receiverId: number | null;
    receiverName: string | null;
    receiverUsername: string | null;
    privateChannelId : string | null;
    user?: {
        username: string;
        avatarUrl: string;
    };
}
