class EmployeeSerializer
  def initialize(employee)
    @employee = employee
  end

  def as_json(*)
    {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: employee.full_name,
      email: employee.email,
      country: employee.country,
      job_title: employee.job_title,
      department: employee.department,
      salary: employee.salary,
      currency: employee.currency,
      employment_type: employee.employment_type,
      manager_name: employee.manager_name,
      joining_date: employee.joining_date&.iso8601
    }
  end

  private

  attr_reader :employee
end
