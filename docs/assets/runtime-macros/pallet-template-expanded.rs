#![feature(prelude_import)]
#[prelude_import]
use std::prelude::v1::*;
#[macro_use]
extern crate std;
#[doc = " A FRAME pallet template with necessary imports"]
#[doc = " Feel free to remove or edit this file as needed."]
#[doc = " If you change the name of this file, make sure to update its references in runtime/src/lib.rs"]
#[doc = " If you remove this file, you can remove those references"]
#[doc = " For more guidance on Substrate FRAME, see the example pallet"]
#[doc = " https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs"]
use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch};
use frame_system::{self as system, ensure_signed};
#[doc = " The pallet's configuration trait."]
pub trait Trait: system::Trait {
	#[doc = " The overarching event type."]
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
use self::sp_api_hidden_includes_decl_storage::hidden_include::{
	StorageValue as _, StorageMap as _, StorageDoubleMap as _, StoragePrefixedMap as _,
};
#[doc(hidden)]
mod sp_api_hidden_includes_decl_storage {
	pub extern crate frame_support as hidden_include;
}
trait Store {
	type Something;
}
impl<T: Trait + 'static> Store for Module<T> {
	type Something = Something;
}
impl<T: Trait + 'static> Module<T> {
	pub fn something() -> Option<u32> {
		< Something < > as self :: sp_api_hidden_includes_decl_storage :: hidden_include :: storage :: StorageValue < u32 > > :: get ( )
	}
}
#[doc(hidden)]
pub struct __GetByteStructSomething<T>(
	pub self::sp_api_hidden_includes_decl_storage::hidden_include::sp_std::marker::PhantomData<(T)>,
);
#[cfg(feature = "std")]
#[allow(non_upper_case_globals)]
static __CACHE_GET_BYTE_STRUCT_Something:
	self::sp_api_hidden_includes_decl_storage::hidden_include::once_cell::sync::OnceCell<
		self::sp_api_hidden_includes_decl_storage::hidden_include::sp_std::vec::Vec<u8>,
	> = self::sp_api_hidden_includes_decl_storage::hidden_include::once_cell::sync::OnceCell::new();
