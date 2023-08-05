import * as validator from 'class-validator';

export class MuteMemberChannelDto {

  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  userId: number;


  @validator.IsOptional()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  timeoutMs: number | null;

  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;

}
