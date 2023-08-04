import * as validator from 'class-validator';

export class AddMemberChannelDto {
  @validator.IsNotEmpty()
  @validator.IsNumber()
  new_memberID: number;

  @validator.IsNotEmpty()
  @validator.IsNumber()
  channelID: number;
}
