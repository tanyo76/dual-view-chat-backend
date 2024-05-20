import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto, SignUpDto } from './validation-schemas/auth.schemas';
import { comparePasswordHash, hashPassword } from '../utils/bcrypt.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordCorrect = await comparePasswordHash(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwtPayload = { id: user.id, email };
    const accessToken = await this.signAccessToken(jwtPayload);

    const { firstName, lastName, id } = user;

    return { id, firstName, lastName, email, accessToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password } = signUpDto;

    const userExists = await this.userService.getUserByEmail(email);

    if (userExists) {
      throw new BadRequestException('User with that email already exists');
    }

    const hashedPw = await hashPassword(password);

    await this.userService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPw,
    });

    return { msg: 'User successfully signed up' };
  }

  async signAccessToken(jwtPayload: { id: string; email: string }) {
    const jwtAccessTokenSecret = this.configService.get(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: jwtAccessTokenSecret,
      expiresIn: '24h',
    });

    return accessToken;
  }
}
