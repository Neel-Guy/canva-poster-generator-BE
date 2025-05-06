import { Injectable } from '@nestjs/common';
import { CreateCanvaDto } from './dto/create-canva.dto';
import { UpdateCanvaDto } from './dto/update-canva.dto';
import { templatesResponseData } from 'src/auth/types';
import { CreateAutofillDto } from './dto/create-autofill.dto';
import { Buffer } from 'buffer';
import { createReadStream, statSync } from 'fs';
import fetch from 'node-fetch';
import { fileUploadTypes } from './types';

@Injectable()
export class CanvaService {
  create(createCanvaDto: CreateCanvaDto) {
    return 'This action adds a new canva';
  }

  async getAllTemplates(authorization: string) {
    const data = await fetch(`https://api.canva.com/rest/v1/brand-templates`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });
    return (await data.json()) as templatesResponseData;
  }

  findAll() {
    return `This action returns all canva`;
  }

  async findTemplateKeys(id: string, authorization: string) {
    const data = await fetch(
      `https://api.canva.com/rest/v1/brand-templates/${id}/dataset`,
      {
        method: 'GET',
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
      },
    );
    return (await data.json()) as templatesResponseData;
  }

  async autofill(
    id: string,
    createCanvaDto: CreateAutofillDto,
    authorization: string,
  ) {
    const { title, background, file_title } = createCanvaDto;

    let fileUploadData = {
      job: {
        id: '',
        status: '',
      },
    };

    const fileUpload = await fetch(
      'https://api.canva.com/rest/v1/asset-uploads',
      {
        method: 'POST',
        headers: {
          'Asset-Upload-Metadata': JSON.stringify({
            name_base64: btoa(background.originalname + '-' + Date.now()),
          }),
          Authorization: authorization,
          'Content-Length': statSync(background.path).size.toString(),
          'Content-Type': 'application/octet-stream',
        },
        body: createReadStream(background.path),
      },
    )
      .then(async (response) => {
        const data = await response.json();
        fileUploadData = data as fileUploadTypes;
      })
      .catch((err) => console.error(err));

    // call the api after every 10 seconds till the job is completed
    const interval = setInterval(() => {
      fetch(
        `https://api.canva.com/rest/v1/asset-uploads/${fileUploadData.job.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: authorization,
          },
        },
      )
        .then(async (response) => {
          const data = await response.json();
          const res = data as fileUploadTypes;
          if (res?.job?.status === 'success') {
            console.log('success', res);
            clearInterval(interval);
          }
          console.log('assetData', data);
        })
        .catch((err) => console.error(err));
    }, 10 * 1000);

    const request = await fetch('https://api.canva.com/rest/v1/autofills', {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand_template_id: id,
        title: file_title,
        data: {
          title: { type: 'text', text: title },
          background: {
            type: 'image',
            // asset_id: fileUploadData?.job?.id,
            asset_id: '1289d1aa-ca82-45ea-8139-c6b0e27261d9',
          },
        },
      }),
    });
    // need to upload the file in canva to get asset id
    const data = await request.json();
    console.log('response', data);
    return data;
  }

  update(id: number, updateCanvaDto: UpdateCanvaDto) {
    return `This action updates a #${id} canva`;
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
