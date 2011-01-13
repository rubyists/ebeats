# This file contains your application, it requires dependencies and necessary
# parts of the application.
#
# It will be required from either `config.ru` or `start.rb`

require 'rubygems'
require 'ramaze'
require_relative "../beats/lib/beat"
require "beat/time"

Ramaze.middleware! do |m|
  m.use Rack::CommonLogger, Ramaze::Log
  m.use Rack::ShowExceptions
  m.use Rack::ShowStatus
  m.use Rack::RouteExceptions
  m.use Rack::ContentLength
  m.use Rack::Coffee, root: 'public', urls: ['/coffee']
  m.use Rack::ETag, 'public'
  m.use Rack::Head
  m.use Rack::ConditionalGet
  m.use Ramaze::Reloader
  m.run Ramaze::AppMap
end


# Make sure that Ramaze knows where you are
Ramaze.options.roots = [__DIR__]

# Initialize controllers and models
require_relative 'model/init'
require_relative 'controller/init'
