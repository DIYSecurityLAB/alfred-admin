/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCsrfToken } from '@/utils/Csrf';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  HttpStatusCode,
} from 'axios';
import { z } from 'zod';
import { Result } from '../../utils/Result';

export type SerializeSchemas =
  | z.ZodObject<any>
  | z.ZodArray<any>
  | z.ZodDiscriminatedUnion<string, any>;

export type RemoteGetReq<Response extends SerializeSchemas> = {
  url: string;
  model: Response;
  params?: any;
};

export type RemotePostReq<Response extends SerializeSchemas> = {
  url: string;
  model: Response;
  body?: any;
};

type RemoteRequestRes<Response extends SerializeSchemas> = Promise<
  Response['_type'] | null
>;

export type HeaderValues =
  | 'Accept'
  | 'Authorization'
  | 'Content-Encoding'
  | 'Content-Length'
  | 'Content-Type'
  | 'User-Agent';

export const getRetryConfig = () => ({
  retries: Number(import.meta.env.VITE_HTTP_RETRY_COUNT) || 3,
  baseDelay: Number(import.meta.env.VITE_HTTP_RETRY_BASE_DELAY) || 300,
});

export const timeout: number =
  Number(import.meta.env.VITE_HTTP_TIMEOUT) || 300000;

async function retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
  const { retries, baseDelay } = getRetryConfig();
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      console.warn(`[Retry Attempt ${attempt}] Error on request:`, err);
      if (attempt >= retries) throw err;
      const delay = baseDelay * 2 ** attempt;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error(`[Retry Failed] Max retries reached for request`);

  throw new Error('Unreachable');
}

export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private circuitOpen = false;
  private nextAttempt = 0;

  private failureThreshold: number;
  private timeWindow: number;
  private cooldownPeriod: number;

  constructor() {
    this.failureThreshold =
      Number(import.meta.env.VITE_CB_FAILURE_THRESHOLD) || 3;
    this.timeWindow = Number(import.meta.env.VITE_CB_TIME_WINDOW_MS) || 10000;
    this.cooldownPeriod = Number(import.meta.env.VITE_CB_COOLDOWN_MS) || 15000;
  }

  public async exec<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.circuitOpen) {
      if (now < this.nextAttempt) {
        throw new Error('Circuit breaker is open. Skipping request.');
      }
      console.warn(
        '[Circuit Breaker] Half-open state: allowing a test request.',
      );
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  private recordFailure() {
    const now = Date.now();

    if (now - this.lastFailureTime > this.timeWindow) {
      this.failureCount = 1;
    } else {
      this.failureCount++;
    }

    this.lastFailureTime = now;

    if (this.failureCount >= this.failureThreshold) {
      this.circuitOpen = true;
      this.nextAttempt = now + this.cooldownPeriod;
      console.error(
        '[Circuit Breaker] Opened circuit due to repeated failures.',
      );
    }
  }

  private reset() {
    if (this.circuitOpen) {
      console.info('[Circuit Breaker] Closing circuit after successful test.');
    }
    this.failureCount = 0;
    this.circuitOpen = false;
    this.nextAttempt = 0;
  }
}

export class RemoteDataSource {
  private api: AxiosInstance;
  private circuitBreaker = new CircuitBreaker();

  constructor(baseURL?: string) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY, // TODO: Use HeaderValues
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        config.headers['X-CSRF-Token'] = getCsrfToken();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  public setBaseURL(baseURL: string): void {
    this.api.defaults.baseURL = baseURL;
  }

  public setHeaders(type: HeaderValues, headers: AxiosRequestHeaders): void {
    this.api.defaults.headers.common[type] = headers;
  }

  setToken(token: string) {
    this.api.defaults.headers.authorization = `Bearer ${token}`;
  }

  public async get<Response extends SerializeSchemas>({
    model,
    url,
    params,
  }: RemoteGetReq<Response>): RemoteRequestRes<Response> {
    const { data } = await this.circuitBreaker.exec(() =>
      retryWithBackoff(() =>
        this.api.get<Response>(url, {
          params,
          timeout: timeout,
        }),
      ),
    );

    const serialized = model.safeParse(data);

    if (!serialized.success) {
      console.warn(`[Validation Error] ${url}`, serialized.error?.errors);
      return null;
    }

    return serialized.data;
  }

  public async post<Response extends SerializeSchemas>({
    model,
    url,
    body,
  }: RemotePostReq<Response>): RemoteRequestRes<Response> {
    const { data } = await this.circuitBreaker.exec(() =>
      retryWithBackoff(() =>
        this.api.post<Response>(url, body, {
          timeout: timeout,
        }),
      ),
    );

    const serialized = model.safeParse(data);

    console.log(serialized.error?.errors);

    if (!serialized.success) {
      console.warn(`[Validation Error] ${url}`, serialized.error?.errors);
      return null;
    }

    return serialized.data;
  }

  public async patch<Response extends SerializeSchemas>({
    model,
    url,
    body,
  }: RemotePostReq<Response>): RemoteRequestRes<Response> {
    const { data } = await this.circuitBreaker.exec(() =>
      retryWithBackoff(() =>
        this.api.patch<Response>(url, body, {
          timeout: timeout,
        }),
      ),
    );

    const serialized = model.safeParse(data);

    console.log(serialized.error?.errors);

    if (!serialized.success) {
      console.warn(`[Validation Error] ${url}`, serialized.error?.errors);
      return null;
    }

    return serialized.data;
  }

  public static checkError(err: AxiosError) {
    switch (err?.response?.status) {
      case HttpStatusCode.Unauthorized:
        return Result.Error({ code: 'UNAUTHORIZED' });
      case HttpStatusCode.NotFound:
        return Result.Error({ code: 'NOT_FOUND' });
      case HttpStatusCode.BadRequest:
        return Result.Error({ code: 'BAD_REQUEST' });
      case HttpStatusCode.Conflict:
        return Result.Error({ code: 'ALREADY_EXISTS' });
      default:
        return Result.Error({ code: 'UNKNOWN' });
    }
  }
}
