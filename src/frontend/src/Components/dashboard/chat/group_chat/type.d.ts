export class publicMessageRequest {
    id: number;
    content: string;
}

export class SetUserAsAdminDto {
    newAdminId: number;
    channelId: number;
}

export class RemoveAdminDto {
    channelId: number;
    userId: number;
}

export class KickMemberChannelDto {
    kickedId: number;
    channelId: number;
}

export class MuteMemberChannelDto {
    userId: number;
    timeoutMs: number | null;
    channelId: number;
}

export class BanMemberChannelDto {
    BannedId: number;
    channelId: number;
}

export class LeaveChannelDto {
    channelId: number;
}
