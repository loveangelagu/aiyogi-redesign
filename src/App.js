import AppRoutes from './routes';
import TwinklingStars from './components/TwinklingStars';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  return (
    <div className="App">
      <TwinklingStars />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </div>
  );
}

export default App;