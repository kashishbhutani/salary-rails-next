class Employee < ApplicationRecord
  COUNTRY_CURRENCIES = {
    "United States" => "USD",
    "India" => "INR",
    "United Kingdom" => "GBP",
    "Germany" => "EUR",
    "Canada" => "CAD",
    "Australia" => "AUD",
    "Singapore" => "SGD",
    "Brazil" => "BRL"
  }.freeze

  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze

  before_validation :normalize_currency

  validates :first_name, :last_name, :full_name, :email, :country, :job_title,
            :department, :salary, :currency, :employment_type, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :salary, numericality: { only_integer: true, greater_than: 0 }
  validates :country, inclusion: { in: COUNTRY_CURRENCIES.keys }
  validates :currency, inclusion: { in: COUNTRY_CURRENCIES.values.uniq }, length: { is: 3 }
  validates :employment_type, inclusion: { in: EMPLOYMENT_TYPES }
  validate :currency_matches_country

  private

  def normalize_currency
    self.currency = currency.to_s.upcase if currency.present?
  end

  def currency_matches_country
    return if country.blank? || currency.blank? || !COUNTRY_CURRENCIES.key?(country)

    errors.add(:currency, "must match the selected country") if COUNTRY_CURRENCIES[country] != currency
  end
end
