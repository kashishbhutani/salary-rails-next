"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BarChart3, BriefcaseBusiness, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { createEmployee, deleteEmployee, fetchCountryInsights, fetchDashboardInsights, fetchEmployees, updateEmployee, type EmployeePayload } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Employee } from "@/lib/types";
import { useEmployeeFilters } from "@/stores/employee-filters";

const queryClient = new QueryClient();

const countryCurrencyOptions = [
  { country: "United States", currency: "USD" },
  { country: "India", currency: "INR" },
  { country: "United Kingdom", currency: "GBP" },
  { country: "Germany", currency: "EUR" },
  { country: "Canada", currency: "CAD" },
  { country: "Australia", currency: "AUD" },
  { country: "Singapore", currency: "SGD" },
  { country: "Brazil", currency: "BRL" }
];
const countries = countryCurrencyOptions.map((option) => option.country);
const currencies = countryCurrencyOptions.map((option) => option.currency);
const jobTitles = ["Software Engineer", "Senior Software Engineer", "Product Manager", "HR Business Partner", "Payroll Specialist", "Sales Manager", "Customer Success Manager", "Data Analyst", "Security Engineer", "Operations Lead"];

function currencyForCountry(country: string) {
  return countryCurrencyOptions.find((option) => option.country === country)?.currency ?? "USD";
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="min-h-34 rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm shadow-[#2230270f]">
      <span className="text-sm font-semibold text-[#657468]">{label}</span>
      <strong className="mt-2 block text-3xl leading-tight text-[#17211b] break-words">{value}</strong>
      <small className="text-[#657468]">{detail}</small>
    </section>
  );
}

function SalaryCommandCenterContent() {
  const { search, country, jobTitle, setSearch, setCountry, setJobTitle } = useEmployeeFilters();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  const params = useMemo(() => {
    const next = new URLSearchParams({ limit: "25", offset: "0" });
    if (search) next.set("search", search);
    return next;
  }, [search]);

  const employees = useQuery({ queryKey: ["employees", params.toString()], queryFn: () => fetchEmployees(params) });
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: fetchDashboardInsights });
  const countryInsights = useQuery({
    queryKey: ["country-insights", country, jobTitle],
    queryFn: () => fetchCountryInsights(country, jobTitle)
  });

  const employeeRows = employees.data?.employees ?? [];

  async function refreshEmployees() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["employees"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["country-insights"] })
    ]);
  }

  async function saveEmployee(payload: EmployeePayload) {
    if (editingEmployee) {
      await updateEmployee(editingEmployee.id, payload);
    } else {
      await createEmployee(payload);
    }
    setShowForm(false);
    setEditingEmployee(null);
    await refreshEmployees();
  }

  async function removeEmployee(employee: Employee) {
    await deleteEmployee(employee.id);
    await refreshEmployees();
  }

  return (
    <main className="mx-auto max-w-[1440px] px-7 py-7 text-[#17211b] max-sm:px-4">
      <header className="mb-6 flex items-center justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-[#607064]">HR salary operations</p>
          <h1 className="m-0 text-4xl font-extrabold leading-tight tracking-normal">Salary Command Center</h1>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#185a4d] px-4 font-extrabold text-white hover:bg-[#0f463c]" onClick={() => { setEditingEmployee(null); setShowForm(true); }}>
          <Plus size={18} aria-hidden />
          Add employee
        </button>
      </header>

      <section className="mb-5 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1" aria-label="Salary dashboard">
        <StatCard label="Employees" value={String(dashboard.data?.total_employees ?? "...")} detail="total headcount" />
        <StatCard label="Average salary" value={dashboard.data ? formatCurrency(dashboard.data.average_salary) : "..."} detail="all employees" />
        <StatCard label="Top role" value={dashboard.data?.top_paid_roles[0]?.job_title ?? "..."} detail="highest average salary" />
        <StatCard label="Countries" value={String(dashboard.data?.employee_count_by_country.length ?? "...")} detail="active salary markets" />
      </section>

      <section className="grid grid-cols-[minmax(280px,340px)_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <aside className="grid gap-4 rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm shadow-[#2230270f]">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} aria-hidden />
            <h2 className="m-0 text-lg font-bold">Salary insights</h2>
          </div>
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
              Country
              <select className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={country} onChange={(event) => setCountry(event.target.value)}>
                {countries.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
              Job title
              <select className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)}>
                {jobTitles.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          {countryInsights.data && (
            <div className="border-t border-[#e7ece3]">
              <Metric label="Minimum" value={formatCurrency(countryInsights.data.minimum_salary)} />
              <Metric label="Maximum" value={formatCurrency(countryInsights.data.maximum_salary)} />
              <Metric label="Average" value={formatCurrency(countryInsights.data.average_salary)} />
              <Metric label="Low band" value={String(countryInsights.data.salary_bands.low)} />
              <Metric label="High band" value={String(countryInsights.data.salary_bands.high)} />
            </div>
          )}

          {countryInsights.data?.job_title_average && (
            <div className="flex items-center gap-3 rounded-lg border border-[#cfe4dc] bg-[#eef6f3] p-4">
              <BriefcaseBusiness size={18} aria-hidden />
              <div>
                <span className="block text-sm text-[#657468]">{jobTitle}</span>
                <strong className="text-xl">{formatCurrency(countryInsights.data.job_title_average)}</strong>
              </div>
            </div>
          )}
        </aside>

        <section className="min-w-0 rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm shadow-[#2230270f]">
          <div className="mb-3 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
            <div className="flex items-center gap-2">
              <Users size={20} aria-hidden />
              <h2 className="m-0 text-lg font-bold">Employees</h2>
            </div>
            <label className="flex min-w-80 items-center gap-2 rounded-lg border border-[#cfd8c8] px-3 max-md:min-w-0">
              <Search size={16} aria-hidden />
              <input className="min-h-10 flex-1 border-0 bg-transparent p-0 outline-none" placeholder="Search name, title, or country" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>
          <p className="mb-4 mt-0 text-[#657468]">{employees.data?.meta.total_count.toLocaleString() ?? "..."} employees matched</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed border-collapse">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[11%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#e8ede5] text-left text-xs uppercase tracking-wide text-[#526155]">
                  <th className="px-2.5 py-3 font-black">Name</th>
                  <th className="px-2.5 py-3 font-black">Title</th>
                  <th className="px-2.5 py-3 font-black">Country</th>
                  <th className="px-2.5 py-3 font-black">Department</th>
                  <th className="px-2.5 py-3 font-black">Salary</th>
                  <th className="px-2.5 py-3 text-right font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeRows.map((employee) => (
                  <tr key={employee.id} className="border-b border-[#e8ede5] hover:bg-[#f8faf6]">
                    <td className="px-2.5 py-3 align-middle">
                      <strong className="block truncate">{employee.full_name}</strong>
                      <span className="block truncate text-sm text-[#6d7d70]">{employee.email}</span>
                    </td>
                    <td className="truncate px-2.5 py-3 align-middle">{employee.job_title}</td>
                    <td className="px-2.5 py-3 align-middle">{employee.country}</td>
                    <td className="truncate px-2.5 py-3 align-middle">{employee.department}</td>
                    <td className="whitespace-nowrap px-2.5 py-3 align-middle tabular-nums">{formatCurrency(employee.salary, employee.currency)}</td>
                    <td className="px-2.5 py-3 align-middle">
                      <div className="flex justify-end gap-1.5">
                        <button className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e4e8df] text-[#223027]" aria-label={`Edit ${employee.full_name}`} onClick={() => { setEditingEmployee(employee); setShowForm(true); }}>
                          <Pencil size={16} aria-hidden />
                        </button>
                        <button className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#9a2f28] text-white" aria-label={`Delete ${employee.full_name}`} onClick={() => removeEmployee(employee)}>
                          <Trash2 size={16} aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#17211b75] p-5" role="dialog" aria-modal="true" aria-label="Employee form">
          <div className="max-h-[calc(100vh-40px)] w-full max-w-3xl overflow-y-auto rounded-lg border border-[#dfe6da] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-xl font-bold">{editingEmployee ? "Edit employee" : "Add employee"}</h2>
              <button className="min-h-10 rounded-lg bg-[#e4e8df] px-4 font-extrabold text-[#223027]" onClick={() => { setShowForm(false); setEditingEmployee(null); }}>Close</button>
            </div>
            <EmployeeForm employee={editingEmployee} onSubmit={saveEmployee} />
          </div>
        </div>
      )}
    </main>
  );
}

