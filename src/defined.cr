require "./version"

# This macro accepts a consonant, or a string or symbol of the consonant name.
# It validates whether the constant is defined, starting at the top level. The value
# of the constant will be returned if it is defined. If it is not defined, `false` is
# returned.
#
# ```
# has_db = defined?("DB")
#
# puts "Yes, DB was required." if has_db
# ```
#
macro defined?(const)
  {%
    parts = [] of String
    if const.id =~ /^\s*::/
      positions = [@top_level]
    else
      positions = [@type, @top_level]
    end

    found_position = false
    do_break = false
    positions.each do |position|
      unless do_break
        const.id.gsub(/^::/, "").split("::").all? do |part|
          clean_part = part.tr(":", "").id
          parts << clean_part
          if position && position.has_constant?(clean_part.id)
            found_position = position.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end
  %}
  {% if found_position %}
    {{ parts.join("::").id }}
  {% else %}
    false
  {% end %}
end

# This macro accepts a constant, or a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. If the
# constant is defined, the code passed to the macro via a block will be instantiated.
# This permits conditional code evaluation based on whether a constant is defined.
#
# ```
# if_defined?("MyClass::FeatureFlag") do
#   Log.info { "MyClass::FeatureFlag has been enabled" }
# end
# ```
#
macro if_defined?(const, &code)
  {%
    parts = [] of String
    if const.id =~ /^\s*::/
      positions = [@top_level]
    else
      positions = [@type, @top_level]
    end

    found_position = false
    do_break = false
    positions.each do |position|
      unless do_break
        const.id.gsub(/^::/, "").split("::").all? do |part|
          clean_part = part.tr(":", "").id
          parts << clean_part
          if position && position.has_constant?(clean_part.id)
            found_position = position.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end
  %}
  {% if found_position %}
    {{ code.body }}
  {% end %}
end

# This macro accepts a constant, or a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. If the
# constant is not defined, the code passed to the macro via a block will be instantiated.
# This permits conditional code evaluation based on whether a constant is defined.
#
# ```
# unless_defined?("SpecialLibrary") do
#   Workaround.configure
# end
# ```
#
macro unless_defined?(const, &code)
  {%
    parts = [] of String
    if const.id =~ /^\s*::/
      positions = [@top_level]
    else
      positions = [@type, @top_level]
    end

    found_position = false
    do_break = false
    positions.each do |position|
      unless do_break
        const.id.gsub(/^::/, "").split("::").all? do |part|
          clean_part = part.tr(":", "").id
          parts << clean_part
          if position && position.has_constant?(clean_part.id)
            found_position = position.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end
  %}
  {% unless found_position %}
    {{ code.body }}
  {% end %}
end

# This macro accepts a constant, or a string or a symbol of a fully qualified constant name.
# This constant will be checked for a `VERSION` or a `Version` constant, or a
# `#version` method under it. If it exists, the value held by that constant, or
# returned by the `#version` method is compared with the provided comparison operator
# to the value, using a SemanticVersion comparison.
#
# ```
# if_version?("Crystal", :>, "1.0.0") do
#   # Do a thing that only works on Crystal 1.0.0 and later
# end
# ```
#
# #### Caveats
#
# If the version is defined using a macro expression (macro code enclosed in a `{{ ... }}` block),
# things become more difficult. The `compare_versions` macro expects to to receive a StringLiteral,
# SymbolLiteral, or MacroID. If it receives a MacroExpression, it can not evaluate that expression
# to access the value that it returns, and an exception is thrown when the macro is evaluated.
# To make things more interesting, there is no way to force that MacroExpression to be expanded
# from within macro code, making it difficult to access the value. So, for instance, if there were
# the following version definition:
#
# ```
# class Foo
#   VERSION = {{ `shards version "#{__DIR__}"`.chomp.stringify }}
# end
# ```
#
# Then the `if_version?` macro would not be able to access the value of `VERSION` because it
# would be a MacroExpression.
#
# This library does have a workaround for that situation, which will work for simple cases like the
# above example, however. Essentially, when it encounters a MacroExpression, it reformulates the
# constant into the local scope, with evaluation wrapped by a `{% begin %} ... {% end %}` block.
# Wrapping the macro expression in that way ensures that the value of the expression is already
# assigned to the constant when the `if_version?` macro is evaluated.
# So, `if_version?` used on Foo, might look like this:
#
# ```
# if_version?("Foo", :>, "1.0.0") do
#   # Awesome. That's a great version of Foo!
# end
# ```
#
# The macro will rewrite that to look something like this:
#
# ```
# {% begin %}
# X__temp_731 = {{ `shards version "#{__DIR__}"`.chomp.stringify }}
# {% end %}
# if_version?("Foo", :>, "1.0.0") do
#   # Awesome. That's a great version of Foo!
# end
# ```
#
# And this *will* work.
#
macro if_version?(const, comparison, value, &code)
  {%
    parts = [] of String
    if const.id =~ /^\s*::/
      positions = [@top_level]
    else
      positions = [@type, @top_level]
    end

    found_position = false
    do_break = false
    positions.each do |position|
      unless do_break
        const.id.gsub(/^::/, "").split("::").all? do |part|
          clean_part = part.tr(":", "").id
          parts << clean_part
          if position && position.resolve.has_constant?(clean_part.id)
            found_position = position.resolve.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end

    result = false
    do_nested_version = false
    full_const = nil
    if found_position
      if found_position.is_a?(StringLiteral)
        version = found_position
      elsif found_position.resolve.has_constant?(:VERSION)
        full_const = "#{const.id}::VERSION"
        version = found_position.resolve.constant(:VERSION)
      elsif found_position.resolve.has_constant?(:Version)
        full_const = "#{const.id}::Version"
        version = found_position.resolve.constant(:Version)
      else
        version = false
      end

      if version.is_a?(MacroExpression)
        do_nested_version = true
      elsif version
        cmpx = compare_versions(version, value)
        if comparison.id == ">"
          result = cmpx == 1
        elsif comparison.id == ">="
          result = cmpx >= 0
        elsif comparison.id == "<"
          result = cmpx == -1
        elsif comparison.id == "<="
          result = cmpx <= 0
        elsif comparison.id == "==" || comparison.id == "="
          result = cmpx == 0
        end
      end
    end
  %}
  {% if do_nested_version %}
    \{% begin %}
    {{ "X".id }}%cnst = {{ version.id }}
    \{% end %}
    if_version?( {{ "X".id }}%cnst, {{ comparison }}, {{ value.stringify.id }}) do
      {{ code.body }}
    end
  {% elsif result %}
    {{ code.body }}
  {% end %}
