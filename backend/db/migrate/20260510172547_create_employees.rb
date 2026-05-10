class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :full_name, null: false
      t.string :email, null: false
      t.string :country, null: false
      t.string :job_title, null: false
      t.string :department, null: false
      t.integer :salary, null: false
      t.string :currency, null: false
      t.string :employment_type, null: false
      t.string :manager_name
      t.date :joining_date

      t.timestamps
    end

    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, :department
    add_index :employees, [:country, :job_title]
    add_check_constraint :employees, "salary > 0", name: "employees_salary_positive"
  end
end
