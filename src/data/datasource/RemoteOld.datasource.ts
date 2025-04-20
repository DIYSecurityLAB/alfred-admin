/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  HttpStatusCode,
} from 'axios';
import { z } from 'zod';
import { ResultOld } from '../../utils/ResultOld';

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

export type RemoteDeleteReq<Response extends SerializeSchemas> = {
  url: string;
  model: Response;
};

type RemoteRequestRes<Response extends SerializeSchemas> =
  Promise<z.infer<Response> | null>;

export type HeaderValues =
  | 'Accept'
  | 'Authorization'
  | 'Content-Encoding'
  | 'Content-Length'
  | 'Content-Type'
  | 'User-Agent';

export class RemoteDataSourceOld {
  private api: AxiosInstance;

  constructor(baseURL?: string) {
    this.api = axios.create({
      baseURL: baseURL || import.meta.env.VITE_API_URL,
      headers: {},
    });
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
    try {
      const { data } = await this.api.get<any>(url, {
        params,
        timeout: 1800000,
      });

      const serialized = model.safeParse(data);

      if (!serialized.success) {
        console.error('Serialization error:', serialized.error.errors);
        return null;
      }

      return serialized.data;
    } catch (error) {
      console.error('API GET request error:', error);
      throw error;
    }
  }

  public async post<Response extends SerializeSchemas>({
    model,
    url,
    body,
  }: RemotePostReq<Response>): RemoteRequestRes<Response> {
    try {
      const { data } = await this.api.post<any>(url, body, {
        timeout: 300000,
      });

      const serialized = model.safeParse(data);

      if (!serialized.success) {
        console.error('Serialization error:', serialized.error.errors);
        return null;
      }

      return serialized.data;
    } catch (error) {
      console.error('API POST request error:', error);
      throw error;
    }
  }

  public async patch<Response extends SerializeSchemas>({
    model,
    url,
    body,
  }: RemotePostReq<Response>): RemoteRequestRes<Response> {
    try {
      const { data } = await this.api.patch<any>(url, body, {
        timeout: 300000,
      });

      const serialized = model.safeParse(data);

      if (!serialized.success) {
        console.error('Serialization error:', serialized.error.errors);
        return null;
      }

      return serialized.data;
    } catch (error) {
      console.error('API PATCH request error:', error);
      throw error;
    }
  }

  public async delete<Response extends SerializeSchemas>({
    model,
    url,
  }: RemoteDeleteReq<Response>): RemoteRequestRes<Response> {
    try {
      const { data } = await this.api.delete<any>(url, {
        timeout: 300000,
      });

      const responseData = data || {};

      const serialized = model.safeParse(responseData);

      if (!serialized.success) {
        console.error('Serialization error:', serialized.error.errors);
        return null;
      }

      return serialized.data;
    } catch (error) {
      console.error('API DELETE request error:', error);
      throw error;
    }
  }

  public static checkError(err: AxiosError) {
    switch (err?.response?.status) {
      case HttpStatusCode.Unauthorized:
        return ResultOld.Error({ code: 'UNAUTHORIZED' });
      case HttpStatusCode.NotFound:
        return ResultOld.Error({ code: 'NOT_FOUND' });
      case HttpStatusCode.BadRequest:
        return ResultOld.Error({ code: 'BAD_REQUEST' });
      case HttpStatusCode.Conflict:
        return ResultOld.Error({ code: 'ALREADY_EXISTS' });
      default:
        return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

export const remoteDataSourceOld = new RemoteDataSourceOld();
