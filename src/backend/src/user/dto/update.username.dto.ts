import * as validator from 'class-validator';

export class UpdateUsernameDto {
  @validator.IsNotEmpty()
  @validator.IsString()
  @validator.Length(3, 25)
  @validator.Matches(/^[a-zA-Z0-9]+$/)
  @validator.IsLowercase()
  @validator.IsNotIn(
    [
      'admin',
      'administrator',
      'mod',
      'moderator',
      'profile',
      'set_confirmed',
      'set_password',
      'set_username',
      'set_email',
      'set_avatar',
      'set_2fa',
      'set_origine',
      'set_ladder',
      'set_achievements',
      'set_wins',
      'set_losses',
      'set_online_status',
      'set_blocked_usernames',
      'set_oauth_id',
      'set_oauth_provider',
      'set_oauth_access_token',
      'upload',
      'avatar',
      'id',
      'username',
      'email',
      'name',
      'avatarUrl',
      'channels',
      'Matchs',
      'Friends',
      'Userstats',
    ],
    { message: 'This username is not allowed.' },
  )
  new_username: string;
}
