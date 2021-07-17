crystal_doc_search_index_callback({"repository_name":"defined","body":"# defined\n\n![Defined.cr CI](https://img.shields.io/github/workflow/status/wyhaines/defined.cr/defined.cr%20CI?style=for-the-badge&logo=GitHub)\n[![GitHub release](https://img.shields.io/github/release/wyhaines/defined.cr.svg?style=for-the-badge)](https://github.com/wyhaines/defined.cr/releases)\n![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/wyhaines/defined.cr/latest?style=for-the-badge)\n\nThis is a very small shard that provides a single macro, *defined?()*, which returns *VALUE*/*false* depending on whether the argument provided points to an existing constant. All lookups start at the top level and descend from there.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n   ```yaml\n   dependencies:\n     defined:\n       github: wyhaines/defined.cr\n   ```\n\n2. Run `shards install`\n\n## Usage\n\n```crystal\nrequire \"defined\"\n```\n\n```crystal\nif defined?(\"OptionalFeature\")\n  # The OptionalFeature library has been included into the code, so use it.\nelse\n  # It's not there.\nend\n\nstuff = defined?(\"My::Stuff::Library\") || Array(String)\n```\n\nCrystal does not permit dynamic creation of classes, and it has compile time checks which happen before macros are evaluated to catch these cases and error on them. So, if one wants to dynamically create classes, it requires a bit of a workaround:\n\n```crystal\nrequire \"defined\"\n\nclass One; end\n\nif_defined?(\"One\", <<-ECODE)\n  class Two\n    def call\n      \"I am class Two, but I can only exist of class one is defined.\"\n    end\n  end\nECODE\n\nputs Two.new.call\n```\n\nOne use case might be, in a library, to provide packaged functionality if a given library was not required elsewhere in the code:\n\n```crystal\nunless_defined?(\"PerfectShard\", <<-END)\n  require \"project/imperfect_shard\"\nEND\n```\n\n## Contributing\n\n1. Fork it (<https://github.com/wyhaines/defined/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Kirk Haines](https://github.com/wyhaines) - creator and maintainer\n\n![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wyhaines/defined.cr?style=for-the-badge)\n![GitHub issues](https://img.shields.io/github/issues/wyhaines/defined.cr?style=for-the-badge)\n","program":{"html_id":"defined/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"defined","program":true,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[{"html_id":"defined?(const)-macro","name":"defined?","doc":"This macro accepts a string or a symbol of a fully qualified constant name.\nIt validates whether the constant is defined, starting at the top level. The value\nof the constant will be returned if it is defined. If it is not defined, `false` is\nreturned.","summary":"<p>This macro accepts a string or a symbol of a fully qualified constant name.</p>","abstract":false,"args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""}],"args_string":"(const)","args_html":"(const)","location":{"filename":"src/defined.cr","line_number":9,"url":"https://github.com/wyhaines/defined.cr/blob/6a0a201808669188bb6be82ec2c5d035e93c8f3b/src/defined.cr#L9"},"def":{"name":"defined?","args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"  \n{% parts = [] of String\nposition = @type\n((const.id.gsub(/^::/, \"\")).split(\"::\")).all? do |part|\n  clean_part = (part.tr(\":\", \"\")).id\n  parts << clean_part\n  if position && (position.has_constant?(clean_part.id))\n    position = position.constant(clean_part.id)\n  else\n    position = false\n  end\nend\n %}\n\n  \n{% if position %}\n    {{ (parts.join(\"::\")).id }}\n  {% else %}\n    false\n  {% end %}\n\n\n"}},{"html_id":"if_defined?(const,code)-macro","name":"if_defined?","doc":null,"summary":null,"abstract":false,"args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""},{"name":"code","doc":null,"default_value":"","external_name":"code","restriction":""}],"args_string":"(const, code)","args_html":"(const, code)","location":{"filename":"src/defined.cr","line_number":30,"url":"https://github.com/wyhaines/defined.cr/blob/6a0a201808669188bb6be82ec2c5d035e93c8f3b/src/defined.cr#L30"},"def":{"name":"if_defined?","args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""},{"name":"code","doc":null,"default_value":"","external_name":"code","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"  \n{% parts = [] of String\nposition = @type\n((const.id.gsub(/^::/, \"\")).split(\"::\")).all? do |part|\n  clean_part = (part.tr(\":\", \"\")).id\n  parts << clean_part\n  if position && (position.has_constant?(clean_part.id))\n    position = position.constant(clean_part.id)\n  else\n    position = false\n  end\nend\n %}\n\n  \n{% if position %}\n    {{ code.id }}\n  {% end %}\n\n\n"}},{"html_id":"unless_defined?(const,code)-macro","name":"unless_defined?","doc":null,"summary":null,"abstract":false,"args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""},{"name":"code","doc":null,"default_value":"","external_name":"code","restriction":""}],"args_string":"(const, code)","args_html":"(const, code)","location":{"filename":"src/defined.cr","line_number":49,"url":"https://github.com/wyhaines/defined.cr/blob/6a0a201808669188bb6be82ec2c5d035e93c8f3b/src/defined.cr#L49"},"def":{"name":"unless_defined?","args":[{"name":"const","doc":null,"default_value":"","external_name":"const","restriction":""},{"name":"code","doc":null,"default_value":"","external_name":"code","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"  \n{% parts = [] of String\nposition = @type\n((const.id.gsub(/^::/, \"\")).split(\"::\")).all? do |part|\n  clean_part = (part.tr(\":\", \"\")).id\n  parts << clean_part\n  if position && (position.has_constant?(clean_part.id))\n    position = position.constant(clean_part.id)\n  else\n    position = false\n  end\nend\n %}\n\n  \n{% if position %}{% else %}\n    {{ code.id }}\n  {% end %}\n\n\n"}}],"types":[{"html_id":"defined/Defined","path":"Defined.html","kind":"module","full_name":"Defined","name":"Defined","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/defined.cr","line_number":1,"url":"https://github.com/wyhaines/defined.cr/blob/6a0a201808669188bb6be82ec2c5d035e93c8f3b/src/defined.cr#L1"}],"repository_name":"defined","program":false,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.1.1\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]}]}})