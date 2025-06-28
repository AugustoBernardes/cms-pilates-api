import { SignOptions } from "jsonwebtoken";

export interface IAuthenticator {
  generateToken({payload, options}: {payload:any, options?: SignOptions}): Promise<string>;
}