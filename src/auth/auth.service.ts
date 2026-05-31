import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({ email, password: hashedPassword, name });
    return this.tokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findByEmailWithPassword(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.tokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const p = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
      const user = await this.usersRepository.findById(p.sub);
      if (!user) throw new Error();
      return {
        access_token: this.jwtService.sign(
          { sub: user.id, email: user.email },
          { expiresIn: '15m' },
        ),
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private tokens(user: { id: string; email: string; name: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
