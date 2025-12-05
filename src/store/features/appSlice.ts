import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface AppState {
  appOpenDrawers: AppOpenDrawers
  activeSectorId: string | undefined
  activeEntity: string | null
  frontendAccessToken: string | undefined
}

interface AppOpenDrawers {
  left?: boolean
  right?: boolean
}

const appInitialState: AppState = {
  appOpenDrawers: { left: false, right: false },
  activeSectorId: localStorage.getItem('sector') || undefined,
  activeEntity: null,
  frontendAccessToken: sessionStorage.getItem('token') || undefined,
}

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setAppOpenDrawers: (state, action: PayloadAction<AppState['appOpenDrawers']>) => {
      state.appOpenDrawers = { ...state.appOpenDrawers, ...action.payload }
    },
    setActiveSectorId: (state, action: PayloadAction<string | undefined>) => {
      localStorage.setItem('sector', JSON.stringify(action.payload))
      state.activeSectorId = action.payload
    },
    setActiveEntity: (state, action: PayloadAction<AppState['activeEntity']>) => {
      state.activeEntity = action.payload
    },
    setFrontendAccessToken: (state, action: PayloadAction<string>) => {
      sessionStorage.setItem('token', action.payload);
      state.frontendAccessToken = action.payload
    },
  },
})

export const {
  setAppOpenDrawers,
  setActiveSectorId,
  setActiveEntity,
  setFrontendAccessToken,
} = appSlice.actions
export default appSlice.reducer
