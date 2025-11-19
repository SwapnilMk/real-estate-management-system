import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Filters {
  type: string | null;
  priceRange: string | null;
  beds: string | null;
  propertyType: string | null;
}

const initialState = {
  filters: {
    type: null,
    priceRange: null,
    beds: null,
    propertyType: null,
  } as Filters,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof Filters; value: string | null }>,
    ) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = {
        type: null,
        priceRange: null,
        beds: null,
        propertyType: null,
      };
    },
  },
});

export const { setFilter, resetFilters } = propertySlice.actions;
export default propertySlice.reducer;
