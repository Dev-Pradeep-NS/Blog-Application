Sequel.migration do
    up do
        create_table :comments do
            primary_key :id
            String      :name, :allow_blank => false
            String      :comment, :allow_blank => false
            TrueClass   :is_flagged, default: false

            DateTime    :created_at
            DateTime    :updated_at
            DateTime    :deleted_at

            foreign_key :post_id,
                        :posts,
                        :key=>:id,
                        :on_delete=>:cascade
        end
    end

    down do
        drop_table :comments
    end

end