import * as validator from 'class-validator';

export class SetUserAsAdminDto {
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    newAdminId: number;

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    channelId: number;
    }