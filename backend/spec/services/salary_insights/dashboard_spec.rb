require "rails_helper"

RSpec.describe SalaryInsights::Dashboard do
  before do
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 100_000)
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 200_000)
    create(:employee, country: "India", job_title: "Product Manager", department: "Product", salary: 90_000, currency: "INR")
    create(:employee, country: "India", job_title: "Data Analyst", department: "Analytics", salary: 60_000, currency: "INR")
  end

  it "returns dashboard metrics for HR compensation review" do
    result = described_class.new.call

    expect(result[:total_employees]).to eq(4)
    expect(result[:average_salary]).to eq(112_500)
    expect(result[:top_paid_roles].first).to include(job_title: "Software Engineer", average_salary: 150_000)
    expect(result[:employee_count_by_country]).to include({ country: "India", employee_count: 2 })
    expect(result[:department_insights]).to include(hash_including(department: "Engineering", average_salary: 150_000))
  end
end
