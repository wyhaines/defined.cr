[![Defined.cr CI](https://github.com/wyhaines/defined.cr/actions/workflows/ci.yml/badge.svg)](https://github.com/wyhaines/defined.cr/actions/workflows/ci.yml)
[![Defined.cr CI](https://github.com/wyhaines/defined.cr/actions/workflows/ci.yml/badge.svg)](https://github.com/wyhaines/defined.cr/actions/workflows/ci.yml)

[![GitHub release](https://img.shields.io/github/release/wyhaines/defined.cr.svg?style=for-the-badge)](https://github.com/wyhaines/defined.cr/releases)
![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/wyhaines/defined.cr/latest?style=for-the-badge)

# defined.cr

This shard provides a variety of macros that can be used to check, at compile time, if a
given constant is defined, and also to conditionally compile code based on whether a
constant is or is not defined, whether a VERSION meets a requirement, or whether an
environment variable is or is not defined.

## Installation

1. Add the dependency to your `shard.yml`:

   ```yaml
   dependencies:
     defined:
       github: wyhaines/defined.cr
   ```

2. Run `shards install`

## Usage

```crystal
require "defined"
```

### Constant Check Macro Notes

The constant check that of of the constant validation macros (`defined?`, `if_defined?`, `unless_defined?`) use first checks for the constant relative to the type that the macro is
running in, and then if it doesn't find it there, it checks starting at the top level, with
one exception. If the class name starts with a `::` then the check only operates from the
top level. The class name can be provided as a String, a Symbol, or as a bare Class reference.


i.e.

```crystal
if_defined?("Int32") do
  puts "This will always work"
end

unless_defined?(ClassName::That::Does::Not::Exist) do
  puts "This works, too. Cool."
end
```

#### defined?

```crystal
if defined?(OptionalFeature)
  # The OptionalFeature library has been included into the code, so use it.
else
  # It's not there.
end

stuff = defined?(My::Stuff::Library) || Array(String)
```

#### if_defined?

```crystal
require "defined"

class One; end

if_defined?(One) do
  class Two
    def call
      "I am class Two, but I can only exist of class one is defined."
    end
  end
end

puts Two.new.call
```

#### unless_defined?

```crystal
unless_defined?(PerfectShard) do
  require "project/imperfect_shard"
end
```

### Version Checks

The version check macros leverage the same constant lookup code as the constant check macros, but they automatically search for a `VERSION` or a `Version` constant under that namespace, unless the provided constant resolves to a `String`.

#### if_version? and unless_version?

```crystal
class VerMe
  VERSION = "1.2.3"

  class Inner
    Version = "0.1.0"
  end

  class SecondInner
    ClassVersion = "0.3.7"
  end
end

if_version?(VerMe, :>=, "1.2.0") do
  puts "This will only run if the version of VerMe is >= 1.2.0"
end

if_version?(VerMe::Inner, :>=, "0.1.0") do
  puts "This will only run if the version of VerMe::Inner is >= 0.1.0"
end

unless_version?(VerMe::SecondInner::ClassVersion, :>=, "0.4.0") do
  puts "This also works. Hey, maybe you need a new version of that class?"
end

class VerMe
  if_version?(Inner, :<, "0.2.0") do
    puts "WARNING -- Using version of Inner less than 0.2.0 is deprecated, and support will be removed"
  end
end

class MacrosAreTough
  VERSION = {{ `shards version "#{__DIR__}"`.chomp.stringify }}
end

if_version?(MacrosAreTough, :>=, "0.1.0") do
  puts "This will only run if the version of MacrosAreTough is >= 0.1.0"
end
```

The last example, with `MacrosAreTough`, [deserves additional explanation](https://wyhaines.github.io/defined.cr/toplevel.html#if_version%3F%28const%2Ccomparison%2Cvalue%2C%26code%29-macro), because inline macro expressions
like that pose a particular challenge for the library, and there are some edge cases.

### Environment Variable Checks

This facility provides four very simple macros (`if_enabled?`, `unless_enabled?`, `if_disabled?`, `unless_disabled?`) which can be used to conditionally compile code based on whether an environment variable is set, or not. The macros use a shell based definition of truthy and falsey, so `0` and `false` and `""` are considered false, while all other values are true.

`if_enabled?` instantiates the code in the provided block if the environment variable exists, and is set to
a shell truthy value.

`unless_enabled?` instantiates the code in the provided block if the environment variable does not exist, or is set to a shell falsey value.

`if_disabled?` instantiates the code in the provided block if the environment variable des not exist, or is set to a shell falsey value.

`unless_disabled?` instantiates the code in the provided block if the environment variable exists, and is set to a shell truthy value.

```crystal
if_enabled?("ENV_VAR") do
  puts "This will only run if the environment variable ENV_VAR is set to a truthy value"
end

unless_enabled?("ENV_VAR") do
  puts "This will only run if the environment variable ENV_VAR is not set to a truthy value"
end

if_disabled?("ENV_VAR") do
  puts "This will only run if the environment variable ENV_VAR is not set to a truthy value"
end

unless_disabled?("ENV_VAR") do
  puts "This will only run if the environment variable ENV_VAR is set to a truthy value"
end
```

## More Documentation

[https://wyhaines.github.io/defined.cr/toplevel.html](https://wyhaines.github.io/defined.cr/toplevel.html)

## Contributing

1. Fork it (<https://github.com/wyhaines/defined.cr/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [Kirk Haines](https://github.com/wyhaines) - creator and maintainer

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wyhaines/defined.cr?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/wyhaines/defined.cr?style=for-the-badge)
