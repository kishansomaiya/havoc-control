import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface MapState {
  mapLoaded: boolean
}

const mapInitialState: MapState = {
  mapLoaded: false,
}

const mapSlice = createSlice({
  name: 'map',
  initialState: mapInitialState,
  reducers: {
    setMapLoaded: (state, action: PayloadAction<boolean>) => {
      state.mapLoaded = action.payload
    },
  },
})

export const { setMapLoaded } = mapSlice.actions

export default mapSlice.reducer
