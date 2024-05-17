Sequel.migration do
	up do
		create_table :followers do
			primary_key :id
			foreign_key :follower_id,
						:users,
						:key=>:id,
						null: false

			foreign_key :followed_id,
						:users,
						:key=>:id,
						null: false

			String :status, default: 'pending'

			DateTime :created_at
			DateTime :updated_at
            DateTime :deleted_at

			unique [:follower_id, :followed_id]

		end
	end

	down do
		drop_table :followers
	end
end
