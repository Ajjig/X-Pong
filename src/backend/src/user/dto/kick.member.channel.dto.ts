import * as validator from 'class-validator';

export class KickMemberChannelDto {
  
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  kickedId: number;

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
