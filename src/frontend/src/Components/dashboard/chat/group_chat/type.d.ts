export class publicMessageRequest {
    id: number;
    content: string;
}

export class SetUserAsAdminDto {
    newAdminId: number;
    channelId: number;
}
