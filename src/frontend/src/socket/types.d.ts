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
    friendId : number;
}

export class SocketResponse {
    message: string | null;
    status: number;
}

export class AchievementDto {
    name: string;
    description: string;
    iconUrl: string;
}
