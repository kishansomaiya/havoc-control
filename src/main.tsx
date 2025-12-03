import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import './index.css'
import App from './App.tsx'
import { havocTheme } from './common/havocTheme.ts'
import { CssBaseline, ThemeProvider } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={havocTheme}>
        <CssBaseline enableColorScheme />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
