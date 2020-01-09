---
id: "key-management"
title: "Key Management"
---

Keys in Substrate are stored in the keystore in the file system. To store keys into this keystore,
you need to use one of the two provided RPC calls. If your keys are encrypted or should be encrypted
by the keystore, you need to provide the key using one of the cli arguments `--password`, `--password-interactive` or `--password-filename`.

## Auto-generated Keys

For most users who want to run a validator node, the `author_rotateKeys` RPC call is sufficient.
The RPC call will generate `N` Session keys for you and return their public keys. `N` is the number
of session keys configured in the runtime. The output of the RPC call can be used as input for the
 `session::set_keys` transaction.

```bash
$ curl -H 'Content-Type: application/json' --data '{ "jsonrpc":"2.0", "method":"author_rotateKeys", "id":1 }' localhost:9933
```

## Fixed Keys

If the Session keys need to match a fixed seed, they can be set individually key by key. You can use
[subkey Tool](development/tools/subkey.md#generating-keys) to generate the needed seed and public key
that can be passed into the RPC call with a key type.

```bash
$ subkey generate
Secret phrase `favorite liar zebra assume hurt cage any damp inherit rescue delay panic` is account:
  Secret seed: 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
  Public key (hex): 0x6ce96ae5c300096b09dbd4567b0574f6a1281ae0e5cfe4f6b0233d1821f6206b
  Address (SS58): 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68

$ curl -H 'Content-Type: application/json' --data '{ "jsonrpc":"2.0", "method":"author_insertKey", "params":["KEY_TYPE", "SEED", "PUBLIC"],"id":1 }' localhost:9933
```

- `KEY_TYPE` - to be replaced with a 4-character key type identifier.
- `SEED` - is the secret seed.
- `PUBLIC` - public key for the given seed.
