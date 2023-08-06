import * as validator from 'class-validator';

export class MuteMemberChannelDto {

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  userId: number;

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  timeoutMs: number;

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;

}
