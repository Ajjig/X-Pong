import * as validator from 'class-validator';

export class CreateChannelPayloadDto {
    
    password: string | null;
    
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['public', 'private', 'protected'])
    type: string;
    
    @validator.IsNotEmpty()
    @validator.IsString()
    name: string;
}