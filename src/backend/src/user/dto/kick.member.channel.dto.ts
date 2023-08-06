import * as validator from 'class-validator';

export class KickMemberChannelDto {
  
  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  kickedId: number;

  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
