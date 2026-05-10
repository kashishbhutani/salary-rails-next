require "rails_helper"

RSpec.describe EmployeeQuery do
  before do
    create(:employee, full_name: "Ada Lovelace", country: "United States", job_title: "Software Engineer", department: "Engineering")
    create(:employee, full_name: "Grace Hopper", country: "United States", job_title: "Security Engineer", department: "Engineering")
    create(:employee, full_name: "Maya Patel", country: "India", job_title: "Product Manager", department: "Product")
  end

  it "searches by employee name and job title" do
    expect(described_class.new(search: "security").results.pluck(:full_name)).to eq(["Grace Hopper"])
    expect(described_class.new(search: "maya").results.pluck(:full_name)).to eq(["Maya Patel"])
  end

  it "filters by country, job title, and department" do
    results = described_class.new(
      country: "United States",
      job_title: "Software Engineer",
      department: "Engineering"
    ).results

    expect(results.pluck(:full_name)).to eq(["Ada Lovelace"])
  end

  it "paginates with a total count" do
    query = described_class.new(limit: 2, offset: 1)

    expect(query.results.length).to eq(2)
    expect(query.total_count).to eq(3)
  end
end
