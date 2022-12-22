import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import frameSlice from '../slice/frameSlice'
import materialSlice from '../slice/materialSlice'
import celListSlice from '../slice/celListSlice'
import infoSlice from '../slice/infoSlice'
import playerSlice from '../slice/playerSlice'
// As a basic setup, import your same slice reducers

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        frame: frameSlice,
        material: materialSlice,
        celList: celListSlice,
        info: infoSlice,
        player: playerSlice,
      }, preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}