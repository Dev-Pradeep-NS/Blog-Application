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

	many_to_many 		:followings,
						left_key: :follower_id,
						right_key: :followed_id,
						join_table: :followers,
						class: :Follow

	many_to_many 		:bookmarked_posts,
						left_key: :user_id,
						right_key: :post_id,
						join_table: :bookmarks,
						class: :Post

	one_to_many 		:likes,
						key: :user_id,
						class: :Like

	many_to_many 		:liked_posts,
						left_key: :user_id,
						right_key: :post_id,
						join_table: :likes,
						class: :Post

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

    def create_post data
        raise "Title is Required" if data[:title].nil?
        raise "Provide some content" if data[:content].nil?
        # raise "image is required" if data[:pic].nil?
        raise "Category is required" if data[:category].nil?
        raise "Visibilty is required" if data[:visibility].nil?

        filename = nil
        if data[:pic] and data[:pic][:tempfile]
            fileptr = data[:pic][:tempfile]

            fileext = data[:pic][:type].split('/')[1]
            filename = "#{Util.getUniqueName}.#{fileext}"

			file_save_as = "#{$uploads_dir}/#{filename}"

			File.open(file_save_as, "wb") do |save_file|
				save_file.write(fileptr.read)
			end
        end

        post = {
            title: data[:title],
            content: data[:content],
            visibility: data[:visibility],
            category: data[:category],
            # user_id: user.id
            # image_url: filename
        }

        post = self.add_post(post)
        post.save

        post.values.merge(
            image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
        )
        post
    end

	def get_all_user_posts
        all_posts = Post.reverse(:created_at).where(user_id: self.id).all.collect do |post|
			liked_post = !Like.where(user_id: self.id, post_id: post.id).empty?
			bookmarked_post = !Like.where(user_id: self.id, post_id: post.id).empty?
			likes_count = Like.where(post_id: post.id).count
			comments_count = Comment.where(post_id: post.id).count

            {
                user_id: post.user_id,
                post_id: post.id,
                liked: liked_post,
				bookmarked: bookmarked_post,
				likes_count: likes_count,
				comments_count: comments_count,
                title: post.title,
                content: post.content,
                created_date: post.created_at,
                visibility: post.visibility,
                category: post.category,
                image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
            }
        end
        all_posts
    end

	def get_all_posts data
        all_posts = Post.reverse(:created_at).all.collect do |post|
            liked_post = !Like.where(user_id: self.id, post_id: post.id).empty?
			bookmarked_post = !Like.where(user_id: self.id, post_id: post.id).empty?
			likes_count = Like.where(post_id: post.id).count
            comments_count = Comment.where(post_id: post.id).count

            {
                user_id: post.user_id,
                post_id: post.id,
                liked: liked_post,
				bookmarked: bookmarked_post,
				likes_count: likes_count,
				comments_count: comments_count,
                title: post.title,
                content: post.content,
                created_date: post.created_at,
                visibility: post.visibility,
                category: post.category,
                image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
            }
        end
        all_posts
    end

	def like_post data
		post_id = data[:post_id]
		liked = Like.where(post_id: post_id, user_id: self.id).first
		return liked if liked

		like_post = {
			user_id: self.id,
			post_id: post_id,
			like: true
		}

		like = Like.new(like_post)
		like.save
		like_post
	end

	def get_liked_posts data
		liked_post = Like.where(user_id: self.id, like: true).all.collect do |like|

			post = Post.where(id: like.post_id).first
			bookmarked_post = !Like.where(user_id: self.id, post_id: like.post_id).empty?
			likes_count = Like.where(post_id: like.post_id).count
            comments_count = Comment.where(post_id: like.post_id).count
			{
				user_id: post.user_id,
                post_id: post.id,
				bookmarked: bookmarked_post,
				likes_count: likes_count,
				comments_count: comments_count,
                title: post.title,
                content: post.content,
                created_date: post.created_at,
                visibility: post.visibility,
                category: post.category,
                # image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
			}
		end
	end

	def add_bookmarked_post data
		raise "post is required" if data[:post_id].nil?

		post_id = data[:post_id]
		existing_bookmark = Bookmark.where(post_id: post_id, user_id: self.id).first
		return existing_bookmark if existing_bookmark

		new_bookmark = {
			user_id: self.id,
			post_id: post_id,
		}

		bookmark = Bookmark.new(new_bookmark)
		bookmark.save
		new_bookmark
	end

	def remove_bookmarked_post data
		raise "there is no bookmarked post" if data[:post_id].nil?

		post_id = data[:post_id]
		bookmarked_post = Bookmark.where(post_id: post_id, user_id: self.id).first

		bookmarked_post.destroy
	end

	def get_bookmarked_list
		bookmarked_posts = self.bookmarked_posts.collect do |post|
			{
				user_id: post.user_id,
				post_id: post.id,
				title: post.title,
				content: post.content,
				created_date: post.created_at,
				visibility: post.visibility,
				category: post.category,
				# image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
			}
		end
		bookmarked_posts
	end

	def follow data
		raise "Follower user not found" if self.id.nil?
		raise "Followed user not found" if data[:followed_id].nil?

		existing_follow = Follow.where(follower_id: self.id, followed_id: data[:followed_id]).first
		return existing_follow if existing_follow

		follow = {
			follower_id: self.id,
			followed_id: data[:followed_id].to_i,
			status: data[:status]
		}

		follow = Follow.new(follow)
		follow.save
		follow
	end

	def following data
        following = Follow.where(follower_id: self.id).all.collect do |follow|

			user = User.where(id: follow.followed_id).first
            {
                id: follow.followed_id,
                status: follow.status,
				username: user.username,
				email: user.email
            }
        end
        following
    end

	def followers data
		followers = Follow.where(followed_id: self.id).all.collect do |follow|

			user = User.where(id: follow.follower_id).first
            {
                id: follow.follower_id,
                status: follow.status,
				username: user.username,
				email: user.email
            }
        end
        followers
	end
