import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SalaryCommandCenter from "./salary-command-center";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (url: RequestInfo | URL) => {
    const path = String(url);

    if (path.includes("/insights/dashboard")) {
      return Response.json({
        total_employees: 3,
        average_salary: 130000,
        top_paid_roles: [{ job_title: "Software Engineer", employee_count: 2, average_salary: 150000 }],
        employee_count_by_country: [{ country: "United States", employee_count: 2 }],
        department_insights: [{ department: "Engineering", employee_count: 2, average_salary: 150000 }]
      });
    }

    if (path.includes("/insights/country")) {
      return Response.json({
        country: "United States",
        employee_count: 2,
        minimum_salary: 100000,
        maximum_salary: 200000,
        average_salary: 150000,
        salary_bands: { low: 1, medium: 0, high: 1 },
        job_title_average: 150000
      });
    }

    return Response.json({
      employees: [
        {
          id: 1,
          full_name: "Ada Lovelace",
          email: "ada@example.com",
          country: "United States",
          job_title: "Software Engineer",
          department: "Engineering",
          salary: 140000,
          currency: "USD",
          employment_type: "full_time"
        }
      ],
      meta: { total_count: 1, limit: 25, offset: 0 }
    });
  }));
});

describe("SalaryCommandCenter", () => {
  it("renders dashboard, salary insights, and employee table data", async () => {
    render(<SalaryCommandCenter />);

    expect(screen.getByRole("heading", { name: "Salary Command Center" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Ada Lovelace")).toBeInTheDocument());
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByText("$150,000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Software Engineer").length).toBeGreaterThan(0);
  });

  it("opens an employee form from the management UI", async () => {
    render(<SalaryCommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Add employee" }));

    expect(await screen.findByRole("dialog", { name: "Employee form" })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save employee" })).toBeInTheDocument();
  });
});
