begin
    require_relative '../../.env.rb'
rescue LoadError => e
	puts e.message
end

require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'].to_sym)

disable :show_exceptions
disable :logging
disable :dump_errors

require_relative 'routes'

builder = Rack::Builder.new do
	use Rack::Cors do
		allow do
			origins '*'
			resource '*', :headers => :any, :methods => [:get, :post, :put, :delete, :options]
		end
	end

	use Rack::Reloader if ENV['RACK_ENV'] == 'development'

	run App.app
end

run builder.to_app
