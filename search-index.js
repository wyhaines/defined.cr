crystal_doc_search_index_callback({"repository_name":"defined","body":"# defined\n\n![Defined.cr CI](https://img.shields.io/github/workflow/status/wyhaines/defined.cr/defined.cr%20CI?style=for-the-badge&logo=GitHub)\n[![GitHub release](https://img.shields.io/github/release/wyhaines/defined.cr.svg?style=for-the-badge)](https://github.com/wyhaines/defined.cr/releases)\n![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/wyhaines/defined.cr/latest?style=for-the-badge)\n\nThis shard provides a variety of macros that can be used to check, at compile time, if a\ngiven constant is defined, and also to conditionally compile code based on whether a\nconstant is or is not defined, whether a VERSION meets a requirement, or whether an\nenvironment variable is or is not defined.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n   ```yaml\n   dependencies:\n     defined:\n       github: wyhaines/defined.cr\n   ```\n\n2. Run `shards install`\n\n## Usage\n\n```crystal\nrequire \"defined\"\n```\n\n### Constant Check Macro Notes\n\nThe constant check that of of the constant validation macros (`defined?`, `if_defined?`, `unless_defined?`) use first checks for the constant relative to the type that the macro is\nrunning in, and then if it doesn't find it there, it checks starting at the top level, with\none exception. If the class name starts with a `::` then the check only operates from the\ntop level. The class name can be provided as a String, a Symbol, or as a bare Class reference.\n\n\ni.e.\n\n```crystal\nif_defined?(\"Int32\") do\n  puts \"This will always work\"\nend\n\nunless_defined?(ClassName::That::Does::Not::Exist) do\n  puts \"This works, too. Cool.\"\nend\n```\n\n#### defined?\n\n```crystal\nif defined?(OptionalFeature)\n  # The OptionalFeature library has been included into the code, so use it.\nelse\n  # It's not there.\nend\n\nstuff = defined?(My::Stuff::Library) || Array(String)\n```\n\n#### if_defined?\n\n```crystal\nrequire \"defined\"\n\nclass One; end\n\nif_defined?(One) do\n  class Two\n    def call\n      \"I am class Two, but I can only exist of class one is defined.\"\n    end\n  end\nend\n\nputs Two.new.call\n```\n\n#### unless_defined?\n\n```crystal\nunless_defined?(PerfectShard) do\n  require \"project/imperfect_shard\"\nend\n```\n\n### Version Checks\n\nThe version check macros leverage the same constant lookup code as the constant check macros, but they automatically search for a `VERSION` or a `Version` constant under that namespace, unless the provided constant resolves to a `String`.\n\n#### if_version? and unless_version?\n\n```crystal\nclass VerMe\n  VERSION = \"1.2.3\"\n\n  class Inner\n    Version = \"0.1.0\"\n  end\n\n  class SecondInner\n    ClassVersion = \"0.3.7\"\n  end\nend\n\nif_version?(VerMe, :>=, \"1.2.0\") do\n  puts \"This will only run if the version of VerMe is >= 1.2.0\"\nend\n\nif_version?(VerMe::Inner, :>=, \"0.1.0\") do\n  puts \"This will only run if the version of VerMe::Inner is >= 0.1.0\"\nend\n\nunless_version?(VerMe::SecondInner::ClassVersion, :>=, \"0.4.0\") do\n  puts \"This also works. Hey, maybe you need a new version of that class?\"\nend\n\nclass VerMe\n  if_version?(Inner, :<, \"0.2.0\") do\n    puts \"WARNING -- Using version of Inner less than 0.2.0 is deprecated, and support will be removed\"\n  end\nend\n\nclass MacrosAreTough\n  VERSION = {{ `shards version \"#{__DIR__}\"`.chomp.stringify }}\nend\n\nif_version?(MacrosAreTough, :>=, \"0.1.0\") do\n  puts \"This will only run if the version of MacrosAreTough is >= 0.1.0\"\nend\n```\n\nThe last example, with `MacrosAreTough`, [deserves additional explanation](https://wyhaines.github.io/defined.cr/toplevel.html#if_version%3F%28const%2Ccomparison%2Cvalue%2C%26code%29-macro), because inline macro expressions\nlike that pose a particular challenge for the library, and there are some edge cases.\n\n### Environment Variable Checks\n\nThis facility provides four very simple macros (`if_enabled?`, `unless_enabled?`, `if_disabled?`, `unless_disabled?`) which can be used to conditionally compile code based on whether an environment variable is set, or not. The macros use a shell based definition of truthy and falsey, so `0` and `false` and `\"\"` are considered false, while all other values are true.\n\n`if_enabled?` instantiates the code in the provided block if the environment variable exists, and is set to\na shell truthy value.\n\n`unless_enabled?` instantiates the code in the provided block if the environment variable does not exist, or is set to a shell falsey value.\n\n`if_disabled?` instantiates the code in the provided block if the environment variable des not exist, or is set to a shell falsey value.\n\n`unless_disabled?` instantiates the code in the provided block if the environment variable exists, and is set to a shell truthy value.\n\n```crystal\nif_enabled?(\"ENV_VAR\") do\n  puts \"This will only run if the environment variable ENV_VAR is set to a truthy value\"\nend\n\nunless_enabled?(\"ENV_VAR\") do\n  puts \"This will only run if the environment variable ENV_VAR is not set to a truthy value\"\nend\n\nif_disabled?(\"ENV_VAR\") do\n  puts \"This will only run if the environment variable ENV_VAR is not set to a truthy value\"\nend\n\nunless_disabled?(\"ENV_VAR\") do\n  puts \"This will only run if the environment variable ENV_VAR is set to a truthy value\"\nend\n```\n\n## More Documentation\n\n[https://wyhaines.github.io/defined.cr/toplevel.html](https://wyhaines.github.io/defined.cr/toplevel.html)\n\n## Contributing\n\n1. Fork it (<https://github.com/wyhaines/defined.cr/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Kirk Haines](https://github.com/wyhaines) - creator and maintainer\n\n![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wyhaines/defined.cr?style=for-the-badge)\n![GitHub issues](https://img.shields.io/github/issues/wyhaines/defined.cr?style=for-the-badge)\n","program":{"html_id":"defined/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"locations":[],"repository_name":"defined","program":true,"enum":false,"alias":false,"const":false,"macros":[{"html_id":"defined?(const)-macro","name":"defined?","doc":"This macro accepts a consonant, or a string or symbol of the consonant name.\nIt validates whether the constant is defined, starting at the top level. The value\nof the constant will be returned if it is defined. If it is not defined, `false` is\nreturned.\n\n```\nhas_db = defined?(\"DB\")\n\nputs \"Yes, DB was required.\" if has_db\n```\n","summary":"<p>This macro accepts a consonant, or a string or symbol of the consonant name.</p>","abstract":false,"args":[{"name":"const","external_name":"const","restriction":""}],"args_string":"(const)","args_html":"(const)","location":{"filename":"src/defined.cr","line_number":14,"url":null},"def":{"name":"defined?","args":[{"name":"const","external_name":"const","restriction":""}],"visibility":"Public","body":"  \n{% if const.id =~ (/^\\s*::/)\n  positions = [@top_level]\nelse\n  positions = [@type, @top_level]\nend %}\n\n  \n{% found_position = nil\nposition = nil\nparts = [] of String\ndo_break = false\npositions.each do |starting_position|\n  unless do_break\n    inner_do_break = false\n    parts = [] of String\n    clean_part = const.id.gsub(/^::/, \"\")\n    full_part = (\"#{starting_position}::#{clean_part}\".gsub(/^(main::|<Program>::)/, \"\")).id\n    position = @top_level\n    (full_part.split(\"::\")).each do |part|\n      unless inner_do_break\n        if position.has_constant?(part.id)\n          position = position.constant(part.id)\n          parts << part\n        else\n          position = nil\n          parts = [] of String\n          inner_do_break = true\n        end\n      end\n    end\n    if position\n      do_break = true\n    end\n  end\nend\nif !parts.empty?\n  found_position = parse_type(parts.join(\"::\"))\nend\n %}\n\n  \n{% if found_position %}\n    {{ found_position }}\n  {% else %}\n    false\n  {% end %}\n\n\n"}},{"html_id":"if_defined?(const,&code)-macro","name":"if_defined?","doc":"This macro accepts a constant, or a string or a symbol of a fully qualified constant name.\nIt validates whether the constant is defined, starting at the top level. If the\nconstant is defined, the code passed to the macro via a block will be instantiated.\nThis permits conditional code evaluation based on whether a constant is defined.\n\n```\nif_defined?(\"MyClass::FeatureFlag\") do\n  Log.info { \"MyClass::FeatureFlag has been enabled\" }\nend\n```\n","summary":"<p>This macro accepts a constant, or a string or a symbol of a fully qualified constant name.</p>","abstract":false,"args":[{"name":"const","external_name":"const","restriction":""}],"args_string":"(const, &code)","args_html":"(const, &code)","location":{"filename":"src/defined.cr","line_number":73,"url":null},"def":{"name":"if_defined?","args":[{"name":"const","external_name":"const","restriction":""}],"block_arg":{"name":"code","external_name":"code","restriction":""},"visibility":"Public","body":"  \n{% if const.id =~ (/^\\s*::/)\n  positions = [@top_level]\nelse\n  positions = [@type, @top_level]\nend %}\n\n  \n{% found_position = nil\nposition = nil\nparts = [] of String\ndo_break = false\npositions.each do |starting_position|\n  unless do_break\n    inner_do_break = false\n    parts = [] of String\n    clean_part = const.id.gsub(/^::/, \"\")\n    full_part = (\"#{starting_position}::#{clean_part}\".gsub(/^(main::|<Program>::)/, \"\")).id\n    position = @top_level\n    (full_part.split(\"::\")).each do |part|\n      unless inner_do_break\n        if position.has_constant?(part.id)\n          position = position.constant(part.id)\n          parts << part\n        else\n          position = nil\n          parts = [] of String\n          inner_do_break = true\n        end\n      end\n    end\n    if position\n      do_break = true\n    end\n  end\nend\nif !parts.empty?\n  found_position = parse_type(parts.join(\"::\"))\nend\n %}\n\n  \n{% if found_position %}\n    {{ code.body }}\n  {% end %}\n\n\n"}},{"html_id":"if_disabled?(env_var,&block)-macro","name":"if_disabled?","doc":"Instantiate the code that is passed in the block only if the `env_var` environment\nis not set.","summary":"<p>Instantiate the code that is passed in the block only if the <code>env_var</code> environment is not set.</p>","abstract":false,"args":[{"name":"env_var","external_name":"env_var","restriction":""}],"args_string":"(env_var, &block)","args_html":"(env_var, &block)","location":{"filename":"src/defined.cr","line_number":429,"url":null},"def":{"name":"if_disabled?","args":[{"name":"env_var","external_name":"env_var","restriction":""}],"block_arg":{"name":"block","external_name":"block","restriction":""},"visibility":"Public","body":"  \n{% val = env(env_var) %}\n\n  \n{% if ((val && (val != \"0\")) && (val != \"false\")) && (!val.empty?) %}{% else %}\n    {{ block.body }}\n  {% end %}\n\n\n"}},{"html_id":"if_enabled?(env_var,&block)-macro","name":"if_enabled?","doc":"Instantiate the code that is passed in the block only if the `env_var` environment\nvariable is set.","summary":"<p>Instantiate the code that is passed in the block only if the <code>env_var</code> environment variable is set.</p>","abstract":false,"args":[{"name":"env_var","external_name":"env_var","restriction":""}],"args_string":"(env_var, &block)","args_html":"(env_var, &block)","location":{"filename":"src/defined.cr","line_number":411,"url":null},"def":{"name":"if_enabled?","args":[{"name":"env_var","external_name":"env_var","restriction":""}],"block_arg":{"name":"block","external_name":"block","restriction":""},"visibility":"Public","body":"  \n{% val = env(env_var) %}\n\n  \n{% if ((val && (val != \"0\")) && (val != \"false\")) && (!val.empty?) %}\n    {{ block.body }}\n  {% end %}\n\n\n"}},{"html_id":"if_version?(const,comparison,value,&code)-macro","name":"if_version?","doc":"This macro accepts a constant, or a string or a symbol of a fully qualified constant name.\nThis constant will be checked for a `VERSION` or a `Version` constant, or a\n`#version` method under it. If it exists, the value held by that constant, or\nreturned by the `#version` method is compared with the provided comparison operator\nto the value, using a SemanticVersion comparison.\n\n```\nif_version?(\"Crystal\", :>, \"1.0.0\") do\n  # Do a thing that only works on Crystal 1.0.0 and later\nend\n```\n\n#### Caveats\n\nIf the version is defined using a macro expression (macro code enclosed in a `{{ ... }}` block),\nthings become more difficult. The `compare_versions` macro expects to to receive a StringLiteral,\nSymbolLiteral, or MacroID. If it receives a MacroExpression, it can not evaluate that expression\nto access the value that it returns, and an exception is thrown when the macro is evaluated.\nTo make things more interesting, there is no way to force that MacroExpression to be expanded\nfrom within macro code, making it difficult to access the value. So, for instance, if there were\nthe following version definition:\n\n```\nclass Foo\n  VERSION = {{ `shards version \"#{__DIR__}\"`.chomp.stringify }}\nend\n```\n\nThen the `if_version?` macro would not be able to access the value of `VERSION` because it\nwould be a MacroExpression.\n\nThis library does have a workaround for that situation, which will work for simple cases like the\nabove example, however. Essentially, when it encounters a MacroExpression, it reformulates the\nconstant into the local scope, with evaluation wrapped by a `{% begin %} ... {% end %}` block.\nWrapping the macro expression in that way ensures that the value of the expression is already\nassigned to the constant when the `if_version?` macro is evaluated.\nSo, `if_version?` used on Foo, might look like this:\n\n```\nif_version?(\"Foo\", :>, \"1.0.0\") do\n  # Awesome. That's a great version of Foo!\nend\n```\n\nThe macro will rewrite that to look something like this:\n\n```\n{% begin %}\nX__temp_731 = {{ `shards version \"#{__DIR__}\"`.chomp.stringify }}\n{% end %}\nif_version?(\"Foo\", :>, \"1.0.0\") do\n  # Awesome. That's a great version of Foo!\nend\n```\n\nAnd this *will* work.\n","summary":"<p>This macro accepts a constant, or a string or a symbol of a fully qualified constant name.</p>","abstract":false,"args":[{"name":"const","external_name":"const","restriction":""},{"name":"comparison","external_name":"comparison","restriction":""},{"name":"value","external_name":"value","restriction":""}],"args_string":"(const, comparison, value, &code)","args_html":"(const, comparison, value, &code)","location":{"filename":"src/defined.cr","line_number":233,"url":null},"def":{"name":"if_version?","args":[{"name":"const","external_name":"const","restriction":""},{"name":"comparison","external_name":"comparison","restriction":""},{"name":"value","external_name":"value","restriction":""}],"block_arg":{"name":"code","external_name":"code","restriction":""},"visibility":"Public","body":"  \n{% if const.id =~ (/^\\s*::/)\n  positions = [@top_level]\nelse\n  positions = [@type, @top_level]\nend %}\n\n  \n{% found_position = nil\nposition = nil\nparts = [] of String\ndo_break = false\npositions.each do |starting_position|\n  unless do_break\n    inner_do_break = false\n    parts = [] of String\n    clean_part = const.id.gsub(/^::/, \"\")\n    full_part = (\"#{starting_position}::#{clean_part}\".gsub(/^(main::|<Program>::)/, \"\")).id\n    position = @top_level\n    (full_part.split(\"::\")).each do |part|\n      unless inner_do_break\n        if position.has_constant?(part.id)\n          position = position.constant(part.id)\n          parts << part\n        else\n          position = nil\n          parts = [] of String\n          inner_do_break = true\n        end\n      end\n    end\n    if position\n      do_break = true\n    end\n  end\nend\nif !parts.empty?\n  found_position = parse_type(parts.join(\"::\"))\nend\nresult = false\ndo_nested_version = false\nfull_const = nil\nif found_position\n  if found_position.resolve.is_a?(StringLiteral)\n    version = found_position.resolve\n  else\n    if found_position.resolve.has_constant?(:VERSION)\n      full_const = \"#{const.id}::VERSION\"\n      version = found_position.resolve.constant(:VERSION)\n    else\n      if found_position.resolve.has_constant?(:Version)\n        full_const = \"#{const.id}::Version\"\n        version = found_position.resolve.constant(:Version)\n      else\n        version = false\n      end\n    end\n  end\n  if version.is_a?(MacroExpression)\n    do_nested_version = true\n  else\n    if version\n      cmpx = compare_versions(version, value)\n      if comparison.id == \">\"\n        result = cmpx == 1\n      else\n        if comparison.id == \">=\"\n          result = cmpx >= 0\n        else\n          if comparison.id == \"<\"\n            result = cmpx == -1\n          else\n            if comparison.id == \"<=\"\n              result = cmpx <= 0\n            else\n              if (comparison.id == \"==\") || (comparison.id == \"=\")\n                result = cmpx == 0\n              end\n            end\n          end\n        end\n      end\n    end\n  end\nend\n %}\n\n  \n{% if do_nested_version %}\n    \\{% begin %}\n    {{ \"X\".id }}%cnst = {{ version.id }}\n    \\{% end %}\n    if_version?( {{ \"X\".id }}%cnst, {{ comparison }}, {{ value.stringify.id }}) do\n      {{ code.body }}\n    end\n  {% else %}{% if result %}\n    {{ code.body }}\n  {% end %}{% end %}\n\n\n"}},{"html_id":"unless_defined?(const,&code)-macro","name":"unless_defined?","doc":"This macro accepts a constant, or a string or a symbol of a fully qualified constant name.\nIt validates whether the constant is defined, starting at the top level. If the\nconstant is not defined, the code passed to the macro via a block will be instantiated.\nThis permits conditional code evaluation based on whether a constant is defined.\n\n```\nunless_defined?(\"SpecialLibrary\") do\n  Workaround.configure\nend\n```\n","summary":"<p>This macro accepts a constant, or a string or a symbol of a fully qualified constant name.</p>","abstract":false,"args":[{"name":"const","external_name":"const","restriction":""}],"args_string":"(const, &code)","args_html":"(const, &code)","location":{"filename":"src/defined.cr","line_number":130,"url":null},"def":{"name":"unless_defined?","args":[{"name":"const","external_name":"const","restriction":""}],"block_arg":{"name":"code","external_name":"code","restriction":""},"visibility":"Public","body":"  \n{% if const.id =~ (/^\\s*::/)\n  positions = [@top_level]\nelse\n  positions = [@type, @top_level]\nend %}\n\n  \n{% found_position = nil\nposition = nil\nparts = [] of String\ndo_break = false\npositions.each do |starting_position|\n  unless do_break\n    inner_do_break = false\n    parts = [] of String\n    clean_part = const.id.gsub(/^::/, \"\")\n    full_part = (\"#{starting_position}::#{clean_part}\".gsub(/^(main::|<Program>::)/, \"\")).id\n    position = @top_level\n    (full_part.split(\"::\")).each do |part|\n      unless inner_do_break\n        if position.has_constant?(part.id)\n          position = position.constant(part.id)\n          parts << part\n        else\n          position = nil\n          parts = [] of String\n          inner_do_break = true\n        end\n      end\n    end\n    if position\n      do_break = true\n    end\n  end\nend\nif !parts.empty?\n  found_position = parse_type(parts.join(\"::\"))\nend\n %}\n\n  \n{% if found_position %}{% else %}\n    {{ code.body }}\n  {% end %}\n\n\n"}},{"html_id":"unless_disabled?(env_var,&block)-macro","name":"unless_disabled?","doc":"Instantiate the code that is passed in the block only if the `env_var` environment\nvariable is set.","summary":"<p>Instantiate the code that is passed in the block only if the <code>env_var</code> environment variable is set.</p>","abstract":false,"args":[{"name":"env_var","external_name":"env_var","restriction":""}],"args_string":"(env_var, &block)","args_html":"(env_var, &block)","location":{"filename":"src/defined.cr","line_number":438,"url":null},"def":{"name":"unless_disabled?","args":[{"name":"env_var","external_name":"env_var","restriction":""}],"block_arg":{"name":"block","external_name":"block","restriction":""},"visibility":"Public","body":"  \n{% val = env(env_var) %}\n\n  \n{% if ((val && (val != \"0\")) && (val != \"false\")) && (!val.empty?) %}\n    {{ block.body }}\n  {% end %}\n\n\n"}},{"html_id":"unless_enabled?(env_var,&block)-macro","name":"unless_enabled?","doc":"Instantiate the code that is passed in the block only if the `env_var` environment\nvariable is not set.","summary":"<p>Instantiate the code that is passed in the block only if the <code>env_var</code> environment variable is not set.</p>","abstract":false,"args":[{"name":"env_var","external_name":"env_var","restriction":""}],"args_string":"(env_var, &block)","args_html":"(env_var, &block)","location":{"filename":"src/defined.cr","line_number":420,"url":null},"def":{"name":"unless_enabled?","args":[{"name":"env_var","external_name":"env_var","restriction":""}],"block_arg":{"name":"block","external_name":"block","restriction":""},"visibility":"Public","body":"  \n{% val = env(env_var) %}\n\n  \n{% if ((val && (val != \"0\")) && (val != \"false\")) && (!val.empty?) %}{% else %}\n    {{ block.body }}\n  {% end %}\n\n\n"}},{"html_id":"unless_version?(const,comparison,value,&code)-macro","name":"unless_version?","doc":"See the documentation for `#if_version?`.\n","summary":"<p>See the documentation for <code><a href=\"toplevel.html#if_version%3F%28const%2Ccomparison%2Cvalue%2C%26code%29-macro\">#if_version?</a></code>.</p>","abstract":false,"args":[{"name":"const","external_name":"const","restriction":""},{"name":"comparison","external_name":"comparison","restriction":""},{"name":"value","external_name":"value","restriction":""}],"args_string":"(const, comparison, value, &code)","args_html":"(const, comparison, value, &code)","location":{"filename":"src/defined.cr","line_number":322,"url":null},"def":{"name":"unless_version?","args":[{"name":"const","external_name":"const","restriction":""},{"name":"comparison","external_name":"comparison","restriction":""},{"name":"value","external_name":"value","restriction":""}],"block_arg":{"name":"code","external_name":"code","restriction":""},"visibility":"Public","body":"  \n{% if const.id =~ (/^\\s*::/)\n  positions = [@top_level]\nelse\n  positions = [@type, @top_level]\nend %}\n\n  \n{% found_position = nil\nposition = nil\nparts = [] of String\ndo_break = false\npositions.each do |starting_position|\n  unless do_break\n    inner_do_break = false\n    parts = [] of String\n    clean_part = const.id.gsub(/^::/, \"\")\n    full_part = (\"#{starting_position}::#{clean_part}\".gsub(/^(main::|<Program>::)/, \"\")).id\n    position = @top_level\n    (full_part.split(\"::\")).each do |part|\n      unless inner_do_break\n        if position.has_constant?(part.id)\n          position = position.constant(part.id)\n          parts << part\n        else\n          position = nil\n          parts = [] of String\n          inner_do_break = true\n        end\n      end\n    end\n    if position\n      do_break = true\n    end\n  end\nend\nif !parts.empty?\n  found_position = parse_type(parts.join(\"::\"))\nend\nresult = false\ndo_nested_version = false\nfull_const = nil\nif found_position\n  if found_position.resolve.is_a?(StringLiteral)\n    version = found_position.resolve\n  else\n    if found_position.resolve.has_constant?(:VERSION)\n      full_const = \"#{const.id}::VERSION\"\n      version = found_position.resolve.constant(:VERSION)\n    else\n      if found_position.resolve.has_constant?(:Version)\n        full_const = \"#{const.id}::Version\"\n        version = found_position.resolve.constant(:Version)\n      else\n        version = false\n      end\n    end\n  end\n  if version.is_a?(MacroExpression)\n    do_nested_version = true\n  else\n    if version\n      cmpx = compare_versions(version, value)\n      if comparison.id == \">\"\n        result = cmpx == 1\n      else\n        if comparison.id == \">=\"\n          result = cmpx >= 0\n        else\n          if comparison.id == \"<\"\n            result = cmpx == -1\n          else\n            if comparison.id == \"<=\"\n              result = cmpx <= 0\n            else\n              if (comparison.id == \"==\") || (comparison.id == \"=\")\n                result = cmpx == 0\n              end\n            end\n          end\n        end\n      end\n    end\n  end\nend\n %}\n\n  \n{% if do_nested_version %}\n    \\{% begin %}\n    {{ \"X\".id }}%cnst = {{ version.id }}\n    \\{% end %}\n    unless_version?( {{ \"X\".id }}%cnst, {{ comparison }}, {{ value.stringify.id }}) do\n      {{ code.body }}\n    end\n  {% else %}{% if !result %}\n    {{ code.body }}\n  {% end %}{% end %}\n\n\n"}}],"types":[{"html_id":"defined/Defined","path":"Defined.html","kind":"module","full_name":"Defined","name":"Defined","abstract":false,"locations":[{"filename":"src/version.cr","line_number":1,"url":null}],"repository_name":"defined","program":false,"enum":false,"alias":false,"const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.3.3\""}]}]}})