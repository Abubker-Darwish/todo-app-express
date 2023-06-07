import dotenv from 'dotenv';

dotenv.config();

const variables = {
  port: process.env.PORT || '5000',
  secret: process.env.SECRET || '',
  env: process.env.NODE_ENV || '',
  db_url: process.env.DATABASE_URL || '',
};

export default variables;
