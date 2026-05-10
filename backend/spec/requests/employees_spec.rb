require "rails_helper"

RSpec.describe "Employees API", type: :request do
  describe "GET /employees" do
    it "returns filtered employees with pagination metadata" do
      create(:employee, full_name: "Ada Lovelace", country: "United States")
      create(:employee, full_name: "Maya Patel", country: "India")

      get "/employees", params: { search: "ada", limit: 10, offset: 0 }

      expect(response).to have_http_status(:ok)
      expect(json_body[:meta]).to include(total_count: 1, limit: 10, offset: 0)
      expect(json_body[:employees].first).to include(full_name: "Ada Lovelace")
    end
  end

  describe "POST /employees" do
    it "creates an employee" do
      post "/employees", params: valid_payload

      expect(response).to have_http_status(:created)
      expect(json_body[:employee]).to include(full_name: "Ada Lovelace", salary: 140_000)
    end
  end

  describe "PATCH /employees/:id" do
    it "updates an employee" do
      employee = create(:employee)

      patch "/employees/#{employee.id}", params: { employee: { salary: 155_000 } }

      expect(response).to have_http_status(:ok)
      expect(json_body[:employee]).to include(salary: 155_000)
    end
  end

  describe "DELETE /employees/:id" do
    it "deletes an employee" do
      employee = create(:employee)

      delete "/employees/#{employee.id}"

      expect(response).to have_http_status(:no_content)
      expect(Employee.exists?(employee.id)).to be(false)
    end
  end

  def valid_payload
    {
      employee: {
        first_name: "Ada",
        last_name: "Lovelace",
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        country: "United States",
        job_title: "Software Engineer",
        department: "Engineering",
        salary: 140_000,
        currency: "USD",
        employment_type: "full_time",
        manager_name: "Grace Hopper",
        joining_date: "2021-04-12"
      }
    }
  end
end
