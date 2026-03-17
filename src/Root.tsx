import { ErrorBoundary } from './ErrorBoundary.tsx';
import { Provider } from 'react-redux'
import { store } from '@/store';
import { App } from './App.tsx';
import { Provider as ChakraProvider } from '@/components/ui/provider';

function ErrorBoundaryError({ error }: { error: unknown }) {
  
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Provider store={store}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
        
      </Provider>
    </ErrorBoundary>
  );
}
