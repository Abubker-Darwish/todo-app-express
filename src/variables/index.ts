import dotenv from 'dotenv';

dotenv.config();

const variables = {
  port: process.env.PORT ?? '5000',
  secret: process.env.SECRET ?? '',
  env: process.env.NODE_ENV ?? '',
  db_url: process.env.DATABASE_URL ?? '',
  cloud_name: process.env.CLOUDINAY_CLOUD_NAME ?? '',
  api_key: process.env.CLOUDINAY_API_KEY ?? '',
  api_secret: process.env.CLOUDINAY_API_SECRET ?? '',
};

export default variables;
