import * as validator from 'class-validator';

export class UpdateUserProfileDto {
  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Length(3, 30)
  name: string;

  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Length(3, 20)
  username: string;

  avatarUrl: string | null;
}
