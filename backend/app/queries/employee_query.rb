class EmployeeQuery
  DEFAULT_LIMIT = 25
  MAX_LIMIT = 100

  attr_reader :total_count

  def initialize(params = {}, relation: Employee.all, **keyword_params)
    params = params.merge(keyword_params)
    @params = params.to_h.symbolize_keys
    @relation = relation
  end

  def results
    scoped = filtered_relation.order(:full_name)
    @total_count = scoped.count
    scoped.limit(limit).offset(offset)
  end

  private

  attr_reader :params, :relation

  def filtered_relation
    scope = relation
    scope = apply_search(scope)
    scope = scope.where(country: params[:country]) if params[:country].present?
    scope = scope.where(job_title: params[:job_title]) if params[:job_title].present?
    scope = scope.where(department: params[:department]) if params[:department].present?
    scope
  end

  def apply_search(scope)
    return scope if params[:search].blank?

    term = "%#{ActiveRecord::Base.sanitize_sql_like(params[:search].to_s.downcase)}%"
    scope.where(
      "LOWER(full_name) LIKE :term OR LOWER(job_title) LIKE :term OR LOWER(country) LIKE :term",
      term:
    )
  end

  def limit
    raw_limit = params[:limit].presence || DEFAULT_LIMIT
    raw_limit.to_i.clamp(1, MAX_LIMIT)
  end

  def offset
    [params[:offset].to_i, 0].max
  end
end
