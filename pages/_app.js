import '../styles/globals.css';
import '../styles/calendar.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/theme-provider';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default MyApp; 