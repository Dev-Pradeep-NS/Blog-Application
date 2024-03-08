class App < Roda
    plugin :indifferent_params
	plugin :json

    def indifferent_data(data)
		case data
		when Hash
			hash = Hash.new{|h, k| h[k.to_s] if Symbol === k}
			data.each{|k, v| hash[k] = indifferent_data(v)}
			hash
		when Array
			data.map{|x| indifferent_data(x)}
		else
			data
		end
	end
    
end