end

# See the documentation for `#if_version?`.
#
macro unless_version?(const, comparison, value, &code)
  {%
    parts = [] of String
    if const.id =~ /^\s*::/
      positions = [@top_level]
    else
      positions = [@type, @top_level]
    end

    found_position = false
    do_break = false
    positions.each do |position|
      unless do_break
        const.id.gsub(/^::/, "").split("::").all? do |part|
          clean_part = part.tr(":", "").id
          parts << clean_part
          if position && position.resolve.has_constant?(clean_part.id)
            found_position = position.resolve.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end

    result = false
    do_nested_version = false
    full_const = nil
    if found_position
      if found_position.is_a?(StringLiteral)
        version = found_position
      elsif found_position.resolve.has_constant?(:VERSION)
        full_const = "#{const.id}::VERSION"
        version = found_position.resolve.constant(:VERSION)
      elsif found_position.resolve.has_constant?(:Version)
        full_const = "#{const.id}::Version"
        version = found_position.resolve.constant(:Version)
      else
        version = false
      end

      if version.is_a?(MacroExpression)
        do_nested_version = true
      elsif version
        cmpx = compare_versions(version, value)
        if comparison.id == ">"
          result = cmpx == 1
        elsif comparison.id == ">="
          result = cmpx >= 0
        elsif comparison.id == "<"
          result = cmpx == -1
        elsif comparison.id == "<="
          result = cmpx <= 0
        elsif comparison.id == "==" || comparison.id == "="
          result = cmpx == 0
        end
      end
    end
  %}
  {% if do_nested_version %}
    \{% begin %}
    {{ "X".id }}%cnst = {{ version.id }}
    \{% end %}
    unless_version?( {{ "X".id }}%cnst, {{ comparison }}, {{ value.stringify.id }}) do
      {{ code.body }}
    end
  {% elsif !result %}
    {{ code.body }}
  {% end %}
end

# Instantiate the code that is passed in the block only if the `env_var` environment
# variable is set.
macro if_enabled?(env_var, &block)
  {% val = env(env_var) %}
  {% if val && val != "0" && val != "false" %}
    {{ block.body }}
  {% end %}
end

# Instantiate the code that is passed in the block only if the `env_var` environment
# variable is not set.
macro unless_enabled?(env_var, &block)
  {% val = env(env_var) %}
  {% unless val && val != "0" && val != "false" %}
    {{ block.body }}
  {% end %}
end

# Instantiate the code that is passed in the block only if the `env_var` environment
# is set to a false value.
macro if_disabled?(env_var, &block)
  {% val = env(env_var) %}
  {% if val && (val == "0" || val == "false") %}
    {{ block.body }}
  {% end %}
end

# Instantiate the code that is passed in the block only if the `env_var` environment
# variable is set.
macro unless_disabled?(env_var, &block)
  {% val = env(env_var) %}
  {% unless val && (val == "0" || val == "false") %}
    {{ block.body }}
  {% end %}
end
