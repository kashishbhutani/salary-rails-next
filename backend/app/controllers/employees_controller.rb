class EmployeesController < ApplicationController
  def index
    query = EmployeeQuery.new(params.permit(:search, :country, :job_title, :department, :limit, :offset))
    employees = query.results

    render json: {
      employees: employees.map { |employee| EmployeeSerializer.new(employee).as_json },
      meta: {
        total_count: query.total_count,
        limit: permitted_limit,
        offset: permitted_offset
      }
    }
  end

  def create
    employee = Employee.create!(employee_params)
    render json: { employee: EmployeeSerializer.new(employee).as_json }, status: :created
  end

  def update
    employee = Employee.find(params[:id])
    employee.update!(employee_params)
    render json: { employee: EmployeeSerializer.new(employee).as_json }
  end

  def destroy
    Employee.find(params[:id]).destroy!
    head :no_content
  end

  private

  def employee_params
    params.require(:employee).permit(
      :first_name,
      :last_name,
      :full_name,
      :email,
      :country,
      :job_title,
      :department,
      :salary,
      :currency,
      :employment_type,
      :manager_name,
      :joining_date
    )
  end

  def permitted_limit
    (params[:limit].presence || EmployeeQuery::DEFAULT_LIMIT).to_i.clamp(1, EmployeeQuery::MAX_LIMIT)
  end

  def permitted_offset
    [params[:offset].to_i, 0].max
  end
end
