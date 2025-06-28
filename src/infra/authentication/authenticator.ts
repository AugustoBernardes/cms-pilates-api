import { IAuthenticator } from '@/interfaces/authenticator/authenticator';
import jwt, { SignOptions } from 'jsonwebtoken';

export class Authenticator implements IAuthenticator {

  public async generateToken({
    payload,
    options
  }: { payload: any; options?: SignOptions }): Promise<string> {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET not configured in environment variables');

    return jwt.sign(payload, secret, options)
  }
}

export default Authenticator;