import Authenticator from "../../infra/authentication/authenticator";
import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../helpers/response-helper";

const authenticator = new Authenticator();

export async function automationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    unauthorized(res, 'Authorization header is missing');
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    unauthorized(res, 'Token is missing');
    return;
  }

  try {
    const { is_valid, decoded } = await authenticator.verifyToken(token);

    if (!is_valid || decoded.type !== 'automation') {
      unauthorized(res, 'Invalid token');
      return;
    }

    next();
  } catch (error: any) {
    unauthorized(res, error.message);
  }
}
