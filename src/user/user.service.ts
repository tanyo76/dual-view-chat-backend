import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/validation-schemas/auth.schemas';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findFirst({ where: { email } });
  }

  async createUser(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password } = signUpDto;
    await this.prismaService.user.create({
      data: { firstName, lastName, email, password },
    });
  }
}
