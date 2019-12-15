---
title: Runtime Storage
---

Runtime storage allows you to store data in your blockchain which can be accessed from your runtime logic and persists between blocks.

## Storage Items

Your runtime module has access to Substrate storage APIs which allows you to easily store common storage items:

* [Storage Value](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageValue.html) - A single value.

* [Storage Map](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageMap.html) - A key-value hash map.

* [Storage Linked Map](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageLinkedMap.html) - Similar to a storage map, but allows enumeration of the stored elements.

* [Storage Double Map](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageDoubleMap.html) - An implementation of a map with two keys.

Any value which can be encoded by the [Parity SCALE codec](conceptual/core/codec.md) is supported by these storage APIs.

### Storage Declaration

You can use the `decl_storage!` macro to easily create new runtime storage items. Here is an example of what it looks like to declare each type of storage item:

```rust
decl_storage! {
	trait Store for Module<T: Trait> as Example {
		pub SomeValue: u64;
		pub SomeMap: map u64 => u64;
		pub SomeLinkedMap: linked_map u64 => u64;
		pub SomeDoubleMap: double_map u64, blake2_256(u64) => u64;
	}
}
```

## Default Value

Substrate allows you to define the default value which is returned when the storage item is not set. This value is **not** actually stored in the runtime storage, but runtime logic will see this value during execution.

Here is an example for setting a default value for all items in a map:

```rust
decl_storage! {
	trait Store for Module<T: Trait> as Example {
		pub SomeMap: map u64 => u64 = 1337;
	}
}
```

## Verify First, Write Last

TODO

## Storage Cache

TODO

## Child Storage Tries

TODO

## Next Steps

### Learn More

TODO

### Examples

* View this example to see how you can use a `double_map` to act as a `killable` single-map.

### References

* Visit the reference docs for the [`decl_storage!` macro](https://substrate.dev/rustdocs/master/frame_support/macro.decl_storage.html) more details possible storage declarations.

* Visit the reference docs for [StorageValue](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageValue.html), [StorageMap](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageMap.html), [StorageLinkedMap](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageLinkedMap.html), and [StorageDoubleMap](https://substrate.dev/rustdocs/master/frame_support/storage/trait.StorageDoubleMap.html) to learn more about their API.
