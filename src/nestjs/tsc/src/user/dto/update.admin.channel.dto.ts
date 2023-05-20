import * as validator from 'class-validator';

export class UpdateAdminChannelDto {
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 25)
    @validator.Matches(/^[a-zA-Z0-9]+$/)
    @validator.IsLowercase()

    new_admin: string;

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 25)
    @validator.Matches(/^[a-zA-Z0-9]+$/)
    @validator.IsLowercase()

    channel_name: string;
    
}