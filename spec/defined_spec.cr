require "./spec_helper"

describe Defined do
  it "can find an existing constant, specified with a Symbol" do
    defined?(:String).should be_truthy
  end

  it "can find an existing constant, specified with a String" do
    defined?("Int::Primitive").should be_truthy
  end

  it "returns false when something isn't defined" do
    defined?("This::Thing::Does::Not::Exist").should be_false
  end

  it "deals with a :: at the start of the constant name" do
    defined?("::Foo::Bar").should be_false
    defined?("::Hash").should be_truthy
  end

  it "if_defined? can be used to do things like dynamically create a class" do
    defined?("::Two")
  end

  it "if_version? can check a version in a fully qualified absolute class path" do
    DefinedTestResults::Answers[:fully_qualified_absolute_path].should be_true
  end

  it "if_version? can check a version in partially qualified absolute class path" do
    DefinedTestResults::Answers[:partially_qualified_absolute_path].should be_true
  end

  it "if_version? can check a version in a partially qualified absolute class path with mixed case" do
    DefinedTestResults::Answers[:partially_qualified_absolute_path_with_mixed_case].should be_true
  end

  it "if_version? shouldn't generate false positives" do
    DefinedTestResults::Answers[:no_false_positives].should be_false
  end

  it "if_version? can check a version in a partially qualified relative class path" do
    DefinedTestResults::Answers[:partially_qualified_relative_path].should be_true
  end

  it "unless_version? works as expected" do
    DefinedTestResults::Answers[:unless].should be_true
  end

  it "if_enabled? works as expected" do
    DefinedTestResults::Answers[:spec_defined_a].should be_false
  end

  it "unless_enabled? works as expected" do
    DefinedTestResults::Answers[:spec_defined_b].should be_true
  end

  it "if_disabled? works as expected" do
    DefinedTestResults::Answers[:spec_defined_c].should be_true
  end

  it "unless_disabled? works as expected" do
    DefinedTestResults::Answers[:spec_defined_d].should be_false
  end

  it "can take class names that don't even exist" do
    unless_defined?(ClassName::NotDefined) do
      true.should be_true
    end
  end

  it "if_version? can handle a constant that resolves back to a MacroVersion" do
    DefinedTestResults::Answers[:workaround_if].should be_true
  end

  it "unless_version? can handle a constant that resolves back to a MacroVersion" do
    DefinedTestResults::Answers[:workaround_unless].should be_true
  end
end
