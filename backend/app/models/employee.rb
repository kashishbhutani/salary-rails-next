class Employee < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze

  before_validation :normalize_currency

  validates :first_name, :last_name, :full_name, :email, :country, :job_title,
            :department, :salary, :currency, :employment_type, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :salary, numericality: { only_integer: true, greater_than: 0 }
  validates :currency, length: { is: 3 }
  validates :employment_type, inclusion: { in: EMPLOYMENT_TYPES }

  private

  def normalize_currency
    self.currency = currency.to_s.upcase if currency.present?
  end
end
