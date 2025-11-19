import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Property } from "@/services/propertyApi";

interface Filters {
  type?: string;
  priceRange?: string;
  beds?: string;
  baths?: string;
  propertyType?: string;
  [key: string]: string | undefined;
}

interface PropertiesState {
  properties: Property[];
  visibleProperties: Property[];
  totalVisibleCount: number;
  filters: Filters;
  selectedProperty: string | null;
  hoveredProperty: string | null;
}

const initialState: PropertiesState = {
  properties: [],
  visibleProperties: [],
  totalVisibleCount: 0,
  filters: {
    type: "for-sale",
    priceRange: "any",
    beds: "any",
    baths: "any",
    propertyType: "any",
  },
  selectedProperty: null,
  hoveredProperty: null,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setVisibleProperties: (state, action: PayloadAction<Property[]>) => {
      state.visibleProperties = action.payload;
    },
    setTotalVisibleCount: (state, action: PayloadAction<number>) => {
      state.totalVisibleCount = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<{ filterName: keyof Filters; value: string }>,
    ) => {
      state.filters[action.payload.filterName] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedProperty: (state, action: PayloadAction<string | null>) => {
      state.selectedProperty = action.payload;
    },
    setHoveredProperty: (state, action: PayloadAction<string | null>) => {
      state.hoveredProperty = action.payload;
    },
  },
});

export const {
  setProperties,
  setVisibleProperties,
  setTotalVisibleCount,
  setFilter,
  resetFilters,
  setSelectedProperty,
  setHoveredProperty,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
