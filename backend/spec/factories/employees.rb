FactoryBot.define do
  factory :employee do
    sequence(:first_name) { |n| "First#{n}" }
    sequence(:last_name) { |n| "Last#{n}" }
    full_name { "#{first_name} #{last_name}" }
    sequence(:email) { |n| "employee#{n}@example.com" }
    country { "United States" }
    job_title { "Software Engineer" }
    department { "Engineering" }
    salary { 140_000 }
    currency { Employee::COUNTRY_CURRENCIES.fetch(country, "USD") }
    employment_type { "full_time" }
    manager_name { "Grace Hopper" }
    joining_date { Date.new(2021, 4, 12) }
  end
end
