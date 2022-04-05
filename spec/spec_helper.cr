require "spec"
require "../src/defined"

class One; end

if_defined?(:One) do
  class Two; end
end

if_defined?(:Zero) do
  class Three; end
end
