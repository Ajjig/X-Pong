import * as validator from 'class-validator';

export class CreateChannelPayloadDto {

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(8, 100)
    password: string;
    
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['public', 'private', 'protected'])
    type: string;
    
    @validator.IsNotEmpty()
    @validator.IsString()
    name: string;
}