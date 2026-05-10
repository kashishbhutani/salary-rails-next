"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BarChart3, BriefcaseBusiness, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { createEmployee, deleteEmployee, fetchCountryInsights, fetchDashboardInsights, fetchEmployees, updateEmployee, type EmployeePayload } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Employee } from "@/lib/types";
import { useEmployeeFilters } from "@/stores/employee-filters";

const queryClient = new QueryClient();

const countries = ["United States", "India", "United Kingdom", "Germany", "Canada", "Australia", "Singapore", "Brazil"];
const jobTitles = ["Software Engineer", "Senior Software Engineer", "Product Manager", "HR Business Partner", "Payroll Specialist", "Sales Manager", "Customer Success Manager", "Data Analyst", "Security Engineer", "Operations Lead"];

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
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
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p>HR salary operations</p>
          <h1>Salary Command Center</h1>
        </div>
        <button className="primary-button" onClick={() => { setEditingEmployee(null); setShowForm(true); }}>
          <Plus size={18} aria-hidden />
          Add employee
        </button>
      </header>

      <section className="stats-grid" aria-label="Salary dashboard">
        <StatCard label="Employees" value={String(dashboard.data?.total_employees ?? "...")} detail="total headcount" />
        <StatCard label="Average salary" value={dashboard.data ? formatCurrency(dashboard.data.average_salary) : "..."} detail="all employees" />
        <StatCard label="Top role" value={dashboard.data?.top_paid_roles[0]?.job_title ?? "..."} detail="highest average salary" />
        <StatCard label="Countries" value={String(dashboard.data?.employee_count_by_country.length ?? "...")} detail="active salary markets" />
      </section>

      <section className="content-grid">
        <aside className="panel insights-panel">
          <div className="panel-title">
            <BarChart3 size={20} aria-hidden />
            <h2>Salary insights</h2>
          </div>

          <div className="filter-grid">
            <label>
              Country
              <select value={country} onChange={(event) => setCountry(event.target.value)}>
                {countries.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              Job title
              <select value={jobTitle} onChange={(event) => setJobTitle(event.target.value)}>
                {jobTitles.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          {countryInsights.data && (
            <div className="metric-list">
              <Metric label="Minimum" value={formatCurrency(countryInsights.data.minimum_salary)} />
              <Metric label="Maximum" value={formatCurrency(countryInsights.data.maximum_salary)} />
              <Metric label="Average" value={formatCurrency(countryInsights.data.average_salary)} />
              <Metric label="Low band" value={String(countryInsights.data.salary_bands.low)} />
              <Metric label="High band" value={String(countryInsights.data.salary_bands.high)} />
            </div>
          )}

          {countryInsights.data?.job_title_average && (
            <div className="role-callout">
              <BriefcaseBusiness size={18} aria-hidden />
              <div>
                <span>{jobTitle}</span>
                <strong>{formatCurrency(countryInsights.data.job_title_average)}</strong>
              </div>
            </div>
          )}
        </aside>

        <section className="panel employees-panel">
          <div className="employee-toolbar">
            <div className="panel-title">
              <Users size={20} aria-hidden />
              <h2>Employees</h2>
            </div>
            <label className="search-box">
              <Search size={16} aria-hidden />
              <input placeholder="Search name, title, or country" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>

          <p className="result-count">{employees.data?.meta.total_count.toLocaleString() ?? "..."} employees matched</p>

          <div className="table-wrap">
            <table>
              <colgroup>
                <col className="name-col" />
                <col className="title-col" />
                <col className="country-col" />
                <col className="department-col" />
                <col className="salary-col" />
                <col className="actions-col" />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Country</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeRows.map((employee) => (
                  <tr key={employee.id}>
                    <td className="employee-identity">
                      <strong>{employee.full_name}</strong>
                      <span>{employee.email}</span>
                    </td>
                    <td>{employee.job_title}</td>
                    <td>{employee.country}</td>
                    <td>{employee.department}</td>
                    <td className="salary-cell">{formatCurrency(employee.salary, employee.currency)}</td>
                    <td className="row-actions">
                      <button className="icon-button" aria-label={`Edit ${employee.full_name}`} onClick={() => { setEditingEmployee(employee); setShowForm(true); }}>
                        <Pencil size={16} aria-hidden />
                      </button>
                      <button className="icon-button danger" aria-label={`Delete ${employee.full_name}`} onClick={() => removeEmployee(employee)}>
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {showForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Employee form">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingEmployee ? "Edit employee" : "Add employee"}</h2>
              <button className="secondary-button" onClick={() => { setShowForm(false); setEditingEmployee(null); }}>Close</button>
            </div>
            <EmployeeForm employee={editingEmployee} onSubmit={saveEmployee} />
          </div>
        </div>
      )}
    </main>
  );
}

function EmployeeForm({ employee, onSubmit }: { employee: Employee | null; onSubmit: (payload: EmployeePayload) => Promise<void> }) {
  const [form, setForm] = useState<EmployeePayload>({
    full_name: employee?.full_name ?? "",
    email: employee?.email ?? "",
    country: employee?.country ?? "United States",
    job_title: employee?.job_title ?? "Software Engineer",
    department: employee?.department ?? "Engineering",
    salary: employee?.salary ?? 100000,
    currency: employee?.currency ?? "USD",
    employment_type: employee?.employment_type ?? "full_time",
    manager_name: employee?.manager_name ?? "",
    joining_date: employee?.joining_date ?? "2024-01-15"
  });

  function update(field: keyof EmployeePayload, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="employee-form" onSubmit={(event) => { event.preventDefault(); void onSubmit(form); }}>
      <label>
        Full name
        <input value={form.full_name} onChange={(event) => update("full_name", event.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
      </label>
      <label>
        Job title
        <input value={form.job_title} onChange={(event) => update("job_title", event.target.value)} required />
      </label>
      <label>
        Department
        <input value={form.department} onChange={(event) => update("department", event.target.value)} required />
      </label>
      <label>
        Country
        <input value={form.country} onChange={(event) => update("country", event.target.value)} required />
      </label>
      <label>
        Salary
        <input type="number" value={form.salary} onChange={(event) => update("salary", Number(event.target.value))} required />
      </label>
      <label>
        Currency
        <input value={form.currency} onChange={(event) => update("currency", event.target.value)} required />
      </label>
      <label>
        Employment type
        <select value={form.employment_type} onChange={(event) => update("employment_type", event.target.value)}>
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="contract">Contract</option>
        </select>
      </label>
      <button className="primary-button form-submit" type="submit">Save employee</button>
    </form>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
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
