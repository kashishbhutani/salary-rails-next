class InsightsController < ApplicationController
  def dashboard
    render json: SalaryInsights::Dashboard.new.call
  end

  def country
    render json: SalaryInsights::Country.new(
      country: params.require(:country),
      job_title: params[:job_title]
    ).call
  end
end
