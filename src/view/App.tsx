import { Toaster } from 'sonner';
import { BrowserRouter as AppRouter } from './routes/BrowserRouter';
import './styles/index.css';

export function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}
