# defined

![Defined.cr CI](https://img.shields.io/github/workflow/status/wyhaines/defined.cr/defined.cr%20CI?style=for-the-badge&logo=GitHub)
[![GitHub release](https://img.shields.io/github/release/wyhaines/defined.cr.svg?style=for-the-badge)](https://github.com/wyhaines/defined.cr/releases)
![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/wyhaines/defined.cr/latest?style=for-the-badge)

This is a very small shard that provides a single macro, *defined?()*, which returns *VALUE*/*false* depending on whether the argument provided points to an existing constant. All lookups start at the top level and descend from there.

## Installation

1. Add the dependency to your `shard.yml`:

   ```yaml
   dependencies:
     defined:
       github: wyhaines/defined
   ```

2. Run `shards install`

## Usage

```crystal
require "defined"
```

```crystal
if defined?("OptionalFeature")
  # The OptionalFeature library has been included into the code, so use it.
else
  # It's not there.
end

stuff = defined?("My::Stuff::Library") || Array(String)
```

## Development

TODO: Write development instructions here

## Contributing

1. Fork it (<https://github.com/wyhaines/defined/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [Kirk Haines](https://github.com/wyhaines) - creator and maintainer

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wyhaines/defined.cr?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/wyhaines/defined.cr?style=for-the-badge)
