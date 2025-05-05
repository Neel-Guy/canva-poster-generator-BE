import { Injectable } from '@nestjs/common';
import { CreateCanvaDto } from './dto/create-canva.dto';
import { UpdateCanvaDto } from './dto/update-canva.dto';
import { templatesResponseData } from 'src/auth/types';

@Injectable()
export class CanvaService {
  create(createCanvaDto: CreateCanvaDto) {
    return 'This action adds a new canva';
  }

  getAllTemplates(authorization: string) {
    fetch(`https://api.canva.com/rest/v1/brand-templates`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = (await response.json()) as templatesResponseData;
        // console.log('templates', data);
        return data;
      })
      .catch((err) => console.error(err));
  }

  findAll() {
    return `This action returns all canva`;
  }

  findOne(id: number) {
    return `This action returns a #${id} canva`;
  }

  update(id: number, updateCanvaDto: UpdateCanvaDto) {
    return `This action updates a #${id} canva`;
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
