export interface ResponseType<Type> {
  response: Response
  data: Type
}

export async function fetchInstance<Type>(
  url: string,
  options?: RequestInit
): Promise<ResponseType<Type>> {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options?.headers,
    },
  })
  return {
    response,
    data: await response.json(),
  }
}
