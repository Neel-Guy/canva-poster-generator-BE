import { randomBytes, createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { createTokenDto } from './dto/create-token.dto';
import { config } from 'dotenv';
import { tokenResponseData } from './types';
config();

@Injectable()
export class AuthService {
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  generateCode() {
    const codeVerifier = randomBytes(96).toString('base64url');
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const CODE_GENERATOR_URL = `https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=OC-AZaLUwfwu9ix&scope=design:content:read%20design:meta:read%20design:content:write%20folder:read%20asset:read%20asset:write%20brandtemplate:meta:read%20brandtemplate:content:read%20profile:read&code_challenge=${codeChallenge}`;

    return {
      code_verifier: codeVerifier,
      code_challenge: codeChallenge,
      redirect_url: CODE_GENERATOR_URL,
    };
  }

  generateToken(createTokenDto: createTokenDto) {
    const { code_verifier, code } = createTokenDto;

    const credentials = Buffer.from(
      `${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_SECRET_KEY}`,
    ).toString('base64');
    fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(
        `grant_type=authorization_code&code_verifier=${code_verifier}&code=${code}&client_id=${process.env.CANVA_CLIENT_ID}&client_secret=${process.env.CANVA_SECRET_KEY}`,
      ),
    })
      .then(async (response) => {
        const data = (await response.json()) as tokenResponseData;
        console.log('data', data);
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
      })
      .catch((err) => console.error('errpr', err));
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
