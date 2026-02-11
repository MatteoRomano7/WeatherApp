export type AppErrorCode = 'VALIDATION' | 'CITY_NOT_FOUND' | 'NETWORK' | 'API';

export interface AppError {
  code: AppErrorCode;
  message: string;
}
