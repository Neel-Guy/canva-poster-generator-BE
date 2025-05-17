import { Injectable } from '@nestjs/common';
import { CreateCanvaDto } from './dto/create-canva.dto';
import { UpdateCanvaDto } from './dto/update-canva.dto';
import { templatesResponseData } from 'src/auth/types';
import { CreateAutofillDto } from './dto/create-autofill.dto';
import { createReadStream, statSync, unlink } from 'fs';
import fetch from 'node-fetch';
import { AutoFillJobResponseTypes, fileUploadTypes } from './types';
import { pollWithExponentialBackoff } from './canva.utils';

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

    const fileUpload = async (): Promise<fileUploadTypes> => {
      try {
        const response = await fetch(
          'https://api.canva.com/rest/v1/asset-uploads',
          {
            method: 'POST',
            headers: {
              'Asset-Upload-Metadata': JSON.stringify({
                name_base64: Buffer.from(
                  background.originalname + '-' + Date.now(),
                ).toString('base64'),
              }),
              Authorization: authorization,
              'Content-Length': statSync(background.path).size.toString(),
              'Content-Type': 'application/octet-stream',
            },
            body: createReadStream(background.path),
          },
        );

        const data = await response.json();
        unlink(background.path, (err) => {
          if (err) console.error('Failed to delete uploaded file:', err);
        });

        return data as fileUploadTypes;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const assetJob = async (jobId: string): Promise<fileUploadTypes> => {
      try {
        const response = await fetch(
          `https://api.canva.com/rest/v1/asset-uploads/${jobId}`,
          {
            method: 'GET',
            headers: {
              Authorization: authorization,
            },
          },
        );

        const data = await response.json();
        console.log('calling job', data);
        return data as fileUploadTypes;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const autoFillTemplate = async (asset_id: string): Promise<any> => {
      try {
        const response = await fetch(
          'https://api.canva.com/rest/v1/autofills',
          {
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
                  asset_id,
                },
              },
            }),
          },
        );

        console.log('autofill response', response);

        return (await response.json()) as AutoFillJobResponseTypes;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const fileUploadData = await fileUpload();

    const jobResult = await pollWithExponentialBackoff<fileUploadTypes>(
      () => assetJob(fileUploadData?.job?.id),
      (status) => status?.job?.status === 'success',
      1000,
      6,
      30000,
    );

    if (!jobResult || jobResult.job.status !== 'success') {
      throw new Error('Canva job did not complete successfully');
    }

    return await autoFillTemplate(jobResult.job.asset?.id as string);
  }

  update(id: number, updateCanvaDto: UpdateCanvaDto) {
    return `This action updates a #${id} canva`;
  }

  remove(id: number) {
    return `This action removes a #${id} canva`;
  }
}
