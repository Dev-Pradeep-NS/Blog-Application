Sequel.migration do
	up do
		create_table(:users) do
			primary_key :id
			String :token, unique: true
			String :username, null: false, unique: true
			String :email, unique: true
			String :password_digest, null: false
			String :password_text
			DateTime :created_at
			DateTime :updated_at
			DateTime :deleted_at
		end
	end

	down do
		drop_table(:users)
	end
end
