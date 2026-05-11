class EmployeeSeedBuilder
  COUNTRIES = Employee::COUNTRY_CURRENCIES.to_a.freeze

  ROLES = [
    ["Software Engineer", "Engineering", 118_000],
    ["Senior Software Engineer", "Engineering", 154_000],
    ["Product Manager", "Product", 142_000],
    ["HR Business Partner", "People", 96_000],
    ["Payroll Specialist", "Finance", 82_000],
    ["Sales Manager", "Sales", 132_000],
    ["Customer Success Manager", "Customer", 104_000],
    ["Data Analyst", "Analytics", 98_000],
    ["Security Engineer", "Engineering", 148_000],
    ["Operations Lead", "Operations", 110_000]
  ].freeze

  EMPLOYMENT_TYPES = Employee::EMPLOYMENT_TYPES.freeze

  def initialize(first_names:, last_names:, count:)
    @first_names = first_names
    @last_names = last_names
    @count = count
  end

  def rows
    now = Time.current

    Array.new(count) do |index|
      first_name, last_name = name_parts(index)
      country, currency = COUNTRIES[index % COUNTRIES.length]
      job_title, department, base_salary = ROLES[(index * 7) % ROLES.length]

      {
        first_name:,
        last_name:,
        full_name: "#{first_name} #{last_name}",
        email: "employee#{format('%05d', index + 1)}@example.com",
        country:,
        job_title:,
        department:,
        salary: salary_for(index, base_salary),
        currency:,
        employment_type: EMPLOYMENT_TYPES[index % EMPLOYMENT_TYPES.length],
        manager_name: manager_name_for(index),
        joining_date: joining_date_for(index),
        created_at: now,
        updated_at: now
      }
    end
  end

  private

  attr_reader :first_names, :last_names, :count

  def name_parts(index)
    [
      first_names[index % first_names.length],
      last_names[(index / first_names.length) % last_names.length]
    ]
  end

  def manager_name_for(index)
    first_name, last_name = name_parts(index + 137)
    "#{first_name} #{last_name}"
  end

  def salary_for(index, base_salary)
    variance = ((index * 7_919) % 54_000) - 18_000
    [base_salary + variance, 18_000].max
  end

  def joining_date_for(index)
    Date.new(2014 + (index % 12), (index % 12) + 1, (index % 27) + 1)
  end
end
