import * as validator from 'class-validator';

export class UpdateChannelDto {
    
    @validator.IsPositive()
    @validator.IsInt()
    channelId : number;

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 20)
    channelName: string;
    channelPassword: string | null;

    @validator.IsIn(['public', 'private', 'protected'])
    @validator.IsNotEmpty()
    channelType: string;
    }