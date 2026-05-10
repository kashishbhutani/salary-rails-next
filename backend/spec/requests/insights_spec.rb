require "rails_helper"

RSpec.describe "Insights API", type: :request do
  before do
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 100_000)
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 200_000)
    create(:employee, country: "India", job_title: "Product Manager", department: "Product", salary: 90_000, currency: "INR")
  end

  it "returns dashboard insights" do
    get "/insights/dashboard"

    expect(response).to have_http_status(:ok)
    expect(json_body).to include(total_employees: 3, average_salary: 130_000)
  end

  it "returns country and job title insights" do
    get "/insights/country", params: { country: "United States", job_title: "Software Engineer" }

    expect(response).to have_http_status(:ok)
    expect(json_body).to include(
      country: "United States",
      employee_count: 2,
      job_title_average: 150_000
    )
  end
end
