Sequel.migration do
	up do
		create_table(:likes) do
			primary_key :id
			TrueClass :like, null: false, default: false
			foreign_key :user_id, :users, null: false
			foreign_key :post_id, :posts, null: false
			DateTime :created_at, null: false
			DateTime :updated_at, null: false

			unique [:user_id, :post_id]
		end
	end

	down do
		drop_table(:likes)
	end
end
