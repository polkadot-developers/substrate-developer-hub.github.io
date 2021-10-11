---
title: Publish Your Own Pallet
---

By now you should have successfully import the Nicks pallet. In future, you will write your own pallets
to execute your application-specific logics. In those cases, you may want to share these pallets
with others.

In this section, we will cover how to publish your own pallet for public to download and use.

## Publishing on GitHub

To publish your pallet on GitHub, you need to
[create a GitHub repository](https://help.github.com/en/articles/create-a-repo) and
[push your pallet's code](https://help.github.com/en/articles/pushing-to-a-remote) to it.

Once published, other developers could refer to your pallet in their `Cargo.toml` using the
following snippet:

**`runtime/Cargo.toml`**

```TOML
[dependencies.your-pallet-name]
default_features = false
git = 'https://github.com/your-username/your-pallet'
version = '1.0.0'
branch = 'master'

# You may choose to refer to a specific commit or tag instead of branch
# rev = '<git-commit>'
# tag = '<some tag>
```

## Publishing on crates.io

**crates.io** allows permissionless publishing of Rust crates. You can learn the procedure by
following their guide on how to [publish on crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html).

Once published, other developers can refer to your pallet in their `Cargo.toml` using the
following snippet:

**`runtime/Cargo.toml`**

```TOML
[dependencies.your-pallet-name]
default_features = false
version = 'some-compatible-version'
```

We do not specify any target destination on the above, and by default it will search for the package
in the **crates.io** repository.

## Learn More

- We have [plenty of tutorials](/tutorials) to showcase Substrate development concepts and
  techniques.
- For more information about runtime development tips and patterns, refer to our
  [Substrate Recipes](https://substrate.dev/recipes).
- For a bare FRAME pallet with higly detailed doc comments on specifics of what more you can access within FRAME, see [this example in `substrate`](https://github.com/paritytech/substrate/tree/master/frame/example).

### References

- [The Cargo book](https://doc.rust-lang.org/stable/cargo/)
- More about [Rust and WebAssembly](https://rustwasm.github.io/)