end

class Post < Sequel::Model(DB[:posts])

    one_to_many         :comments,
                        :key   => :post_id,
                        :class => :Comment

	many_to_one 		:user,
						key: :user_id,
						class: :User

	many_to_many 		:bookmarked_by,
						left_key: :post_id,
						right_key: :user_id,
						join_table: :bookmarks,
						class: :User

	one_to_many 		:likes,
						key: :post_id,
						class: :Like

	many_to_many 		:liked_by,
						left_key: :post_id,
						right_key: :user_id,
						join_table: :likes,
						class: :User

    def create_comment data
		raise "comment something" if data[:comment].nil?
        comment = {
            name: data[:name],
            comment: data[:comment]
        }
        comment = self.add_comment(comment);
        comment.save
        comment
    end

    def update_post data
        raise "Title is Required" if data[:title].nil?
        raise "Provide some content" if data[:content].nil?
        # raise "image is required" if data[:pic].nil?
        raise "Category is required" if data[:category].nil?
        raise "Visibilty is required" if data[:visibility].nil?

        filename = nil
        if data[:pic] and data[:pic][:tempfile]
            fileptr = data[:pic][:tempfile]

            fileext = data[:pic][:type].split('/')[1]
            filename = "#{Util.getUniqueName}.#{fileext}"

            file_save_as = "#{$uploads_dir}/#{filename}"

            File.open(file_save_as, "wb") do |save_file|
                save_file.write(fileptr.read)
            end
        end

        post = {
            title: data[:title],
            content: data[:content],
            visibility: data[:visibility],
            category: data[:category],
            image_url: filename
        }

        self.update(post);
        post
    end

    def get_post
        post = Post.reverse(:created_at).where(id: self.id).all.collect do |post|
            {
				user_id: post.user_id,
                post_id: post.id,
                title: post.title,
                content: post.content,
                created_date: post.created_at,
                visibility: post.visibility,
                category: post.category,
                image_url: "#{$server_url}#{$uploads_path}#{post.values[:image_url]}"
            }
        end
        post
    end

    def delete_post
        raise "post is already deleted" if self.deleted_at
        self.delete
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

	def update_comment data
		raise "comment something" if data[:comment].nil?
		comment = {
            comment: data[:comment]
        }
        self.update(comment);
        comment
	end
end

class Follow < Sequel::Model(DB[:followers])
	many_to_many :follower, class: :User, key: :follower_id
	many_to_many :followed, class: :User, key: :followed_id
end

class Bookmark < Sequel::Model(DB[:bookmarks])
	many_to_one  :users, :key => :user_id, :class => :User
	many_to_one :posts, :key => :post_id, :class => :Post
end

class Like < Sequel::Model(DB[:likes])
	many_to_one  :users, :key => :user_id, :class => :User
	many_to_one :posts, :key => :post_id, :class => :Post
end