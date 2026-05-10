require "rails_helper"

RSpec.describe Employee, type: :model do
  subject(:employee) do
    described_class.new(
      first_name: "Ada",
      last_name: "Lovelace",
      full_name: "Ada Lovelace",
      email: "ada.lovelace@example.com",
      country: "United States",
      job_title: "Software Engineer",
      department: "Engineering",
      salary: 140_000,
      currency: "USD",
      employment_type: "full_time",
      manager_name: "Grace Hopper",
      joining_date: Date.new(2021, 4, 12)
    )
  end

  it "is valid with the required salary management attributes" do
    expect(employee).to be_valid
  end

  it "requires identity, role, location, and compensation fields" do
    %i[first_name last_name full_name email country job_title department salary currency employment_type].each do |field|
      invalid_employee = employee.dup
      invalid_employee.public_send("#{field}=", nil)

      expect(invalid_employee).not_to be_valid
      expect(invalid_employee.errors[field]).to be_present
    end
  end

  it "requires a positive salary" do
    employee.salary = 0

    expect(employee).not_to be_valid
    expect(employee.errors[:salary]).to include("must be greater than 0")
  end

  it "normalizes currency to uppercase" do
    employee.currency = "usd"
    employee.valid?

    expect(employee.currency).to eq("USD")
  end
end
