export class NotificationType {
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

export class SocketResponse {
    message: string | null;
    status: number;
}
