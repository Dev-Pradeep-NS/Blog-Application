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
        user = self.find(username: data[:username])
        raise "Invalid User" if !user

        password_digest = BCrypt::Password.new(user.password_digest)
        raise "Invalid Password" if password_digest != data[:password]
        user.update(
            token: SecureRandom.hex(10),
        )

        {
            token: user.token,
            username: data[:username]
        }
        
    end

    def self.register data
        raise "Username is required" if data[:username].nil?
        raise "Email is required" if data[:email].nil?

        exist_user = self.find(username: data[:username])
        
        user_obj = {
            username: data[:username],
            email: data[:email],
            mobile: data[:mobile],
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

    def create_post data
        raise "Title is Required" if data[:title].nil?
        raise "Provide some content" if data[:content].nil?

        post = {
            title: data[:title],
            content: data[:content]
        }
        post = self.add_post(post)
        post.save
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
                created_date: post.created_at
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