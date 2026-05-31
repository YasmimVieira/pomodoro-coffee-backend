import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNumber } from 'class-validator';
import { SessionsService } from './sessions.service';

class CreateSessionDto {
  @IsNumber() focusMinutes!: number;
  @IsNumber() cycles!: number;
  @IsNumber() completedAt!: number;
}

@Controller('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private service: SessionsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateSessionDto) {
    return this.service.create(req.user.userId, dto.focusMinutes, dto.cycles, dto.completedAt);
  }

  @Get()
  list(@Request() req) {
    return this.service.findByUser(req.user.userId);
  }

  @Get('stats')
  stats(@Request() req) {
    return this.service.getStats(req.user.userId);
  }
}
