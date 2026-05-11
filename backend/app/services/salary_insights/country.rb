module SalaryInsights
  class Country
    def initialize(country:, job_title: nil, relation: Employee.all)
      @country = country
      @job_title = job_title
      @relation = relation
    end

    def call
      scoped = relation.where(country:)

      {
        country:,
        currency: Employee::COUNTRY_CURRENCIES[country],
        employee_count: scoped.count,
        minimum_salary: scoped.minimum(:salary).to_i,
        maximum_salary: scoped.maximum(:salary).to_i,
        average_salary: scoped.average(:salary).to_i,
        salary_bands: salary_bands(scoped),
        job_title_average: job_title_average(scoped)
      }
    end

    private

    attr_reader :country, :job_title, :relation

    def salary_bands(scoped)
      {
        low: scoped.where("salary < ?", 120_000).count,
        medium: scoped.where(salary: 120_000...180_000).count,
        high: scoped.where("salary >= ?", 180_000).count
      }
    end

    def job_title_average(scoped)
      return nil if job_title.blank?

      scoped.where(job_title:).average(:salary)&.to_i
    end
  end
end
