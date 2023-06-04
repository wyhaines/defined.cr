module Defined
  {% begin %}
  VERSION = {{ read_file("#{__DIR__}/../VERSION").chomp }}
  {% end %}
end
