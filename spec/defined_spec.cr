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
end
