import { useHello } from '../hooks/useHello';

export function HelloMessage() {
  const { data, isLoading, error } = useHello();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading message</div>;

  return <div>{data?.message}</div>;
}
