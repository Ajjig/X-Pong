import * as validator from 'class-validator';

export class LeaveChannelDto {
  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
