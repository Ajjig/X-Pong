export class joinPublicChannel {
    channelID: number;
    password: string | null;
}

export type groupInfoType = {
    name: string | null;
    type: string | null;
    id: number | null;
    membersCount: number | null;
    is_member: boolean | null;
};
