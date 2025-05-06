import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { createTokenDto } from './dto/create-token.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('/code-generator')
  codeGenerator() {
    return this.authService.generateCode();
  }

  @Get('/token-generator')
  @UseInterceptors(NoFilesInterceptor())
  tokenGenerator(@Body() createTokenDto: createTokenDto) {
    return this.authService.generateToken(createTokenDto);
  }

  @Get('/refresh-tokens')
  refreshTokens(@Headers('refresh_token') refresh_token: string) {
    return this.authService.refreshTokens(refresh_token);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
