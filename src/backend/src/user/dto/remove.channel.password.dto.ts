import * as validator from 'class-validator';

export class RemoveChannelPasswordDto {
  @validator.IsNotEmpty()
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
