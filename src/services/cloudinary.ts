import variables from '@/variables';
import { v2 as cloudinaryApp } from 'cloudinary';

cloudinaryApp.config({
  secure: true,
  cloud_name: variables.cloud_name,
  api_key: variables.api_key,
  api_secret: variables.api_secret,
});

export { cloudinaryApp };
