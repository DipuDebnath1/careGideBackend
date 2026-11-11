import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';

// ── Shape of a single normalised error field ──────────────────────────────────
type TErrorSource = {
  path: string | number;
  message: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSource[] = err.issues.map((issue) => {
    const lastSegment = issue.path[issue.path.length - 1];
    const path: string | number =
      typeof lastSegment === 'symbol' ? String(lastSegment) : (lastSegment ?? '');
    return { path, message: issue.message };
  });

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};

const handleCastError = (err: { path: string; value: unknown }) => ({
  statusCode: 400,
  message: 'Invalid ID',
  errorSources: [{ path: err.path, message: `Invalid value: ${err.value}` }],
});

const handleDuplicateKeyError = (err: { keyValue: Record<string, unknown> }) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    statusCode: 409,
    message: 'Duplicate Entry',
    errorSources: [
      {
        path: field,
        message: `The value for '${field}' already exists.`,
      },
    ],
  };
};

const handleValidationError = (err: { errors: Record<string, { path: string; message: string }> }) => {
  const errorSources: TErrorSource[] = Object.values(err.errors).map((e) => ({
    path: e.path,
    message: e.message,
  }));

  return {
    statusCode: 400,
    message: 'Mongoose Validation Error',
    errorSources,
  };
};

// ── Global Error Handler ──────────────────────────────────────────────────────

const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSource[] = [{ path: '', message }];

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // ── Zod ──────────────────────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const parsed = handleZodError(err);
    statusCode = parsed.statusCode;
    message = parsed.message;
    errorSources = parsed.errorSources;

  // ── Mongoose CastError (invalid ObjectId) ────────────────────────────────
  } else if (isMongooseCastError(err)) {
    const parsed = handleCastError(err);
    statusCode = parsed.statusCode;
    message = parsed.message;
    errorSources = parsed.errorSources;

  // ── MongoDB duplicate key ────────────────────────────────────────────────
  } else if (isDuplicateKeyError(err)) {
    const parsed = handleDuplicateKeyError(err as { keyValue: Record<string, unknown> });
    statusCode = parsed.statusCode;
    message = parsed.message;
    errorSources = parsed.errorSources;

  // ── Mongoose ValidationError ─────────────────────────────────────────────
  } else if (isMongooseValidationError(err)) {
    const parsed = handleValidationError(err as { errors: Record<string, { path: string; message: string }> });
    statusCode = parsed.statusCode;
    message = parsed.message;
    errorSources = parsed.errorSources;

  // ── Our own AppError ─────────────────────────────────────────────────────
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: '', message: err.message }];

  // ── Generic JS Error ─────────────────────────────────────────────────────
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: '', message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources,
    stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : undefined) : undefined,
  });
};

// ── Type-guards (avoid importing mongoose directly) ───────────────────────────

function isMongooseCastError(err: unknown): err is { name: string; path: string; value: unknown } {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { name?: string }).name === 'CastError'
  );
}

function isDuplicateKeyError(err: unknown): err is { code: number; keyValue: Record<string, unknown> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

function isMongooseValidationError(err: unknown): err is { name: string; errors: Record<string, { path: string; message: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { name?: string }).name === 'ValidationError'
  );
}

export default globalErrorHandler;
