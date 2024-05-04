require 'sequel'
require 'bcrypt'

db_file = Pathname.new(__dir__).join('../database/blogapp.sqlite').to_s

DB = Sequel.sqlite db_file

Sequel::Model.plugin	:timestamps,
						:create    => :created_at,
						:update    => :updated_at,
						:force    => true,
						:update_on_create => true

class User < Sequel::Model(DB[:users])

    one_to_many         :posts,
                        :key   => :user_id,
                        :class => :Post

    def self.login data
        user = self.find(email: data[:email])
        raise "Invalid User" if !user

        password_digest = BCrypt::Password.new(user.password_digest)
        raise "Invalid Password" if password_digest != data[:password]
        username = user.username
        createdDate = user.created_at

        user.update(
            token: SecureRandom.hex(10),
        )

        {
            token: user.token,
            email: data[:email],
            username: username,
            created_at: createdDate
        }
        
    end

    def self.register data
        raise "Username is required" if data[:username].nil?
        raise "Email is required" if data[:email].nil?

        exist_user = self.find(username: data[:username])
        
        user_obj = {
            username: data[:username],
            email: data[:email],
            password_digest: BCrypt::Password.create(data[:password])
        }

        if exist_user
            exist_user.update(user_obj)
        else
            new_user = User.new(user_obj)
            new_user.save
        end
        
        user_obj
    end

    def create_post params
        raise "Title is Required" if params[:title].nil?
        raise "Provide some content" if params[:content].nil?
        raise "what is the status" if params[:status].nil?
        raise "image is required" if params[:pic].nil?
        
        filename = nil
        if params[:pic] and params[:pic][:tempfile]
            fileptr = params[:pic][:tempfile]

            fileext = params[:pic][:type].split('/')[1]
            filename = "#{Util.getUniqueName}.#{fileext}"

			file_save_as = "#{$uploads_dir}/#{filename}"

			File.open(file_save_as, "wb") do |save_file|
				save_file.write(fileptr.read)
			end
        end

        post = {
            title: params[:title],
            content: params[:content],
            status: params[:status],
            visibility: params[:visibility],
            category: params[:category],
            image_url: filename
        }
        
        post = self.add_post(post)
        post.save
        
        post.values.merge(
            image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
        )
        post
    end

    def update_post data
        post = {
            title: data[:title],
            content: data[:content]
        }

        self.update(post);
        post
    end

    def get_all
        all_posts = Post.reverse(:created_at).where(user_id: self.id).all.collect do |post|
            {
                id: post.id,
                title: post.title,
                content: post.content,
                created_date: post.created_at,
                status: post.status,
                visibility: post.visibility,
                category: post.category,
                image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
            }
        end
        all_posts
    end

    def delete_post
        raise "post is already deleted" if self.deleted?
        self.soft_delete
    end
end

class Post < Sequel::Model(DB[:posts])

    one_to_many         :comments,
                        :key   => :post_id,
                        :class => :Comment

    def create_comment data
        comment = {
            name: data[:name],
            comment: data[:comment]
        }
        comment = self.add_comment(comment);
        comment.save
        comment
    end

    def get_all_comments
        comments = Comment.reverse(:created_at).where(post_id: self.id).all.collect do |comment|
            {
                name: comment.name,
                comment: comment.comment
            }
        end
        comments
    end
end

class Comment < Sequel::Model(DB[:comments])
    
end