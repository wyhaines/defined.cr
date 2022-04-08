require "spec"
require "../src/defined"

class One; end

if_defined?(:One) do
  class Two; end
end

if_defined?(:Zero) do
  class Three; end
end

class VerMe
  VERSION = "1.2.3"

  class Inner
    Version = "0.1.0"
  end
end

class Bar
  Version = "2.3.4"
end

class Bif
end

class DefinedTestResults
  Answers = {} of Symbol => Bool

  Answers[:fully_qualified_absolute_path] = false
  if_version?("VerMe::VERSION", :>, "1.0.0") do
    Answers[:fully_qualified_absolute_path] = true
  end

  Answers[:partially_qualified_absolute_path] = false
  if_version?("VerMe", :<, "2.0.0") do
    Answers[:partially_qualified_absolute_path] = true
  end

  Answers[:partially_qualified_absolute_path_with_mixed_case] = false
  if_version?("Bar", :==, "2.3.4") do
    Answers[:partially_qualified_absolute_path_with_mixed_case] = true
  end

  Answers[:no_false_positives] = false
  if_version?("Bif", :==, "1.0.0") do
    Answers[:no_false_positives] = true
  end

  Answers[:unless] = false
  unless_version?("VerMe", :>, "2.0.0") do
    Answers[:unless] = true
  end
end

DefinedTestResults::Answers[:partially_qualified_relative_path] = false

class VerMe
  if_version?("Inner", :>=, "0.1.0") do
    DefinedTestResults::Answers[:partially_qualified_relative_path] = true
  end
end

DefinedTestResults::Answers[:spec_defined_a] = false
if_enabled?("SPEC_DEFINED_A") do
  DefinedTestResults::Answers[:spec_defined_a] = true
end

DefinedTestResults::Answers[:spec_defined_b] = false
unless_enabled?("SPEC_DEFINED_B") do
  DefinedTestResults::Answers[:spec_defined_b] = true
end

DefinedTestResults::Answers[:spec_defined_c] = false
if_disabled?("SPEC_DEFINED_C") do
  DefinedTestResults::Answers[:spec_defined_c] = true
end

DefinedTestResults::Answers[:spec_defined_d] = false
unless_disabled?("SPEC_DEFINED_D") do
  DefinedTestResults::Answers[:spec_defined_d] = true
end
