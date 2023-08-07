import * as validator from 'class-validator';

export class UpdateChannelDto {
    
    @validator.IsPositive()
    @validator.IsInt()
    channelId : number;

    channelName: string | null;
    channelPassword: string | null;

    @validator.IsIn(['public', 'private', 'protected'])
    @validator.IsNotEmpty()
    channelType: string;
    }