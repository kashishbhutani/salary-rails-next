"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BarChart3, BriefcaseBusiness, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { fetchCountryInsights, fetchDashboardInsights, fetchEmployees } from "@/lib/api";
import { formatCompact, formatCurrency } from "@/lib/format";
import { useEmployeeFilters } from "@/stores/employee-filters";

const queryClient = new QueryClient();

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm">
      <span className="text-sm font-semibold text-[#657468]">{label}</span>
      <strong className="mt-1 block text-3xl text-[#17211b]">{value}</strong>
      <small className="text-[#657468]">{detail}</small>
    </section>
  );
}

function SalaryCommandCenterContent() {
  const { search, country, jobTitle, setSearch, setCountry, setJobTitle } = useEmployeeFilters();
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

  const [showForm, setShowForm] = useState(false);
  const employeeRows = employees.data?.employees ?? [];

  return (
    <main className="mx-auto max-w-[1440px] px-7 py-7 text-[#17211b]">
      <header className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <p className="text-sm font-bold uppercase text-[#607064]">HR salary operations</p>
          <h1 className="text-4xl font-extrabold tracking-normal">Salary Command Center</h1>
        </div>
        <button className="rounded-lg bg-[#185a4d] px-4 py-3 font-bold text-white" onClick={() => setShowForm(true)}>
          Add employee
        </button>
      </header>

      <section className="mb-5 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1" aria-label="Salary dashboard">
        <StatCard label="Employees" value={String(dashboard.data?.total_employees ?? "...")} detail="total headcount" />
        <StatCard label="Average salary" value={dashboard.data ? formatCurrency(dashboard.data.average_salary) : "..."} detail="all employees" />
        <StatCard label="Top role" value={dashboard.data?.top_paid_roles[0]?.job_title ?? "..."} detail="highest average salary" />
        <StatCard label="Countries" value={String(dashboard.data?.employee_count_by_country.length ?? "...")} detail="active salary markets" />
      </section>

      <section className="grid grid-cols-[360px_minmax(0,1fr)] gap-5 max-lg:grid-cols-1">
        <aside className="rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            <h2 className="text-lg font-bold">Salary insights</h2>
          </div>
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm font-bold text-[#4d5d52]">
              Country
              <select className="rounded-lg border border-[#cfd8c8] p-3" value={country} onChange={(event) => setCountry(event.target.value)}>
                {["United States", "India", "United Kingdom", "Germany", "Canada", "Australia", "Singapore", "Brazil"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-[#4d5d52]">
              Job title
              <select className="rounded-lg border border-[#cfd8c8] p-3" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)}>
                {["Software Engineer", "Senior Software Engineer", "Product Manager", "HR Business Partner", "Payroll Specialist", "Sales Manager", "Customer Success Manager", "Data Analyst", "Security Engineer", "Operations Lead"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          {countryInsights.data && (
            <div className="mt-5 grid divide-y divide-[#e7ece3] border-t border-[#e7ece3]">
              <Metric label="Minimum" value={formatCurrency(countryInsights.data.minimum_salary)} />
              <Metric label="Maximum" value={formatCurrency(countryInsights.data.maximum_salary)} />
              <Metric label="Average" value={formatCurrency(countryInsights.data.average_salary)} />
              <Metric label="Low band" value={String(countryInsights.data.salary_bands.low)} />
              <Metric label="High band" value={String(countryInsights.data.salary_bands.high)} />
            </div>
          )}

          {countryInsights.data?.job_title_average && (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#cfe4dc] bg-[#eef6f3] p-4">
              <BriefcaseBusiness size={18} />
              <div>
                <span className="block text-sm text-[#657468]">{jobTitle}</span>
                <strong className="text-xl">{formatCurrency(countryInsights.data.job_title_average)}</strong>
              </div>
            </div>
          )}
        </aside>

        <section className="rounded-lg border border-[#dfe6da] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h2 className="text-lg font-bold">Employees</h2>
            </div>
            <label className="flex min-w-[280px] items-center gap-2 rounded-lg border border-[#cfd8c8] px-3 max-md:min-w-0">
              <Search size={16} />
              <input className="min-h-10 flex-1 outline-none" placeholder="Search name, title, or country" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>
          <p className="mb-4 text-[#657468]">{employees.data?.meta.total_count.toLocaleString() ?? "..."} employees matched</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr className="border-b border-[#e8ede5] text-left text-xs uppercase text-[#526155]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employeeRows.map((employee) => (
                  <tr key={employee.id} className="border-b border-[#e8ede5]">
                    <td className="p-3"><strong>{employee.full_name}</strong><span className="block text-sm text-[#657468]">{employee.email}</span></td>
                    <td className="p-3">{employee.job_title}</td>
                    <td className="p-3">{employee.country}</td>
                    <td className="p-3">{employee.department}</td>
                    <td className="p-3">{formatCurrency(employee.salary, employee.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add employee</h2>
              <button className="rounded-lg bg-[#e4e8df] px-3 py-2 font-bold text-[#223027]" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <p className="mt-4 text-[#657468]">CRUD API is wired; this modal is ready for the create/edit form fields.</p>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[#657468]">{label}</span>
      <strong>{value}</strong>
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
