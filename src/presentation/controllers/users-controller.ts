import { badRequest, ok } from "../helpers/response-helper";
import { Request, Response } from "express";
import { IAuthenticator } from "@/interfaces/authenticator/authenticator";
import { loginSchema } from "../validators/login-schema";

export class UsersController {
  constructor(
    private readonly authenticator: IAuthenticator
  ) {}

  async login(req: Request, res: Response) {
    try {

      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        return badRequest(res, 'Invalid request body', parsed.error);
      }

      const { username, password } = parsed.data;
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {

        const token = await this.authenticator.generateToken({
          payload: { username },
          options: { expiresIn: '1d' }
        });
        return ok(res, { token }, 'User logged in');
      } else {
        return badRequest(res, 'Invalid username or password');
      }
    } catch (error: any) {
      return badRequest(res, error.message, error);
    }
  }
}
