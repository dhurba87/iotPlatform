$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "freeboard/rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "freeboard-rails"
  s.version     = Freeboard::Rails::VERSION
  s.authors     = ["Dhurba Baral"]
  s.email       = ["dhurba87@gmail.com"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of Freeboard::Rails."
  s.description = "TODO: Description of Freeboard::Rails."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.0.0", ">= 5.0.0.1"
end
