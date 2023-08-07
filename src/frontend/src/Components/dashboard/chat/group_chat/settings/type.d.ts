export class AddMemberChannelDto {
    new_memberID: number;
    channelId: number;
}

export class UpdateChannelDto {
    channelId: number;
    channelName: string;
    channelPassword: string | null;
    channelType: string;
}
