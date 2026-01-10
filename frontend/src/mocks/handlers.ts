import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/hello', () => {
    return HttpResponse.json({ message: 'hello world' });
  }),
];
