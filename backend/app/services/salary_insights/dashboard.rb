module SalaryInsights
  class Dashboard
    def initialize(relation: Employee.all)
      @relation = relation
    end

    def call
      {
        total_employees: relation.count,
        average_salary: relation.average(:salary).to_i,
        top_paid_roles: top_paid_roles,
        employee_count_by_country: employee_count_by_country,
        department_insights: department_insights
      }
    end

    private

    attr_reader :relation

    def top_paid_roles
      relation
        .select("job_title, COUNT(*) AS employee_count, ROUND(AVG(salary)) AS average_salary")
        .group(:job_title)
        .order(Arel.sql("average_salary DESC"))
        .limit(5)
        .map { |row| { job_title: row.job_title, employee_count: row.employee_count.to_i, average_salary: row.average_salary.to_i } }
    end

    def employee_count_by_country
      relation
        .select("country, COUNT(*) AS employee_count")
        .group(:country)
        .order(Arel.sql("employee_count DESC"), :country)
        .map { |row| { country: row.country, employee_count: row.employee_count.to_i } }
    end

    def department_insights
      relation
        .select("department, COUNT(*) AS employee_count, ROUND(AVG(salary)) AS average_salary")
        .group(:department)
        .order(:department)
        .map { |row| { department: row.department, employee_count: row.employee_count.to_i, average_salary: row.average_salary.to_i } }
    end
  end
end
