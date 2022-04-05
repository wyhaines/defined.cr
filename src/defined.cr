module Defined
  VERSION = "0.2.0"
end

# This macro accepts a string or a symbol of a fully qualified constant name.
# It validates whether the constant is defined, starting at the top level. The value
# of the constant will be returned if it is defined. If it is not defined, `false` is
# returned.
macro defined?(const)
  {%
    parts = [] of String
    position = @type
    const.id.gsub(/^::/, "").split("::").all? do |part|
      clean_part = part.tr(":", "").id
      parts << clean_part
      if position && position.has_constant?(clean_part.id)
        position = position.constant(clean_part.id)
      else
        position = false
      end
    end
  %}
  {% if position %}
    {{ parts.join("::").id }}
  {% else %}
    false
  {% end %}
end

macro if_defined?(const, &code)
  {%
    parts = [] of String
    position = @type
    const.id.gsub(/^::/, "").split("::").all? do |part|
      clean_part = part.tr(":", "").id
      parts << clean_part
      if position && position.has_constant?(clean_part.id)
        position = position.constant(clean_part.id)
      else
        position = false
      end
    end
  %}
  {% if position %}
    {{ code.body }}
  {% end %}
end

macro unless_defined?(const, &code)
  {%
    parts = [] of String
    position = @type
    const.id.gsub(/^::/, "").split("::").all? do |part|
      clean_part = part.tr(":", "").id
      parts << clean_part
      if position && position.has_constant?(clean_part.id)
        position = position.constant(clean_part.id)
      else
        position = false
      end
    end
  %}
  {% unless position %}
    {{ code.body }}
  {% end %}
end
