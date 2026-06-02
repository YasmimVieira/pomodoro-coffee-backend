import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { SessionsService } from './sessions.service';

class CreateSessionDto {
  @IsNumber() focusMinutes!: number;
  @IsNumber() cycles!: number;
  @IsNumber() completedAt!: number;
}

class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
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
  list(@Request() req, @Query() query: PaginationQueryDto) {
    return this.service.findByUser(req.user.userId, query.page);
  }

  @Get('stats')
  stats(@Request() req) {
    return this.service.getStats(req.user.userId);
  }
}
