import { IsString, IsNotEmpty } from 'class-validator';

export class createTokenDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  code_verifier: string;
}
