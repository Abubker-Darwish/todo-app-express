import * as jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface IDJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}
