export interface APIOptions {
  method?: string;
}

export async function request(url: string, options: APIOptions = {}) {
  if (!Object.keys(options).length) {
    options.method = 'GET';
  }

  const defaultErrorMessage = 'Something went wrong, please try again later.';

  try {
    const response: any = await fetch(url, options);
    const isError = response.status < 200 || response.status > 299;
    const body = await response.json();

    return {
      statusCode: response.status,
      data: isError ? null : body,
      error: isError ? body.message || defaultErrorMessage : null,
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: null,
      error: error.message || defaultErrorMessage,
    };
  }
}
