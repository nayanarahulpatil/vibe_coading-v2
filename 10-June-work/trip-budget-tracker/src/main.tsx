import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import AppRouter from './AppRouter.tsx'
import { store } from './store'

// v3: remove legacy trip state from localStorage (auth token only)
localStorage.removeItem('trip_budget_tracker_state');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StrictMode>,
)
