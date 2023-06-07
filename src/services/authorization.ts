import variables from '@/variables';
import { compare, genSaltSync, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const comparePassword = (password: string, hashedPassword: string) => {
  return new Promise<boolean>((res) => {
    compare(password, hashedPassword, (err, same) => {
      if (err) res(false);
      else res(same);
    });
  });
};

export const createAccessToken = (data: Record<string, unknown>) => {
  return new Promise<string | undefined>((res, rej) => {
    jwt.sign(
      data,
      variables.secret || 'secret',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) rej(err);
        res(token as string);
      }
    );
  });
};

export const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  return new Promise<string>((res) => {
    hash(password, salt, (_err, saltedPassword: string) => {
      res(saltedPassword);
    });
  });
};
