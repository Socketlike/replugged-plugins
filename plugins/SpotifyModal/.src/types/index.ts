export * from './events';
export * from './stores';

export interface HTTPResponse<T = Record<string, unknown>> {
  body: T;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  text: string;
}
