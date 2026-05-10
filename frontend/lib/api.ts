import type { CountryInsights, DashboardInsights, Employee, EmployeeListResponse } from "./types";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(await errorMessage(response, `Request failed: ${response.status}`));
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

export type EmployeePayload = {
  full_name: string;
  email: string;
  country: string;
  job_title: string;
  department: string;
  salary: number;
  currency: string;
  employment_type: string;
  manager_name?: string;
  joining_date?: string;
};

function normalizeEmployeePayload(payload: EmployeePayload) {
  const [firstName, ...lastNameParts] = payload.full_name.trim().split(/\s+/);
  return {
    employee: {
      ...payload,
      first_name: firstName,
      last_name: lastNameParts.join(" ") || firstName
    }
  };
}

export async function createEmployee(payload: EmployeePayload) {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeEmployeePayload(payload))
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not create employee"));
  return response.json() as Promise<{ employee: Employee }>;
}

export async function updateEmployee(id: number, payload: EmployeePayload) {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeEmployeePayload(payload))
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not update employee"));
  return response.json() as Promise<{ employee: Employee }>;
}

export async function deleteEmployee(id: number) {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not delete employee"));
}

async function errorMessage(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null);
  if (Array.isArray(payload?.error)) return payload.error.join(", ");
  if (typeof payload?.error === "string") return payload.error;
  if (typeof payload?.message === "string") return payload.message;
  return fallback;
}
