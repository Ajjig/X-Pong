import * as validator from 'class-validator';

export class UnblockFriendDto {
    
    @validator.IsNumber()
    @validator.IsPositive()
    @validator.IsInt()
    unblockedId: number;
    }
