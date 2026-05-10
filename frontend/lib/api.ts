import type { CountryInsights, DashboardInsights, EmployeeListResponse } from "./types";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export function fetchEmployees(params: URLSearchParams) {
  return getJson<EmployeeListResponse>(`/api/employees?${params.toString()}`);
}

export function fetchDashboardInsights() {
  return getJson<DashboardInsights>("/api/insights/dashboard");
}

export function fetchCountryInsights(country: string, jobTitle: string) {
  const params = new URLSearchParams({ country, job_title: jobTitle });
  return getJson<CountryInsights>(`/api/insights/country?${params.toString()}`);
}
