import * as validator from 'class-validator';

export class UpdatePasswordChannelDto {
  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Length(8, 100)
  new_password: string;

  @validator.IsNotEmpty()
  @validator.IsPositive()
  @validator.IsInt()
  @validator.IsNumber()
  channelId: number;
}
