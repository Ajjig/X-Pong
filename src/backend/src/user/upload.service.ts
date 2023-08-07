import {
  Injectable,
  HttpException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    let filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'upload',
      fileName,
    );

    await fs.writeFile(filePath, await fs.readFile(file.path));
    await fs.unlink(file.path);

    filePath = `upload/${fileName}`;
    return filePath;
  }

  async updateUserAvatar(userId: number, filePath: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: filePath,
      },
    });
  }
}
