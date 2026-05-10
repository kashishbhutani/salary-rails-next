first_names = Rails.root.join("db/first_names.txt").read.split
last_names = Rails.root.join("db/last_names.txt").read.split
count = ENV.fetch("SEED_COUNT", 10_000).to_i

started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)

Employee.delete_all
EmployeeSeedBuilder
  .new(first_names:, last_names:, count:)
  .rows
  .each_slice(1_000) { |batch| Employee.insert_all!(batch) }

elapsed_ms = ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at) * 1000).round
puts "Seeded #{count} employees in #{elapsed_ms}ms"
