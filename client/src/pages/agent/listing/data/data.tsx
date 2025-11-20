import {
  IconHome,
  IconBuilding,
  IconBuildingSkyscraper,
  IconHomeDollar,
  IconCurrencyDollar,
  IconKey,
} from "@tabler/icons-react";

export const propertyTypes = [
  {
    value: "House",
    label: "House",
    icon: IconHome,
  },
  {
    value: "Condo",
    label: "Condo",
    icon: IconBuilding,
  },
  {
    value: "Townhouse",
    label: "Townhouse",
    icon: IconBuildingSkyscraper,
  },
  {
    value: "Apartment",
    label: "Apartment",
    icon: IconBuilding,
  },
  {
    value: "Land",
    label: "Land",
    icon: IconHomeDollar,
  },
];

export const transactionTypes = [
  {
    value: "Sale",
    label: "For Sale",
    icon: IconCurrencyDollar,
  },
  {
    value: "Rent",
    label: "For Rent",
    icon: IconKey,
  },
  {
    value: "Lease",
    label: "For Lease",
    icon: IconKey,
  },
];
