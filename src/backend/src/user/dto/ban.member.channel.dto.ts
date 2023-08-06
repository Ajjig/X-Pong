import * as validator from 'class-validator';

export class BanMemberChannelDto {
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  BannedId: number;

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
