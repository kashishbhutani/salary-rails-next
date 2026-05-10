import { create } from "zustand";

type EmployeeFiltersState = {
  search: string;
  country: string;
  jobTitle: string;
  setSearch: (search: string) => void;
  setCountry: (country: string) => void;
  setJobTitle: (jobTitle: string) => void;
};

export const useEmployeeFilters = create<EmployeeFiltersState>((set) => ({
  search: "",
  country: "United States",
  jobTitle: "Software Engineer",
  setSearch: (search) => set({ search }),
  setCountry: (country) => set({ country }),
  setJobTitle: (jobTitle) => set({ jobTitle })
}));
