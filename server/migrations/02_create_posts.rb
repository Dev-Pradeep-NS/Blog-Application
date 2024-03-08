Sequel.migration do
    up do
        create_table :posts do
            primary_key :id
            String      :title, :allow_blank => false
            String      :content, :allow_blank => false

            foreign_key :userid
            DateTime    :created_at
            DateTime    :updated_at
            DateTime    :deleted_at

            foreign_key :user_id,
                        :users,
                        :key=>:id,
                        :on_delete=>:cascade
        end
    end

    down do
        drop_table :posts
    end

end