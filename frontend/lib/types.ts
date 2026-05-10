export type Employee = {
  id: number;
  first_name?: string;
  last_name?: string;
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

export type EmployeeListResponse = {
  employees: Employee[];
  meta: {
    total_count: number;
    limit: number;
    offset: number;
  };
};

export type DashboardInsights = {
  total_employees: number;
  average_salary: number;
  top_paid_roles: Array<{ job_title: string; employee_count: number; average_salary: number }>;
  employee_count_by_country: Array<{ country: string; employee_count: number }>;
  department_insights: Array<{ department: string; employee_count: number; average_salary: number }>;
};

export type CountryInsights = {
  country: string;
  employee_count: number;
  minimum_salary: number;
  maximum_salary: number;
  average_salary: number;
  salary_bands: { low: number; medium: number; high: number };
  job_title_average: number | null;
};
