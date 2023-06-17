import * as validator from 'class-validator';

export class CreateChannelDto {
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  type?: string;
  password?: string | null;
  salt?: string | null;
  owner: string;
  members?: [];
  admins?: [];
  invited?: [];
  banned?: [];
  kicked?: [];
  muted?: [];
  messages?: [];
}
