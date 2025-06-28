import { IAuthenticator, VerifyToken } from '@/interfaces/authenticator/authenticator';
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

  public async verifyToken(token: string): Promise<VerifyToken> {
    const secret = process.env.JWT_SECRET as string
    if (!secret) throw new Error('JWT_SECRET not configured in environment variables');

    try {
      const decoded = jwt.decode(token)
      const is_valid = jwt.verify(token, secret);
      return {
        is_valid: Boolean(is_valid),
        decoded
      }
    } catch (error) { 
      throw new Error('Invalid token');
    }
  }
}

export default Authenticator;