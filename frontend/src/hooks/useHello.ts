import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface HelloResponse {
  message: string;
}

export function useHello() {
  return useQuery<HelloResponse>({
    queryKey: ['hello'],
    queryFn: async () => {
      const { data } = await axios.get<HelloResponse>('http://localhost:3000/hello');
      return data;
    },
  });
}
