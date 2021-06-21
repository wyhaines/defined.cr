require "spec"
require "../src/defined"

class One; end

if_defined?(:One, <<-ECODE)
  class Two; end
ECODE

if_defined?(:Zero, <<-ECODE)
  class Three; end
ECODE
