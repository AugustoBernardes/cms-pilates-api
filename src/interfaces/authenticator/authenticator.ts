import { SignOptions } from "jsonwebtoken";


export interface VerifyToken {
    is_valid: boolean,
    decoded: any
}
export interface IAuthenticator {
  generateToken({payload, options}: {payload:any, options?: SignOptions}): Promise<string>;
  verifyToken(token: string): Promise<VerifyToken>;
}