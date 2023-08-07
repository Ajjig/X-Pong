import * as validator from 'class-validator';

export class AddMemberChannelDto {
  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  new_memberID: number;

  @validator.IsNumber()
  @validator.IsPositive()
  @validator.IsInt()
  channelId: number;
}
