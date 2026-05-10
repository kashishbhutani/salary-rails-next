require "rails_helper"

RSpec.describe EmployeeSeedBuilder do
  it "builds deterministic employee rows from first and last name lists" do
    rows = described_class.new(
      first_names: %w[Ada Grace],
      last_names: %w[Lovelace Hopper],
      count: 3
    ).rows

    expect(rows.map { |row| row[:full_name] }).to eq(["Ada Lovelace", "Grace Lovelace", "Ada Hopper"])
    expect(rows.first).to include(
      email: "employee00001@example.com",
      country: "United States",
      job_title: "Software Engineer",
      salary: be > 0
    )
  end

  it "builds the requested number of rows" do
    rows = described_class.new(first_names: %w[Ada], last_names: %w[Lovelace], count: 10).rows

    expect(rows.length).to eq(10)
  end
end
