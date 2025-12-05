import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store.ts'
import './index.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { havocTheme } from './common/havocTheme.ts'
import Authenticate from './Authenticate.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={havocTheme}>
        <CssBaseline enableColorScheme />
        <Authenticate />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
