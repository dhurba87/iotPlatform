module Freeboard
  module Rails
    class Engine < ::Rails::Engine
      config.local_public_freeboard_path = File.join(root, "public", "freeboard").to_s

      # Initializer to combine this engines static assets with the static assets of the hosting site.
      initializer "static assets" do |app|
        app.middleware.insert_before(::ActionDispatch::Static, ::ActionDispatch::Static, "#{root}/public")
      end
      config.assets.enabled = false
    end
  end
end
