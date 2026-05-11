import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
      const country = new URL(path, "http://localhost").searchParams.get("country") ?? "United States";
      const currency = country === "India" ? "INR" : "USD";

      return Response.json({
        country,
        currency,
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

  it("formats country insights with the selected country's currency", async () => {
    render(<SalaryCommandCenter />);

    await waitFor(() => expect(screen.getByText("Ada Lovelace")).toBeInTheDocument());

    fireEvent.change(screen.getByRole("combobox", { name: "Country" }), { target: { value: "India" } });

    expect(await screen.findAllByText("₹150,000")).not.toHaveLength(0);
  });

  it("opens an employee form from the management UI", async () => {
    render(<SalaryCommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Add employee" }));

    expect(await screen.findByRole("dialog", { name: "Employee form" })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save employee" })).toBeInTheDocument();
  });

  it("uses controlled country and currency options in the employee form", async () => {
    render(<SalaryCommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Add employee" }));

    const dialog = await screen.findByRole("dialog", { name: "Employee form" });
    const form = within(dialog);

    expect(form.getByRole("combobox", { name: "Country" })).toBeInTheDocument();
    expect(form.getByRole("combobox", { name: "Currency" })).toBeInTheDocument();

    fireEvent.change(form.getByRole("combobox", { name: "Country" }), { target: { value: "India" } });

    expect(form.getByRole("combobox", { name: "Currency" })).toHaveValue("INR");
  });

  it("shows API validation errors inside the employee form", async () => {
    vi.mocked(fetch).mockImplementationOnce(async () => Response.json({
      employees: [],
      meta: { total_count: 0, limit: 25, offset: 0 }
    })).mockImplementationOnce(async () => Response.json({
      total_employees: 0,
      average_salary: 0,
      top_paid_roles: [],
      employee_count_by_country: [],
      department_insights: []
    })).mockImplementationOnce(async () => Response.json({
      country: "United States",
      currency: "USD",
      employee_count: 0,
      minimum_salary: 0,
      maximum_salary: 0,
      average_salary: 0,
      salary_bands: { low: 0, medium: 0, high: 0 },
      job_title_average: null
    })).mockImplementationOnce(async () => Response.json(
      { error: ["Email has already been taken"] },
      { status: 422 }
    ));

    render(<SalaryCommandCenter />);
    fireEvent.click(screen.getByRole("button", { name: "Add employee" }));
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Save employee" }));

    expect(await screen.findByText("Email has already been taken")).toBeInTheDocument();
  });
});
