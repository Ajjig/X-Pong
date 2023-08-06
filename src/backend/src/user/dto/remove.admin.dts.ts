import * as validator from 'class-validator';

export class RemoveAdminDto {
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    channelId: number;
    
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    userId: number;
    }