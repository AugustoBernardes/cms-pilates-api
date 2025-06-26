import { Response } from "express";

export function ok(res: Response, data, message = 'Success') {
  return res.status(200).json({
    status: 'success',
    message,
    data,
  });
}

export function created(res: Response, data, message = 'Created') {
  return res.status(201).json({
    status: 'success',
    message,
    data,
  });
}

export function badRequest(res: Response, message = 'Bad Request', details = null) {
  return res.status(400).json({
    status: 'fail',
    message,
    details,
  });
}

export function internalError(res: Response, message = 'Internal Server Error') {
  return res.status(500).json({
    status: 'error',
    message,
  });
}