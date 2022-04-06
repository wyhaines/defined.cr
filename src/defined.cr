module Defined
  VERSION = "0.3.0"
end

# This macro accepts a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. The value
# of the constant will be returned if it is defined. If it is not defined, `false` is
# returned.
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

# This macro accepts a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. If the
# constant is defined, the code passed to the macro via a block will be instantiated.
# This permits conditional code evaluation based on whether a constant is defined.
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

# This macro accepts a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. If the
# constant is not defined, the code passed to the macro via a block will be instantiated.
# This permits conditional code evaluation based on whether a constant is defined.
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

# This macro accepts a string or a symbol of a fully qualified constant name.
# This constant will be checked for a `VERSION` or a `Version` constant, or a
# `#version` method under it. If it exists, the value held by that constant, or
# returned by the `#version` method is compared with the provided comparison operator
# to the value, using a SemanticVersion comparison.
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
          if position && position.has_constant?(clean_part.id)
            found_position = position.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end

    result = false
    if found_position
      if found_position.is_a?(StringLiteral)
        version = found_position
      elsif found_position.has_constant?(:VERSION)
        version = found_position.constant(:VERSION)
      elsif found_position.has_constant?(:Version)
        version = found_position.constant(:Version)
      else
        version = false
      end

      if version
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
  {% if result %}
    {{ code.body }}
  {% end %}
end

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
          if position && position.has_constant?(clean_part.id)
            found_position = position.constant(clean_part.id)
            do_break = true
          else
            position = false
          end
        end
      end
    end

    result = false
    if found_position
      if found_position.is_a?(StringLiteral)
        version = found_position
      elsif found_position.has_constant?(:VERSION)
        version = found_position.constant(:VERSION)
      elsif found_position.has_constant?(:Version)
        version = found_position.constant(:Version)
      else
        version = false
      end

      if version
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
  {% unless result %}
    {{ code.body }}
  {% end %}
end
