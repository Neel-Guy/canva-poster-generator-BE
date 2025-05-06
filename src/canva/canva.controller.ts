import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CanvaService } from './canva.service';
import { CreateCanvaDto } from './dto/create-canva.dto';
import { UpdateCanvaDto } from './dto/update-canva.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAutofillDto } from './dto/create-autofill.dto';

@Controller('canva')
export class CanvaController {
  constructor(private readonly canvaService: CanvaService) {}

  @Post()
  create(@Body() createCanvaDto: CreateCanvaDto) {
    return this.canvaService.create(createCanvaDto);
  }

  @Get('/templates')
  getAllTemplates(@Headers('Authorization') authorization: string) {
    return this.canvaService.getAllTemplates(authorization);
  }

  @Get('/templates/:id')
  findTemplateKeys(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    return this.canvaService.findTemplateKeys(id, authorization);
  }

  @Post('/templates/:id/autofill')
  @UseInterceptors(FileInterceptor('background'))
  autofill(
    @Param('id') id: string,
    @Body() createCanvaDto: CreateAutofillDto,
    @UploadedFile() background: Express.Multer.File,
    @Headers('Authorization') authorization: string,
  ) {
    createCanvaDto.background = background;
    return this.canvaService.autofill(id, createCanvaDto, authorization);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCanvaDto: UpdateCanvaDto) {
    return this.canvaService.update(+id, updateCanvaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.canvaService.remove(+id);
  }
}
