require "rails_helper"

RSpec.describe SalaryInsights::Country do
  before do
    create(:employee, country: "United States", job_title: "Software Engineer", salary: 100_000)
    create(:employee, country: "United States", job_title: "Software Engineer", salary: 200_000)
    create(:employee, country: "United States", job_title: "Product Manager", salary: 150_000)
    create(:employee, country: "India", salary: 90_000, currency: "INR")
  end

  it "returns salary distribution for a country" do
    result = described_class.new(country: "United States").call

    expect(result).to include(
      country: "United States",
      employee_count: 3,
      minimum_salary: 100_000,
      maximum_salary: 200_000,
      average_salary: 150_000
    )
    expect(result[:salary_bands]).to eq({ low: 1, medium: 1, high: 1 })
  end

  it "returns average salary for a job title in the selected country" do
    result = described_class.new(country: "United States", job_title: "Software Engineer").call

    expect(result[:job_title_average]).to eq(150_000)
  end
end
