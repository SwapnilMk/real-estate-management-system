import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFilter,
  resetFilters,
  setSelectedProperty,
  setHoveredProperty,
  setVisibleProperties,
  setTotalVisibleCount,
} from "@/features/properties/propertiesSlice";

export const usePropertyStore = () => {
  const dispatch = useAppDispatch();
  const {
    properties,
    visibleProperties,
    totalVisibleCount,
    filters,
    selectedProperty,
    hoveredProperty,
  } = useAppSelector((state) => state.properties);

  return {
    properties,
    visibleProperties,
    totalVisibleCount,
    filters,
    selectedProperty,
    hoveredProperty,
    setFilter: (filterName: string, value: string) =>
      dispatch(setFilter({ filterName, value })),
    resetFilters: () => dispatch(resetFilters()),
    setSelectedProperty: (id: string | null) =>
      dispatch(setSelectedProperty(id)),
    setHoveredProperty: (id: string | null) => dispatch(setHoveredProperty(id)),
    setVisibleProperties: (props: any[]) =>
      dispatch(setVisibleProperties(props)),
    setTotalVisibleCount: (count: number) =>
      dispatch(setTotalVisibleCount(count)),
  };
};
