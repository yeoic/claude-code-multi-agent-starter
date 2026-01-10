import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelloMessage } from './components/HelloMessage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1>Hello World App</h1>
        <HelloMessage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
