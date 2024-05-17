Sequel.migration do
	up do
		create_table(:bookmarks) do
			primary_key :id
			foreign_key :user_id, :users, null: false
			foreign_key :post_id, :posts, null: false
			DateTime :created_at, null: false
			DateTime :updated_at, null: false

		end
	end

	down do
		drop_table(:bookmarks)
	end
end
