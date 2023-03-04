import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async setProfilePictureByUsername(
    username: string,
    avatarUrl: string,
  ): Promise<HttpException> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { avatarUrl: avatarUrl },
      });
      return new HttpException('Avatar updated', 200);
    } catch (e) {
      return new HttpException(e.meta, 400);
    }
  }

  async setProfileUsernameByusername(
    username: string,
    new_username: string,
  ): Promise<HttpException> {
    try {
      const user = await this.prisma.user.update({
        where: { username: username },
        data: { username: new_username },
      });
      return new HttpException('Username updated', 200);
    } catch (e) {
      return new HttpException(e.meta, 400);
    }
  }
}
