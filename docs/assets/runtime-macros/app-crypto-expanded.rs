use sp_core::crypto::KeyTypeId;
pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"demo");
pub mod crypto {
	use crate::KEY_TYPE;
	use sp_runtime::{
		app_crypto::{app_crypto, sr25519},
		traits::Verify,
		MultiSignature, MultiSigner,
	};
	#[doc = r" A generic `AppPublic` wrapper type over $public crypto; this has no specific App."]
	pub struct Public(sr25519::Public);
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::clone::Clone for Public {
		#[inline]
		fn clone(&self) -> Public {
			match *self {
				Public(ref __self_0_0) => Public(::core::clone::Clone::clone(&(*__self_0_0))),
			}
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::default::Default for Public {
		#[inline]
		fn default() -> Public {
			Public(::core::default::Default::default())
		}
	}
	impl ::core::marker::StructuralEq for Public {}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::Eq for Public {
		#[inline]
		#[doc(hidden)]
		fn assert_receiver_is_total_eq(&self) -> () {
			{
				let _: ::core::cmp::AssertParamIsEq<sr25519::Public>;
			}
		}
	}
	impl ::core::marker::StructuralPartialEq for Public {}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::PartialEq for Public {
		#[inline]
		fn eq(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => (*__self_0_0) == (*__self_1_0),
				},
			}
		}
		#[inline]
		fn ne(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => (*__self_0_0) != (*__self_1_0),
				},
			}
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::Ord for Public {
		#[inline]
		fn cmp(&self, other: &Public) -> ::core::cmp::Ordering {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						match ::core::cmp::Ord::cmp(&(*__self_0_0), &(*__self_1_0)) {
							::core::cmp::Ordering::Equal => ::core::cmp::Ordering::Equal,
							cmp => cmp,
						}
					}
				},
			}
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::PartialOrd for Public {
		#[inline]
		fn partial_cmp(&self, other: &Public) -> ::core::option::Option<::core::cmp::Ordering> {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						match ::core::cmp::PartialOrd::partial_cmp(&(*__self_0_0), &(*__self_1_0)) {
							::core::option::Option::Some(::core::cmp::Ordering::Equal) => {
								::core::option::Option::Some(::core::cmp::Ordering::Equal)
							}
							cmp => cmp,
						}
					}
				},
			}
		}
		#[inline]
		fn lt(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						::core::option::Option::unwrap_or(
							::core::cmp::PartialOrd::partial_cmp(&(*__self_0_0), &(*__self_1_0)),
							::core::cmp::Ordering::Greater,
						) == ::core::cmp::Ordering::Less
					}
				},
			}
		}
		#[inline]
		fn le(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						::core::option::Option::unwrap_or(
							::core::cmp::PartialOrd::partial_cmp(&(*__self_0_0), &(*__self_1_0)),
							::core::cmp::Ordering::Greater,
						) != ::core::cmp::Ordering::Greater
					}
				},
			}
		}
		#[inline]
		fn gt(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						::core::option::Option::unwrap_or(
							::core::cmp::PartialOrd::partial_cmp(&(*__self_0_0), &(*__self_1_0)),
							::core::cmp::Ordering::Less,
						) == ::core::cmp::Ordering::Greater
					}
				},
			}
		}
		#[inline]
		fn ge(&self, other: &Public) -> bool {
			match *other {
				Public(ref __self_1_0) => match *self {
					Public(ref __self_0_0) => {
						::core::option::Option::unwrap_or(
							::core::cmp::PartialOrd::partial_cmp(&(*__self_0_0), &(*__self_1_0)),
							::core::cmp::Ordering::Less,
						) != ::core::cmp::Ordering::Less
					}
				},
			}
		}
	}
	const _: () = {
		#[allow(unknown_lints)]
		#[allow(rust_2018_idioms)]
		extern crate codec as _parity_scale_codec;
		impl _parity_scale_codec::Encode for Public {
			fn encode_to<EncOut: _parity_scale_codec::Output>(&self, dest: &mut EncOut) {
				_parity_scale_codec::Encode::encode_to(&&self.0, dest)
			}
			fn encode(&self) -> _parity_scale_codec::alloc::vec::Vec<u8> {
				_parity_scale_codec::Encode::encode(&&self.0)
			}
			fn using_encoded<R, F: FnOnce(&[u8]) -> R>(&self, f: F) -> R {
				_parity_scale_codec::Encode::using_encoded(&&self.0, f)
			}
		}
		impl _parity_scale_codec::EncodeLike for Public {}
	};
	const _: () = {
		#[allow(unknown_lints)]
		#[allow(rust_2018_idioms)]
		extern crate codec as _parity_scale_codec;
		impl _parity_scale_codec::Decode for Public {
			fn decode<DecIn: _parity_scale_codec::Input>(
				input: &mut DecIn,
			) -> core::result::Result<Self, _parity_scale_codec::Error> {
				Ok(Public({
					let res = _parity_scale_codec::Decode::decode(input);
					match res {
						Err(_) => return Err("Error decoding field Public.0".into()),
						Ok(a) => a,
					}
				}))
			}
		}
	};
	impl core::fmt::Debug for Public {
		fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::fmt::Result {
			fmt.debug_tuple("Public").field(&self.0).finish()
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::hash::Hash for Public {
		fn hash<__H: ::core::hash::Hasher>(&self, state: &mut __H) -> () {
			match *self {
				Public(ref __self_0_0) => ::core::hash::Hash::hash(&(*__self_0_0), state),
			}
		}
	}
	impl ::sp_application_crypto::Wraps for Public {
		type Inner = sr25519::Public;
	}
	impl From<sr25519::Public> for Public {
		fn from(inner: sr25519::Public) -> Self {
			Self(inner)
		}
	}
	impl From<Public> for sr25519::Public {
		fn from(outer: Public) -> Self {
			outer.0
		}
	}
	impl AsRef<sr25519::Public> for Public {
		fn as_ref(&self) -> &sr25519::Public {
			&self.0
		}
	}
	impl AsMut<sr25519::Public> for Public {
		fn as_mut(&mut self) -> &mut sr25519::Public {
			&mut self.0
		}
	}
	impl ::sp_application_crypto::CryptoType for Public {
		type Pair = Pair;
	}
	impl ::sp_application_crypto::AppKey for Public {
		type UntypedGeneric = sr25519::Public;
		type Public = Public;
		type Pair = Pair;
		type Signature = Signature;
		const ID: ::sp_application_crypto::KeyTypeId = KEY_TYPE;
		const CRYPTO_ID: ::sp_application_crypto::CryptoTypeId = sr25519::CRYPTO_ID;
	}
	impl ::sp_application_crypto::Derive for Public {
		fn derive<Iter: Iterator<Item = ::sp_application_crypto::DeriveJunction>>(
			&self,
			path: Iter,
		) -> Option<Self> {
			self.0.derive(path).map(Self)
		}
	}
	impl std::fmt::Display for Public {
		fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
			use ::sp_application_crypto::Ss58Codec;
			f.write_fmt(::core::fmt::Arguments::new_v1(
				&[""],
				&match (&self.0.to_ss58check(),) {
					(arg0,) => [::core::fmt::ArgumentV1::new(
						arg0,
						::core::fmt::Display::fmt,
					)],
				},
			))
		}
	}
	impl ::sp_application_crypto::serde::Serialize for Public {
		fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
		where
			S: ::sp_application_crypto::serde::Serializer,
		{
			use ::sp_application_crypto::Ss58Codec;
			serializer.serialize_str(&self.to_ss58check())
		}
	}
	impl<'de> ::sp_application_crypto::serde::Deserialize<'de> for Public {
		fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
		where
			D: ::sp_application_crypto::serde::Deserializer<'de>,
		{
			use ::sp_application_crypto::Ss58Codec;
			Public::from_ss58check(&String::deserialize(deserializer)?).map_err(|e| {
				::sp_application_crypto::serde::de::Error::custom({
					let res = ::alloc::fmt::format(::core::fmt::Arguments::new_v1(
						&[""],
						&match (&e,) {
							(arg0,) => {
								[::core::fmt::ArgumentV1::new(arg0, ::core::fmt::Debug::fmt)]
							}
						},
					));
					res
				})
			})
		}
	}
	impl AsRef<[u8]> for Public {
		fn as_ref(&self) -> &[u8] {
			self.0.as_ref()
		}
	}
	impl AsMut<[u8]> for Public {
		fn as_mut(&mut self) -> &mut [u8] {
			self.0.as_mut()
		}
	}
	impl ::sp_application_crypto::Public for Public {
		fn from_slice(x: &[u8]) -> Self {
			Self(<sr25519::Public>::from_slice(x))
		}
		fn to_public_crypto_pair(&self) -> ::sp_application_crypto::CryptoTypePublicPair {
			::sp_application_crypto::CryptoTypePublicPair(sr25519::CRYPTO_ID, self.to_raw_vec())
		}
	}
	impl ::sp_application_crypto::AppPublic for Public {
		type Generic = sr25519::Public;
	}
	impl ::sp_application_crypto::RuntimeAppPublic for Public
	where
		sr25519::Public: ::sp_application_crypto::RuntimePublic<Signature = sr25519::Signature>,
	{
		const ID: ::sp_application_crypto::KeyTypeId = KEY_TYPE;
		const CRYPTO_ID: ::sp_application_crypto::CryptoTypeId = sr25519::CRYPTO_ID;
		type Signature = Signature;
		fn all() -> ::sp_application_crypto::Vec<Self> {
			<sr25519::Public as ::sp_application_crypto::RuntimePublic>::all(KEY_TYPE)
				.into_iter()
				.map(Self)
				.collect()
		}
		fn generate_pair(seed: Option<::sp_application_crypto::Vec<u8>>) -> Self {
			Self(
				<sr25519::Public as ::sp_application_crypto::RuntimePublic>::generate_pair(
					KEY_TYPE, seed,
				),
			)
		}
		fn sign<M: AsRef<[u8]>>(&self, msg: &M) -> Option<Self::Signature> {
			<sr25519::Public as ::sp_application_crypto::RuntimePublic>::sign(
				self.as_ref(),
				KEY_TYPE,
				msg,
			)
			.map(Signature)
		}
		fn verify<M: AsRef<[u8]>>(&self, msg: &M, signature: &Self::Signature) -> bool {
			<sr25519::Public as ::sp_application_crypto::RuntimePublic>::verify(
				self.as_ref(),
				msg,
				&signature.as_ref(),
			)
		}
		fn to_raw_vec(&self) -> ::sp_application_crypto::Vec<u8> {
			<sr25519::Public as ::sp_application_crypto::RuntimePublic>::to_raw_vec(&self.0)
		}
	}
	impl From<Public> for ::sp_application_crypto::CryptoTypePublicPair {
		fn from(key: Public) -> Self {
			(&key).into()
		}
	}
	impl From<&Public> for ::sp_application_crypto::CryptoTypePublicPair {
		fn from(key: &Public) -> Self {
			::sp_application_crypto::CryptoTypePublicPair(
				sr25519::CRYPTO_ID,
				::sp_application_crypto::Public::to_raw_vec(key),
			)
		}
	}
	#[doc = r" A generic `AppPublic` wrapper type over $public crypto; this has no specific App."]
	pub struct Signature(sr25519::Signature);
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::clone::Clone for Signature {
		#[inline]
		fn clone(&self) -> Signature {
			match *self {
				Signature(ref __self_0_0) => Signature(::core::clone::Clone::clone(&(*__self_0_0))),
			}
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::default::Default for Signature {
		#[inline]
		fn default() -> Signature {
			Signature(::core::default::Default::default())
		}
	}
	impl ::core::marker::StructuralEq for Signature {}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::Eq for Signature {
		#[inline]
		#[doc(hidden)]
		fn assert_receiver_is_total_eq(&self) -> () {
			{
				let _: ::core::cmp::AssertParamIsEq<sr25519::Signature>;
			}
		}
	}
	impl ::core::marker::StructuralPartialEq for Signature {}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::cmp::PartialEq for Signature {
		#[inline]
		fn eq(&self, other: &Signature) -> bool {
			match *other {
				Signature(ref __self_1_0) => match *self {
					Signature(ref __self_0_0) => (*__self_0_0) == (*__self_1_0),
				},
			}
		}
		#[inline]
		fn ne(&self, other: &Signature) -> bool {
			match *other {
				Signature(ref __self_1_0) => match *self {
					Signature(ref __self_0_0) => (*__self_0_0) != (*__self_1_0),
				},
			}
		}
	}
	const _: () = {
		#[allow(unknown_lints)]
		#[allow(rust_2018_idioms)]
		extern crate codec as _parity_scale_codec;
		impl _parity_scale_codec::Encode for Signature {
			fn encode_to<EncOut: _parity_scale_codec::Output>(&self, dest: &mut EncOut) {
				_parity_scale_codec::Encode::encode_to(&&self.0, dest)
			}
			fn encode(&self) -> _parity_scale_codec::alloc::vec::Vec<u8> {
				_parity_scale_codec::Encode::encode(&&self.0)
			}
			fn using_encoded<R, F: FnOnce(&[u8]) -> R>(&self, f: F) -> R {
				_parity_scale_codec::Encode::using_encoded(&&self.0, f)
			}
		}
		impl _parity_scale_codec::EncodeLike for Signature {}
	};
	const _: () = {
		#[allow(unknown_lints)]
		#[allow(rust_2018_idioms)]
		extern crate codec as _parity_scale_codec;
		impl _parity_scale_codec::Decode for Signature {
			fn decode<DecIn: _parity_scale_codec::Input>(
				input: &mut DecIn,
			) -> core::result::Result<Self, _parity_scale_codec::Error> {
				Ok(Signature({
					let res = _parity_scale_codec::Decode::decode(input);
					match res {
						Err(_) => return Err("Error decoding field Signature.0".into()),
						Ok(a) => a,
					}
				}))
			}
		}
	};
	impl core::fmt::Debug for Signature {
		fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::fmt::Result {
			fmt.debug_tuple("Signature").field(&self.0).finish()
		}
	}
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::hash::Hash for Signature {
		fn hash<__H: ::core::hash::Hasher>(&self, state: &mut __H) -> () {
			match *self {
				Signature(ref __self_0_0) => ::core::hash::Hash::hash(&(*__self_0_0), state),
			}
		}
	}
	impl ::sp_application_crypto::Wraps for Signature {
		type Inner = sr25519::Signature;
	}
	impl From<sr25519::Signature> for Signature {
		fn from(inner: sr25519::Signature) -> Self {
			Self(inner)
		}
	}
	impl From<Signature> for sr25519::Signature {
		fn from(outer: Signature) -> Self {
			outer.0
		}
	}
	impl AsRef<sr25519::Signature> for Signature {
		fn as_ref(&self) -> &sr25519::Signature {
			&self.0
		}
	}
	impl AsMut<sr25519::Signature> for Signature {
		fn as_mut(&mut self) -> &mut sr25519::Signature {
			&mut self.0
		}
	}
	impl ::sp_application_crypto::CryptoType for Signature {
		type Pair = Pair;
	}
	impl ::sp_application_crypto::AppKey for Signature {
		type UntypedGeneric = sr25519::Signature;
		type Public = Public;
		type Pair = Pair;
		type Signature = Signature;
		const ID: ::sp_application_crypto::KeyTypeId = KEY_TYPE;
		const CRYPTO_ID: ::sp_application_crypto::CryptoTypeId = sr25519::CRYPTO_ID;
	}
	impl ::sp_application_crypto::Deref for Signature {
		type Target = [u8];
		fn deref(&self) -> &Self::Target {
			self.0.as_ref()
		}
	}
	impl AsRef<[u8]> for Signature {
		fn as_ref(&self) -> &[u8] {
			self.0.as_ref()
		}
	}
	impl ::sp_application_crypto::AppSignature for Signature {
		type Generic = sr25519::Signature;
	}
	impl ::sp_application_crypto::TryFrom<::sp_application_crypto::Vec<u8>> for Signature {
		type Error = ();
		fn try_from(data: ::sp_application_crypto::Vec<u8>) -> Result<Self, Self::Error> {
			Ok(<sr25519::Signature>::try_from(data.as_slice())?.into())
		}
	}
	#[doc = r" A generic `AppPublic` wrapper type over $pair crypto; this has no specific App."]
	pub struct Pair(sr25519::Pair);
	#[automatically_derived]
	#[allow(unused_qualifications)]
	impl ::core::clone::Clone for Pair {
		#[inline]
		fn clone(&self) -> Pair {
			match *self {
				Pair(ref __self_0_0) => Pair(::core::clone::Clone::clone(&(*__self_0_0))),
			}
		}
	}
	impl ::sp_application_crypto::Wraps for Pair {
		type Inner = sr25519::Pair;
	}
	impl From<sr25519::Pair> for Pair {
		fn from(inner: sr25519::Pair) -> Self {
			Self(inner)
		}
	}
	impl From<Pair> for sr25519::Pair {
		fn from(outer: Pair) -> Self {
			outer.0
		}
	}
	impl AsRef<sr25519::Pair> for Pair {
		fn as_ref(&self) -> &sr25519::Pair {
			&self.0
		}
	}
	impl AsMut<sr25519::Pair> for Pair {
		fn as_mut(&mut self) -> &mut sr25519::Pair {
			&mut self.0
		}
	}
	impl ::sp_application_crypto::CryptoType for Pair {
		type Pair = Pair;
	}
	impl ::sp_application_crypto::Pair for Pair {
		type Public = Public;
		type Seed = <sr25519::Pair as ::sp_application_crypto::Pair>::Seed;
		type Signature = Signature;
		type DeriveError = <sr25519::Pair as ::sp_application_crypto::Pair>::DeriveError;
		fn generate_with_phrase(password: Option<&str>) -> (Self, String, Self::Seed) {
			let r = <sr25519::Pair>::generate_with_phrase(password);
			(Self(r.0), r.1, r.2)
		}
		fn from_phrase(
			phrase: &str,
			password: Option<&str>,
		) -> Result<(Self, Self::Seed), ::sp_application_crypto::SecretStringError> {
			<sr25519::Pair>::from_phrase(phrase, password).map(|r| (Self(r.0), r.1))
		}
		fn derive<Iter: Iterator<Item = ::sp_application_crypto::DeriveJunction>>(
			&self,
			path: Iter,
			seed: Option<Self::Seed>,
		) -> Result<(Self, Option<Self::Seed>), Self::DeriveError> {
			self.0.derive(path, seed).map(|x| (Self(x.0), x.1))
		}
		fn from_seed(seed: &Self::Seed) -> Self {
			Self(<sr25519::Pair>::from_seed(seed))
		}
		fn from_seed_slice(
			seed: &[u8],
		) -> Result<Self, ::sp_application_crypto::SecretStringError> {
			<sr25519::Pair>::from_seed_slice(seed).map(Self)
		}
		fn sign(&self, msg: &[u8]) -> Self::Signature {
			Signature(self.0.sign(msg))
		}
		fn verify<M: AsRef<[u8]>>(
			sig: &Self::Signature,
			message: M,
			pubkey: &Self::Public,
		) -> bool {
			<sr25519::Pair>::verify(&sig.0, message, pubkey.as_ref())
		}
		fn verify_weak<P: AsRef<[u8]>, M: AsRef<[u8]>>(sig: &[u8], message: M, pubkey: P) -> bool {
			<sr25519::Pair>::verify_weak(sig, message, pubkey)
		}
		fn public(&self) -> Self::Public {
			Public(self.0.public())
		}
		fn to_raw_vec(&self) -> ::sp_application_crypto::Vec<u8> {
			self.0.to_raw_vec()
		}
	}
	impl ::sp_application_crypto::AppKey for Pair {
		type UntypedGeneric = sr25519::Pair;
		type Public = Public;
		type Pair = Pair;
		type Signature = Signature;
		const ID: ::sp_application_crypto::KeyTypeId = KEY_TYPE;
		const CRYPTO_ID: ::sp_application_crypto::CryptoTypeId = sr25519::CRYPTO_ID;
	}
	impl ::sp_application_crypto::AppPair for Pair {
		type Generic = sr25519::Pair;
	}
	pub struct TestAuthId;
	impl frame_system::offchain::AppCrypto<MultiSigner, MultiSignature> for TestAuthId {
		type RuntimeAppPublic = Public;
		type GenericSignature = sp_core::sr25519::Signature;
		type GenericPublic = sp_core::sr25519::Public;
	}
}
