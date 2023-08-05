import * as validator from 'class-validator';
import e from 'express';

export class FriendDto {
  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Length(3, 25)
  @validator.Matches(/^[a-zA-Z0-9]+$/)
  @validator.IsLowercase()
  friend_username: string;
}

export class BlockFriendDto {
  @validator.IsNotEmpty()
  @validator.IsNumber()
  friendID: number;
}