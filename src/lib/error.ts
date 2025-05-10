import { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
}

export const isAxiosError = (
  error: unknown
): error is AxiosError<ErrorResponse> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
};