function EmployeeForm({ employee, onSubmit }: { employee: Employee | null; onSubmit: (payload: EmployeePayload) => Promise<void> }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<EmployeePayload>({
    full_name: employee?.full_name ?? "",
    email: employee?.email ?? "",
    country: employee?.country ?? "United States",
    job_title: employee?.job_title ?? "Software Engineer",
    department: employee?.department ?? "Engineering",
    salary: employee?.salary ?? 100000,
    currency: employee?.currency ?? currencyForCountry(employee?.country ?? "United States"),
    employment_type: employee?.employment_type ?? "full_time",
    manager_name: employee?.manager_name ?? "",
    joining_date: employee?.joining_date ?? "2024-01-15"
  });

  function update(field: keyof EmployeePayload, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateCountry(country: string) {
    setForm((current) => ({ ...current, country, currency: currencyForCountry(country) }));
  }

  return (
    <form
      className="mt-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setIsSaving(true);
        try {
          await onSubmit(form);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Could not save employee");
        } finally {
          setIsSaving(false);
        }
      }}
    >
      {error && (
        <div className="col-span-2 rounded-lg border border-[#f0c1b8] bg-[#fff0ed] px-4 py-3 text-sm font-bold text-[#8b2a20] max-sm:col-span-1">
          {error}
        </div>
      )}
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Full name
        <input className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} required />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Email
        <input className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" inputMode="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Job title
        <input className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.job_title} onChange={(event) => update("job_title", event.target.value)} required />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Department
        <input className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.department} onChange={(event) => update("department", event.target.value)} required />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Country
        <select className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.country} onChange={(event) => updateCountry(event.target.value)} required>
          {countryCurrencyOptions.map((option) => <option key={option.country} value={option.country}>{option.country}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Salary
        <input className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" inputMode="numeric" value={form.salary} onChange={(event) => update("salary", Number(event.target.value))} required />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Currency
        <select className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.currency} onChange={(event) => update("currency", event.target.value)} required>
          {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold text-[#4d5d52]">
        Employment type
        <select className="min-h-10 rounded-lg border border-[#cfd8c8] bg-[#fbfcfa] px-3 py-2 text-[#17211b]" value={form.employment_type} onChange={(event) => update("employment_type", event.target.value)}>
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="contract">Contract</option>
        </select>
      </label>
      <button className="col-span-2 min-h-11 rounded-lg bg-[#185a4d] px-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60 max-sm:col-span-1" type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save employee"}
      </button>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between border-b border-[#e7ece3]">
      <span className="text-[#657468]">{label}</span>
      <strong className="tabular-nums">{value}</strong>
    </div>
  );
}

export default function SalaryCommandCenter() {
  return (
    <QueryClientProvider client={queryClient}>
      <SalaryCommandCenterContent />
    </QueryClientProvider>
  );
}
