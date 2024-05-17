begin
	require_relative '../../.env.rb'
rescue LoadError => e
	puts e.message
end

require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'].to_sym)

%w(
    defaults
    models
).each { |lib| require_relative lib }

class App < Roda
    plugin :render
    plugin :json

    route do |r|
        body = request.body.read
		request.body.rewind
		data = JSON.parse(body) rescue {}
        data = indifferent_data(data)

        r.root do
            puts "Blog Application"
        end

        r.post "register" do
            ret = User.register data
            {
                values: ret,
                success: true
            }
        end

        r.post "login" do
            ret = User.login data
            {
                values: ret,
                success: true
            }
        end

		r.on "posts/getall" do
			r.get do
				ret = Post.get_all
				{
					values: ret,
					success: true
				}
			end
		end

        r.on "user" do
			r.on Integer do |id|
				user = User[id.to_i]
				raise "user not found" if !user

				r.get "posts" do
					ret = user.get_all
                    {
                        values: ret,
                        success: true
                    }
				end
			end

            token = data[:an_token] || nil
            raise "No token." if token.nil?

            @user = User.find(token: token)
            raise "only registered users are allowed" if !@user

			r.on "follow" do
				r.post do
					ret = Follow.follow data
					{
						values: ret,
						success: true
					}
				end
			end

			r.on "following" do
				r.get do
					ret = Follow.following(@user.id)
					{
						values: ret,
						success: true
					}
				end
			end

			r.on "followers" do
				r.get do
					ret = Follow.followers(@user.id)
					{
						values: ret,
						success: true
					}
				end
			end

            r.on "post" do
                r.post "create" do
                    ret = @user.create_post data
                    {
                        values: ret,
                        success: true
                    }
                end

                r.on Integer do |post_id|
                    post = Post[post_id.to_i]
                    raise 'Invalid Post' if !post

                    r.get do
                        ret = post.get_post
                        {
                            values: ret,
                            success: true
                        }
                    end

                    r.post do
                        ret = post.update_post data

                        {
                            values: ret,
                            success: true
                        }
                    end

                    r.delete do
                        post.delete_post
                        {
                            success: true
                        }
                    end
                end

				r.on "bookmark" do
					r.post do
						ret = @user.add_bookmarked_post data
						{
							values: ret,
							success: true
						}
					end

					r.delete do
						ret = @user.remove_bookmarked_post data
						{
							values: ret,
							success: true
						}
					end

					r.get do
						ret = @user.get_bookmarked_list
						{
							values: ret,
							success: true
						}
					end
				end

				r.on "like" do
					ret = @user.like_post data
					{
						values: ret,
						succes: true
					}
				end
            end
        end

        r.on "post" do
            r.on "comments" do
				r.on Integer do |comment_id|
					comment = Comment[comment_id.to_i]
					raise "No comments" if !comment

					r.post do
						ret = comment.update_comment data
						{
							values: ret,
							success: true
						}
					end
				end

                id = data[:post_id] || nil
                raise "No id." if id.nil?

                @post = Post.find(id: id)
                raise "Create Post First" if !@post

                r.get do
                    ret = @post.get_all_comments
                    {
                        values: ret,
                        success: true
                    }
                end

                r.post "create" do
                    ret = @post.create_comment data

                    {
                        values: ret,
                        success: true
                    }
                end
            end
        end
    end
end