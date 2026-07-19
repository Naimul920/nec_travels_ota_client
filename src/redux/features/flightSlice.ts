import { createSlice } from "@reduxjs/toolkit";
const initialState: {
  isModifySearch: boolean;
} = {
  isModifySearch: false,
};

export const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    modifySearch: (state) => {
      state.isModifySearch = !state.isModifySearch;
    },
  },
});

export const { modifySearch } = flightSlice.actions;
export default flightSlice.reducer;
