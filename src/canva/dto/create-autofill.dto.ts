import { IsString } from 'class-validator';
import { IsFile, MaxFileSize, HasMimeType } from 'nestjs-form-data';

export class CreateAutofillDto {
  @IsString()
  title: string;

  @IsFile()
  // max 2 MB file size
  @MaxFileSize(2 * 1024 * 1024)
  @HasMimeType(['image/png', 'image/jpeg'])
  background: Express.Multer.File;

  @IsString()
  file_title: string;
}
