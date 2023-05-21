import * as validator from 'class-validator';

export class KickMemberChannelDto {
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 25)
    @validator.Matches(/^[a-zA-Z0-9]+$/)
    @validator.IsLowercase()
    new_kicked: string;

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 25)
    @validator.Matches(/^[a-zA-Z0-9]+$/)
    @validator.IsLowercase()
    channel_name: string;
}