#[cfg(feature = "std")]
impl<T: Trait> self::sp_api_hidden_includes_decl_storage::hidden_include::metadata::DefaultByte
	for __GetByteStructSomething<T>
{
	fn default_byte(
		&self,
	) -> self::sp_api_hidden_includes_decl_storage::hidden_include::sp_std::vec::Vec<u8> {
		use self::sp_api_hidden_includes_decl_storage::hidden_include::codec::Encode;
		__CACHE_GET_BYTE_STRUCT_Something
			.get_or_init(|| {
				let def_val: Option<u32> = Default::default();
				<Option<u32> as Encode>::encode(&def_val)
			})
			.clone()
	}
}
unsafe impl<T: Trait> Send for __GetByteStructSomething<T> {}
unsafe impl<T: Trait> Sync for __GetByteStructSomething<T> {}
impl<T: Trait + 'static> Module<T> {
	#[doc(hidden)]
	pub fn storage_metadata(
	) -> self::sp_api_hidden_includes_decl_storage::hidden_include::metadata::StorageMetadata {
		self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: StorageMetadata { prefix : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( "TemplateModule" ) , entries : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( & [ self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: StorageEntryMetadata { name : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( "Something" ) , modifier : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: StorageEntryModifier :: Optional , ty : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: StorageEntryType :: Plain ( self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( "u32" ) ) , default : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DefaultByteGetter ( & __GetByteStructSomething :: < T > ( self :: sp_api_hidden_includes_decl_storage :: hidden_include :: sp_std :: marker :: PhantomData ) ) ) , documentation : self :: sp_api_hidden_includes_decl_storage :: hidden_include :: metadata :: DecodeDifferent :: Encode ( & [ ] ) , } ] [ .. ] ) , }
	}
}
#[doc = r" Tag a type as an instance of a module."]
#[doc = r""]
#[doc = r" Defines storage prefixes, they must be unique."]
#[doc(hidden)]
pub trait __GeneratedInstantiable: 'static {
	#[doc = r" The prefix used by any storage entry of an instance."]
	const PREFIX: &'static str;
}
#[doc(hidden)]
pub struct __InherentHiddenInstance;
#[automatically_derived]
#[allow(unused_qualifications)]
impl ::core::clone::Clone for __InherentHiddenInstance {
	#[inline]
	fn clone(&self) -> __InherentHiddenInstance {
		match *self {
			__InherentHiddenInstance => __InherentHiddenInstance,
		}
	}
}
impl ::core::marker::StructuralEq for __InherentHiddenInstance {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl ::core::cmp::Eq for __InherentHiddenInstance {
	#[inline]
	#[doc(hidden)]
	fn assert_receiver_is_total_eq(&self) -> () {
		{}
	}
}
impl ::core::marker::StructuralPartialEq for __InherentHiddenInstance {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl ::core::cmp::PartialEq for __InherentHiddenInstance {
	#[inline]
	fn eq(&self, other: &__InherentHiddenInstance) -> bool {
		match *other {
			__InherentHiddenInstance => match *self {
				__InherentHiddenInstance => true,
			},
		}
	}
}
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl _parity_scale_codec::Encode for __InherentHiddenInstance {
		fn encode_to<EncOut: _parity_scale_codec::Output>(&self, dest: &mut EncOut) {}
	}
	impl _parity_scale_codec::EncodeLike for __InherentHiddenInstance {}
};
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl _parity_scale_codec::Decode for __InherentHiddenInstance {
		fn decode<DecIn: _parity_scale_codec::Input>(
			input: &mut DecIn,
		) -> core::result::Result<Self, _parity_scale_codec::Error> {
			Ok(__InherentHiddenInstance)
		}
	}
};
impl core::fmt::Debug for __InherentHiddenInstance {
	fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::fmt::Result {
		fmt.debug_tuple("__InherentHiddenInstance").finish()
	}
}
impl __GeneratedInstantiable for __InherentHiddenInstance {
	const PREFIX: &'static str = "TemplateModule";
}
struct Something(
	self::sp_api_hidden_includes_decl_storage::hidden_include::sp_std::marker::PhantomData<()>,
);
impl
	self::sp_api_hidden_includes_decl_storage::hidden_include::storage::generator::StorageValue<u32>
	for Something
{
	type Query = Option<u32>;
	fn module_prefix() -> &'static [u8] {
		__InherentHiddenInstance::PREFIX.as_bytes()
	}
	fn storage_prefix() -> &'static [u8] {
		b"Something"
	}
	fn from_optional_value_to_query(v: Option<u32>) -> Self::Query {
		v.or_else(|| Default::default())
	}
	fn from_query_to_optional_value(v: Self::Query) -> Option<u32> {
		v
	}
}
#[doc = " [`RawEvent`] specialized for the configuration [`Trait`]"]
#[doc = ""]
#[doc = " [`RawEvent`]: enum.RawEvent.html"]
#[doc = " [`Trait`]: trait.Trait.html"]
pub type Event<T> = RawEvent<<T as system::Trait>::AccountId>;
#[doc = " Events for this module."]
#[doc = ""]
pub enum RawEvent<AccountId> {
	#[doc = r" Just a dummy event."]
	#[doc = r" Event `Something` is declared with a parameter of the type `u32` and `AccountId`"]
	#[doc = r" To emit this event, we call the deposit function, from our runtime functions"]
	SomethingStored(u32, AccountId),
}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<AccountId: ::core::clone::Clone> ::core::clone::Clone for RawEvent<AccountId> {
	#[inline]
	fn clone(&self) -> RawEvent<AccountId> {
		match (&*self,) {
			(&RawEvent::SomethingStored(ref __self_0, ref __self_1),) => RawEvent::SomethingStored(
				::core::clone::Clone::clone(&(*__self_0)),
				::core::clone::Clone::clone(&(*__self_1)),
			),
		}
	}
}
impl<AccountId> ::core::marker::StructuralPartialEq for RawEvent<AccountId> {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<AccountId: ::core::cmp::PartialEq> ::core::cmp::PartialEq for RawEvent<AccountId> {
	#[inline]
	fn eq(&self, other: &RawEvent<AccountId>) -> bool {
		match (&*self, &*other) {
			(
				&RawEvent::SomethingStored(ref __self_0, ref __self_1),
				&RawEvent::SomethingStored(ref __arg_1_0, ref __arg_1_1),
			) => (*__self_0) == (*__arg_1_0) && (*__self_1) == (*__arg_1_1),
		}
	}
	#[inline]
	fn ne(&self, other: &RawEvent<AccountId>) -> bool {
		match (&*self, &*other) {
			(
				&RawEvent::SomethingStored(ref __self_0, ref __self_1),
				&RawEvent::SomethingStored(ref __arg_1_0, ref __arg_1_1),
			) => (*__self_0) != (*__arg_1_0) || (*__self_1) != (*__arg_1_1),
		}
	}
}
impl<AccountId> ::core::marker::StructuralEq for RawEvent<AccountId> {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<AccountId: ::core::cmp::Eq> ::core::cmp::Eq for RawEvent<AccountId> {
	#[inline]
	#[doc(hidden)]
	fn assert_receiver_is_total_eq(&self) -> () {
		{
			let _: ::core::cmp::AssertParamIsEq<u32>;
			let _: ::core::cmp::AssertParamIsEq<AccountId>;
		}
	}
}
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl<AccountId> _parity_scale_codec::Encode for RawEvent<AccountId>
	where
		AccountId: _parity_scale_codec::Encode,
		AccountId: _parity_scale_codec::Encode,
	{
		fn encode_to<EncOut: _parity_scale_codec::Output>(&self, dest: &mut EncOut) {
			match *self {
				RawEvent::SomethingStored(ref aa, ref ba) => {
					dest.push_byte(0usize as u8);
					dest.push(aa);
					dest.push(ba);
				}
				_ => (),
			}
		}
	}
	impl<AccountId> _parity_scale_codec::EncodeLike for RawEvent<AccountId>
	where
		AccountId: _parity_scale_codec::Encode,
		AccountId: _parity_scale_codec::Encode,
	{
	}
};
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl<AccountId> _parity_scale_codec::Decode for RawEvent<AccountId>
	where
		AccountId: _parity_scale_codec::Decode,
		AccountId: _parity_scale_codec::Decode,
	{
		fn decode<DecIn: _parity_scale_codec::Input>(
			input: &mut DecIn,
		) -> core::result::Result<Self, _parity_scale_codec::Error> {
			match input.read_byte()? {
				x if x == 0usize as u8 => Ok(RawEvent::SomethingStored(
					{
						let res = _parity_scale_codec::Decode::decode(input);
						match res {
							Err(_) => {
								return Err(
									"Error decoding field RawEvent :: SomethingStored.0".into()
								)
							}
							Ok(a) => a,
						}
					},
					{
						let res = _parity_scale_codec::Decode::decode(input);
						match res {
							Err(_) => {
								return Err(
									"Error decoding field RawEvent :: SomethingStored.1".into()
								)
							}
							Ok(a) => a,
						}
					},
				)),
				x => Err("No such variant in enum RawEvent".into()),
			}
		}
	}
};
impl<AccountId> core::fmt::Debug for RawEvent<AccountId>
where
	AccountId: core::fmt::Debug,
{
	fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::fmt::Result {
		match self {
			Self::SomethingStored(ref a0, ref a1) => fmt
				.debug_tuple("RawEvent::SomethingStored")
				.field(a0)
				.field(a1)
				.finish(),
			_ => Ok(()),
		}
	}
}
impl<AccountId> From<RawEvent<AccountId>> for () {
	fn from(_: RawEvent<AccountId>) -> () {
		()
	}
}
impl<AccountId> RawEvent<AccountId> {
	#[allow(dead_code)]
	#[doc(hidden)]
	pub fn metadata() -> &'static [::frame_support::event::EventMetadata] {
		&[::frame_support::event::EventMetadata {
			name: ::frame_support::event::DecodeDifferent::Encode("SomethingStored"),
			arguments: ::frame_support::event::DecodeDifferent::Encode(&["u32", "AccountId"]),
			documentation: ::frame_support::event::DecodeDifferent::Encode(&[
				r" Just a dummy event.",
				r" Event `Something` is declared with a parameter of the type `u32` and `AccountId`",
				r" To emit this event, we call the deposit function, from our runtime functions",
			]),
		}]
	}
}
pub enum Error<T: Trait> {
	#[doc(hidden)]
	__Ignore(
		::frame_support::sp_std::marker::PhantomData<(T,)>,
		::frame_support::Never,
	),
	#[doc = r" Value was None"]
	NoneValue,
	#[doc = r" Value reached maximum and cannot be incremented further"]
	StorageOverflow,
}
impl<T: Trait> ::frame_support::sp_std::fmt::Debug for Error<T> {
	fn fmt(
		&self,
		f: &mut ::frame_support::sp_std::fmt::Formatter<'_>,
	) -> ::frame_support::sp_std::fmt::Result {
		f.write_str(self.as_str())
	}
}
impl<T: Trait> Error<T> {
	fn as_u8(&self) -> u8 {
		match self {
			Error::__Ignore(_, _) => ::std::rt::begin_panic_fmt(&::core::fmt::Arguments::new_v1(
				&["internal error: entered unreachable code: "],
				&match (&"`__Ignore` can never be constructed",) {
					(arg0,) => [::core::fmt::ArgumentV1::new(
						arg0,
						::core::fmt::Display::fmt,
					)],
				},
			)),
			Error::NoneValue => 0,
			Error::StorageOverflow => 0 + 1,
		}
	}
	fn as_str(&self) -> &'static str {
		match self {
			Self::__Ignore(_, _) => ::std::rt::begin_panic_fmt(&::core::fmt::Arguments::new_v1(
				&["internal error: entered unreachable code: "],
				&match (&"`__Ignore` can never be constructed",) {
					(arg0,) => [::core::fmt::ArgumentV1::new(
						arg0,
						::core::fmt::Display::fmt,
					)],
				},
			)),
			Error::NoneValue => "NoneValue",
			Error::StorageOverflow => "StorageOverflow",
		}
	}
}
impl<T: Trait> From<Error<T>> for &'static str {
	fn from(err: Error<T>) -> &'static str {
		err.as_str()
	}
}
impl<T: Trait> From<Error<T>> for ::frame_support::sp_runtime::DispatchError {
	fn from(err: Error<T>) -> Self {
		let index = <T::ModuleToIndex as ::frame_support::traits::ModuleToIndex>::module_to_index::<
			Module<T>,
		>()
		.expect("Every active module has an index in the runtime; qed") as u8;
		::frame_support::sp_runtime::DispatchError::Module {
			index,
			error: err.as_u8(),
			message: Some(err.as_str()),
		}
	}
}
impl<T: Trait> ::frame_support::error::ModuleErrorMetadata for Error<T> {
	fn metadata() -> &'static [::frame_support::error::ErrorMetadata] {
		&[
			::frame_support::error::ErrorMetadata {
				name: ::frame_support::error::DecodeDifferent::Encode("NoneValue"),
				documentation: ::frame_support::error::DecodeDifferent::Encode(&[
					r" Value was None",
				]),
			},
			::frame_support::error::ErrorMetadata {
				name: ::frame_support::error::DecodeDifferent::Encode("StorageOverflow"),
				documentation: ::frame_support::error::DecodeDifferent::Encode(&[
					r" Value reached maximum and cannot be incremented further",
				]),
			},
		]
	}
}
#[doc = r" The module declaration."]
pub struct Module<T: Trait>(::frame_support::sp_std::marker::PhantomData<(T,)>);
#[automatically_derived]
#[allow(unused_qualifications)]
impl<T: ::core::clone::Clone + Trait> ::core::clone::Clone for Module<T> {
	#[inline]
	fn clone(&self) -> Module<T> {
		match *self {
			Module(ref __self_0_0) => Module(::core::clone::Clone::clone(&(*__self_0_0))),
		}
	}
}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<T: ::core::marker::Copy + Trait> ::core::marker::Copy for Module<T> {}
impl<T: Trait> ::core::marker::StructuralPartialEq for Module<T> {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<T: ::core::cmp::PartialEq + Trait> ::core::cmp::PartialEq for Module<T> {
	#[inline]
	fn eq(&self, other: &Module<T>) -> bool {
		match *other {
			Module(ref __self_1_0) => match *self {
				Module(ref __self_0_0) => (*__self_0_0) == (*__self_1_0),
			},
		}
	}
	#[inline]
	fn ne(&self, other: &Module<T>) -> bool {
		match *other {
			Module(ref __self_1_0) => match *self {
				Module(ref __self_0_0) => (*__self_0_0) != (*__self_1_0),
			},
		}
	}
}
impl<T: Trait> ::core::marker::StructuralEq for Module<T> {}
#[automatically_derived]
#[allow(unused_qualifications)]
impl<T: ::core::cmp::Eq + Trait> ::core::cmp::Eq for Module<T> {
	#[inline]
	#[doc(hidden)]
	fn assert_receiver_is_total_eq(&self) -> () {
		{
			let _: ::core::cmp::AssertParamIsEq<
				::frame_support::sp_std::marker::PhantomData<(T,)>,
			>;
		}
	}
}
impl<T: Trait> core::fmt::Debug for Module<T>
where
	T: core::fmt::Debug,
{
	fn fmt(&self, fmt: &mut core::fmt::Formatter) -> core::fmt::Result {
		fmt.debug_tuple("Module").field(&self.0).finish()
	}
}
impl<T: Trait> ::frame_support::traits::OnInitialize<T::BlockNumber> for Module<T> {}
impl<T: Trait> ::frame_support::traits::OnRuntimeUpgrade for Module<T> {}
impl<T: Trait> ::frame_support::traits::OnFinalize<T::BlockNumber> for Module<T> {}
impl<T: Trait> ::frame_support::traits::OffchainWorker<T::BlockNumber> for Module<T> {}
impl<T: Trait> Module<T> {
	fn deposit_event(event: impl Into<<T as Trait>::Event>) {
		<system::Module<T>>::deposit_event(event.into())
	}
}
#[doc = " Can also be called using [`Call`]."]
#[doc = ""]
#[doc = " [`Call`]: enum.Call.html"]
impl<T: Trait> Module<T> {
	#[doc = r" Just a dummy entry point."]
	#[doc = r" function that can be called by the external world as an extrinsics call"]
	#[doc = r" takes a parameter of the type `AccountId`, stores it, and emits an event"]
	pub fn do_something(origin: T::Origin, something: u32) -> dispatch::DispatchResult {
		let __tracing_span__ = {
			{
				if ::tracing::dispatcher::has_been_set()
					&& ::sp_tracing::tracing::Level::TRACE
						<= ::tracing::level_filters::STATIC_MAX_LEVEL
				{
					use ::tracing::callsite;
					use ::tracing::callsite::Callsite;
					let callsite = {
						use ::tracing::{callsite, subscriber::Interest, Metadata, __macro_support::*};
						struct MyCallsite;
						static META: Metadata<'static> = {
							::tracing_core::metadata::Metadata::new(
								"do_something",
								"pallet_template",
								::sp_tracing::tracing::Level::TRACE,
								Some("pallets/template/src/lib.rs"),
								Some(63u32),
								Some("pallet_template"),
								::tracing_core::field::FieldSet::new(
									&[],
									::tracing_core::callsite::Identifier(&MyCallsite),
								),
								::tracing::metadata::Kind::SPAN,
							)
						};
						static INTEREST: AtomicUsize = AtomicUsize::new(0);
						static REGISTRATION: Once = Once::new();
						impl MyCallsite {
							#[inline]
							fn interest(&self) -> Interest {
								match INTEREST.load(Ordering::Relaxed) {
									0 => Interest::never(),
									2 => Interest::always(),
									_ => Interest::sometimes(),
								}
							}
						}
						impl callsite::Callsite for MyCallsite {
							fn set_interest(&self, interest: Interest) {
								let interest = match () {
									_ if interest.is_never() => 0,
									_ if interest.is_always() => 2,
									_ => 1,
								};
								INTEREST.store(interest, Ordering::SeqCst);
							}
							fn metadata(&self) -> &Metadata {
								&META
							}
						}
						REGISTRATION.call_once(|| {
							callsite::register(&MyCallsite);
						});
						&MyCallsite
					};
					let meta = callsite.metadata();
					if {
						let interest = callsite.interest();
						if interest.is_never() {
							false
						} else if interest.is_always() {
							true
						} else {
							let meta = callsite.metadata();
							::tracing::dispatcher::get_default(|current| current.enabled(meta))
						}
					} {
						::tracing::Span::new(meta, &{ meta.fields().value_set(&[]) })
					} else {
						::tracing::Span::none()
					}
				} else {
					::tracing::Span::none()
				}
			}
		};
		let __tracing_guard__ = { __tracing_span__.enter() };
		let who = ensure_signed(origin)?;
		Something::put(something);
		Self::deposit_event(RawEvent::SomethingStored(something, who));
		Ok(())
	}
	#[doc = r" Another dummy entry point."]
	#[doc = r" takes no parameters, attempts to increment storage value, and possibly throws an error"]
	pub fn cause_error(origin: T::Origin) -> dispatch::DispatchResult {
		let __tracing_span__ = {
			{
				if ::tracing::dispatcher::has_been_set()
					&& ::sp_tracing::tracing::Level::TRACE
						<= ::tracing::level_filters::STATIC_MAX_LEVEL
				{
					use ::tracing::callsite;
					use ::tracing::callsite::Callsite;
					let callsite = {
						use ::tracing::{callsite, subscriber::Interest, Metadata, __macro_support::*};
						struct MyCallsite;
						static META: Metadata<'static> = {
							::tracing_core::metadata::Metadata::new(
								"cause_error",
								"pallet_template",
								::sp_tracing::tracing::Level::TRACE,
								Some("pallets/template/src/lib.rs"),
								Some(63u32),
								Some("pallet_template"),
								::tracing_core::field::FieldSet::new(
									&[],
									::tracing_core::callsite::Identifier(&MyCallsite),
								),
								::tracing::metadata::Kind::SPAN,
							)
						};
						static INTEREST: AtomicUsize = AtomicUsize::new(0);
						static REGISTRATION: Once = Once::new();
						impl MyCallsite {
							#[inline]
							fn interest(&self) -> Interest {
								match INTEREST.load(Ordering::Relaxed) {
									0 => Interest::never(),
									2 => Interest::always(),
									_ => Interest::sometimes(),
								}
							}
						}
						impl callsite::Callsite for MyCallsite {
							fn set_interest(&self, interest: Interest) {
								let interest = match () {
									_ if interest.is_never() => 0,
									_ if interest.is_always() => 2,
									_ => 1,
								};
								INTEREST.store(interest, Ordering::SeqCst);
							}
							fn metadata(&self) -> &Metadata {
								&META
							}
						}
						REGISTRATION.call_once(|| {
							callsite::register(&MyCallsite);
						});
						&MyCallsite
					};
					let meta = callsite.metadata();
					if {
						let interest = callsite.interest();
						if interest.is_never() {
							false
						} else if interest.is_always() {
							true
						} else {
							let meta = callsite.metadata();
							::tracing::dispatcher::get_default(|current| current.enabled(meta))
						}
					} {
						::tracing::Span::new(meta, &{ meta.fields().value_set(&[]) })
					} else {
						::tracing::Span::none()
					}
				} else {
					::tracing::Span::none()
				}
			}
		};
		let __tracing_guard__ = { __tracing_span__.enter() };
		let _who = ensure_signed(origin)?;
		match Something::get() {
			None => Err(Error::<T>::NoneValue)?,
			Some(old) => {
				let new = old.checked_add(1).ok_or(Error::<T>::StorageOverflow)?;
				Something::put(new);
				Ok(())
			}
		}
	}
}
#[doc = " Dispatchable calls."]
#[doc = ""]
#[doc = " Each variant of this enum maps to a dispatchable function from the associated module."]
pub enum Call<T: Trait> {
	#[doc(hidden)]
	#[codec(skip)]
	__PhantomItem(
		::frame_support::sp_std::marker::PhantomData<(T,)>,
		::frame_support::Never,
	),
	#[allow(non_camel_case_types)]
	#[doc = r" Just a dummy entry point."]
	#[doc = r" function that can be called by the external world as an extrinsics call"]
	#[doc = r" takes a parameter of the type `AccountId`, stores it, and emits an event"]
	do_something(u32),
	#[allow(non_camel_case_types)]
	#[doc = r" Another dummy entry point."]
	#[doc = r" takes no parameters, attempts to increment storage value, and possibly throws an error"]
	cause_error(),
}
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl<T: Trait> _parity_scale_codec::Encode for Call<T> {
		fn encode_to<EncOut: _parity_scale_codec::Output>(&self, dest: &mut EncOut) {
			match *self {
				Call::do_something(ref aa) => {
					dest.push_byte(0usize as u8);
					dest.push(aa);
				}
				Call::cause_error() => {
					dest.push_byte(1usize as u8);
				}
				_ => (),
			}
		}
	}
	impl<T: Trait> _parity_scale_codec::EncodeLike for Call<T> {}
};
const _: () = {
	#[allow(unknown_lints)]
	#[allow(rust_2018_idioms)]
	extern crate codec as _parity_scale_codec;
	impl<T: Trait> _parity_scale_codec::Decode for Call<T> {
		fn decode<DecIn: _parity_scale_codec::Input>(
			input: &mut DecIn,
		) -> core::result::Result<Self, _parity_scale_codec::Error> {
			match input.read_byte()? {
				x if x == 0usize as u8 => Ok(Call::do_something({
					let res = _parity_scale_codec::Decode::decode(input);
					match res {
						Err(_) => return Err("Error decoding field Call :: do_something.0".into()),
						Ok(a) => a,
					}
				})),
				x if x == 1usize as u8 => Ok(Call::cause_error()),
				x => Err("No such variant in enum Call".into()),
			}
		}
	}
};
impl<T: Trait> ::frame_support::dispatch::GetDispatchInfo for Call<T> {
	fn get_dispatch_info(&self) -> ::frame_support::dispatch::DispatchInfo {
		match *self {
			Call::do_something(ref something) => {
				let base_weight = 10_000;
				let weight = <dyn ::frame_support::dispatch::WeighData<(&u32,)>>::weigh_data(
					&base_weight,
					(something,),
				);
				let class =
					<dyn ::frame_support::dispatch::ClassifyDispatch<(&u32,)>>::classify_dispatch(
						&base_weight,
						(something,),
					);
				let pays_fee = <dyn ::frame_support::dispatch::PaysFee<(&u32,)>>::pays_fee(
					&base_weight,
					(something,),
				);
				::frame_support::dispatch::DispatchInfo {
					weight,
					class,
					pays_fee,
				}
			}
			Call::cause_error() => {
				let base_weight = 10_000;
				let weight =
					<dyn ::frame_support::dispatch::WeighData<()>>::weigh_data(&base_weight, ());
				let class =
					<dyn ::frame_support::dispatch::ClassifyDispatch<()>>::classify_dispatch(
						&base_weight,
						(),
					);
				let pays_fee =
					<dyn ::frame_support::dispatch::PaysFee<()>>::pays_fee(&base_weight, ());
				::frame_support::dispatch::DispatchInfo {
					weight,
					class,
					pays_fee,
				}
			}
			Call::__PhantomItem(_, _) => {
				::std::rt::begin_panic_fmt(&::core::fmt::Arguments::new_v1(
					&["internal error: entered unreachable code: "],
					&match (&"__PhantomItem should never be used.",) {
						(arg0,) => [::core::fmt::ArgumentV1::new(
							arg0,
							::core::fmt::Display::fmt,
						)],
					},
				))
			}
		}
	}
}
impl<T: Trait> ::frame_support::dispatch::GetCallName for Call<T> {
	fn get_call_name(&self) -> &'static str {
		match *self {
			Call::do_something(ref something) => {
				let _ = (something);
				"do_something"
			}
			Call::cause_error() => {
				let _ = ();
				"cause_error"
			}
			Call::__PhantomItem(_, _) => {
				::std::rt::begin_panic_fmt(&::core::fmt::Arguments::new_v1(
					&["internal error: entered unreachable code: "],
					&match (&"__PhantomItem should never be used.",) {
						(arg0,) => [::core::fmt::ArgumentV1::new(
							arg0,
							::core::fmt::Display::fmt,
						)],
					},
				))
			}
		}
	}
	fn get_call_names() -> &'static [&'static str] {
		&["do_something", "cause_error"]
	}
}
impl<T: Trait> ::frame_support::dispatch::Clone for Call<T> {
	fn clone(&self) -> Self {
		match *self {
			Call::do_something(ref something) => Call::do_something((*something).clone()),
			Call::cause_error() => Call::cause_error(),
			_ => ::std::rt::begin_panic("internal error: entered unreachable code"),
		}
	}
}
impl<T: Trait> ::frame_support::dispatch::PartialEq for Call<T> {
	fn eq(&self, _other: &Self) -> bool {
		match *self {
			Call::do_something(ref something) => {
				let self_params = (something,);
				if let Call::do_something(ref something) = *_other {
					self_params == (something,)
				} else {
					match *_other {
						Call::__PhantomItem(_, _) => {
							::std::rt::begin_panic("internal error: entered unreachable code")
						}
						_ => false,
					}
				}
			}
			Call::cause_error() => {
				let self_params = ();
				if let Call::cause_error() = *_other {
					self_params == ()
				} else {
					match *_other {
						Call::__PhantomItem(_, _) => {
							::std::rt::begin_panic("internal error: entered unreachable code")
						}
						_ => false,
					}
				}
			}
			_ => ::std::rt::begin_panic("internal error: entered unreachable code"),
		}
	}
}
impl<T: Trait> ::frame_support::dispatch::Eq for Call<T> {}
impl<T: Trait> ::frame_support::dispatch::fmt::Debug for Call<T> {
	fn fmt(
		&self,
		_f: &mut ::frame_support::dispatch::fmt::Formatter,
	) -> ::frame_support::dispatch::result::Result<(), ::frame_support::dispatch::fmt::Error> {
		match *self {
			Call::do_something(ref something) => _f.write_fmt(::core::fmt::Arguments::new_v1(
				&["", ""],
				&match (&"do_something", &(something.clone(),)) {
					(arg0, arg1) => [
						::core::fmt::ArgumentV1::new(arg0, ::core::fmt::Display::fmt),
						::core::fmt::ArgumentV1::new(arg1, ::core::fmt::Debug::fmt),
					],
				},
			)),
			Call::cause_error() => _f.write_fmt(::core::fmt::Arguments::new_v1(
				&["", ""],
				&match (&"cause_error", &()) {
					(arg0, arg1) => [
						::core::fmt::ArgumentV1::new(arg0, ::core::fmt::Display::fmt),
						::core::fmt::ArgumentV1::new(arg1, ::core::fmt::Debug::fmt),
					],
				},
			)),
			_ => ::std::rt::begin_panic("internal error: entered unreachable code"),
		}
	}
}
impl<T: Trait> ::frame_support::dispatch::Dispatchable for Call<T> {
	type Trait = T;
	type Origin = T::Origin;
	type Info = ::frame_support::weights::DispatchInfo;
	type PostInfo = ::frame_support::weights::PostDispatchInfo;
	fn dispatch(
		self,
		_origin: Self::Origin,
	) -> ::frame_support::dispatch::DispatchResultWithPostInfo {
		match self {
			Call::do_something(something) => <Module<T>>::do_something(_origin, something)
				.map(Into::into)
				.map_err(Into::into),
			Call::cause_error() => <Module<T>>::cause_error(_origin)
				.map(Into::into)
				.map_err(Into::into),
			Call::__PhantomItem(_, _) => {
				::std::rt::begin_panic_fmt(&::core::fmt::Arguments::new_v1(
					&["internal error: entered unreachable code: "],
					&match (&"__PhantomItem should never be used.",) {
						(arg0,) => [::core::fmt::ArgumentV1::new(
							arg0,
							::core::fmt::Display::fmt,
						)],
					},
				))
			}
		}
	}
}
impl<T: Trait> ::frame_support::dispatch::Callable<T> for Module<T> {
	type Call = Call<T>;
}
impl<T: Trait> Module<T> {
	#[doc(hidden)]
	pub fn dispatch<
		D: ::frame_support::dispatch::Dispatchable<
			Trait = T,
			PostInfo = ::frame_support::weights::PostDispatchInfo,
		>,
	>(
		d: D,
		origin: D::Origin,
	) -> ::frame_support::dispatch::DispatchResultWithPostInfo {
		d.dispatch(origin)
	}
}
impl<T: Trait> Module<T> {
	#[doc(hidden)]
	pub fn call_functions() -> &'static [::frame_support::dispatch::FunctionMetadata] {
		&[
			::frame_support::dispatch::FunctionMetadata {
				name: ::frame_support::dispatch::DecodeDifferent::Encode("do_something"),
				arguments: ::frame_support::dispatch::DecodeDifferent::Encode(&[
					::frame_support::dispatch::FunctionArgumentMetadata {
						name: ::frame_support::dispatch::DecodeDifferent::Encode("something"),
						ty: ::frame_support::dispatch::DecodeDifferent::Encode("u32"),
					},
				]),
				documentation: ::frame_support::dispatch::DecodeDifferent::Encode(&[
					r" Just a dummy entry point.",
					r" function that can be called by the external world as an extrinsics call",
					r" takes a parameter of the type `AccountId`, stores it, and emits an event",
				]),
			},
			::frame_support::dispatch::FunctionMetadata {
				name: ::frame_support::dispatch::DecodeDifferent::Encode("cause_error"),
				arguments: ::frame_support::dispatch::DecodeDifferent::Encode(&[]),
				documentation: ::frame_support::dispatch::DecodeDifferent::Encode(&[
					r" Another dummy entry point.",
					r" takes no parameters, attempts to increment storage value, and possibly throws an error",
				]),
			},
		]
	}
}
impl<T: 'static + Trait> Module<T> {
	#[doc(hidden)]
	pub fn module_constants_metadata(
	) -> &'static [::frame_support::dispatch::ModuleConstantMetadata] {
		&[]
	}
}
impl<T: Trait> ::frame_support::dispatch::ModuleErrorMetadata for Module<T> {
	fn metadata() -> &'static [::frame_support::dispatch::ErrorMetadata] {
		<Error<T> as ::frame_support::dispatch::ModuleErrorMetadata>::metadata()
	}
}
