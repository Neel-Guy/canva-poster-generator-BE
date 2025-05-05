// https://www.canva.dev/docs/connect/autofill-guide/
const design_title = 'My Design';
const jobId = 'feaa03d8-e42c-4f89-acb0-d4e32434ab62';

require('dotenv').config();
const template_id = process.env.BRAND_TEMPLATE_ID;
const getTemplateData = async () => {
  fetch(
    `https://api.canva.com/rest/v1/brand-templates/${template_id}/dataset`,
    //   `https://api.canva.com/rest/v1/brand-templates`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  )
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
    })
    .catch((err) => console.error(err));
};

const createTemplate = () => {
  fetch('https://api.canva.com/rest/v1/autofills', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brand_template_id: process.env.BRAND_TEMPLATE_ID,
      title: design_title,
      data: {
        username: { type: 'text', text: 'Roman Dimitri' },
        temperature: { type: 'text', text: '20 deg C' },
      },
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
    })
    .catch((err) => console.error(err));
};

const getJobStatus = () => {
  fetch(`https://api.canva.com/rest/v1/autofills/${jobId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      console.log('design', data.job.result.design);
    })
    .catch((err) => console.error(err));
};

getJobStatus();
