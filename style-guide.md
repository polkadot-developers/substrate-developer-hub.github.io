Documentation Style Guide
===

Our software handles mission-critical systems and the documentation must be clear, precise, and concise.

- Clear: You explain concepts without jargon.
- Precise: Your statements cannot be interpreted in any way other than your intention.
- Concise: Your writing is free of superfluous detail. Every word you write is necessary.

The goal of this guide is to help you achieve these qualities. A consistent style adds to clarity and precision so that users do not interpret different styles as having different meanings.

When you have a question that is not covered here, refer to the AP style guide. For example, if you want to know if you should spell out "versus" or use "vs.", "vs", or "v.", then search for "AP style versus" and it will [tell you what to do](https://writingexplained.org/ap-style/ap-style-versus).

## Clarity and Consistency

### Understand before you write

> “Probably it is better to put off using words as long as possible and get one’s meaning as clear as one can through pictures and sensations. Afterward one can choose—not simply accept—the phrases that will best cover the meaning.”
> \- George Orwell

Before writing documentation - at any level from reference to blog post - you should have a clear understanding of the topic. You should be able to explain the topic in plain language without jargon or metaphor.

Copy/pasting existing documentation and code comments is not a productive way to start. Better ways to start are:

- Read the code.
- Talk to the code author.
- Read the tests.
- See how the code is being used.

### When and How to Use a List

If you have a list of items that is long (>3) or contains long or complex items, that list belongs in bullet points and not in a paragraph.

This list is too long:

> The balances module handles setting and retrieval of free balance, retrieving total balance, reserve and unreserve balance, repatriating a reserved balance to a beneficiary account that exists, transfering a balance between accounts (when not reserved), slashing an account balance, account removal, rewards, lookup of an index to reclaim an account (when not balance not reserved), and increasing total stake.

Not only is this list long, it includes compound list items ("retrieving total balance, reserve and unreserve balance"). Put this list into bullets:

> The balances module handles:
> 
> - Setting and retrieval of free balance.
> - Retrieving total balance, reserve and unreserve balance.
> - Repatriating a reserved balance to a beneficiary account that exists.
> - etc.

If your list contains complete sentences, each one should start with a capital letter and end with a period. A simple rule is: Does each item contain more than one part of speech? If yes, make them sentences.

Further, every item in the list must have the same form. That means:

- If one item is a sentence, they all must be sentences.
- Every item must start with the same part of speech (noun, verb, etc.).

Examples of **incorrect** lists:

> Some different patterns you may see for paying for your smart contract include:
> 
> - A transaction fee associated with creation
> - A subscription model
> - An access token model for which you need to hold a threshold of native tokens to use the platform. EOS has something like this.
> - Storage rent

The third item does not match the form of the others!

> There are a few options you may consider:
> 
> - Hold a referendum on the relay chain...[shortened]
> - Hold a vote between the stakeholders...
> - Users can safely migrate all usage away from...
> - Perform one of the fundraising methods...

Items 1, 2, and 4 start with a verb. Item 3 starts with a noun. Put them into the same form.

### American vs. British

You should use American spellings for words, unless you are referring to a specific item (function, trait, module, etc.). This means:

- Finalize over finalise
- Behavior over behaviour

When in doubt, refer to [ngram](https://books.google.com/ngrams/graph?content=finalize%2C+finalise&case_insensitive=on&year_start=1900&year_end=2018&corpus=15&smoothing=3&share=&direct_url=t4%3B%2Cfinalize%3B%2Cc0%3B%2Cs0%3B%3Bfinalize%3B%2Cc0%3B%3BFinalize%3B%2Cc0%3B%3BFINALIZE%3B%2Cc0%3B.t4%3B%2Cfinalise%3B%2Cc0%3B%2Cs0%3B%3Bfinalise%3B%2Cc0%3B%3BFinalise%3B%2Cc0).

### Check Your Assumptions

When writing reference documentation, refrain from making assumptions about how something will be used, especially with dispatchable and public functions.

Statements like, "This function is usually used for..." make assumptions about what users will do. Even if it is accurate for our own code, its usage may change without being updated.

## Common Grammar and Usage Mistakes

### That vs. Which

"That" and "which" are often used interchangeably in conversational English, but they have different meanings. That is restrictive: you cannot remove it without changing the meaning of the sentence.

> Dispatchable functions that do not have an `origin` parameter in the function signature can only be called by `Root`.

The clause "that do not have an `origin` parameter in the function signature" changes the meaning of the sentence. The sentence would not be true if you removed it.

Which precedes a nonrestrictive clause. Removing it does not change the meaning of the sentence. A nonrestrictive clause is extra information.

> Dispatchable functions, which are listed in the `Call` enum, always include an `origin` parameter after macro expansion.

The clause "which are listed in the `Call` enum" does not change the meaning of the sentence, it only adds information.

Example that can lead to confusion:

> The sudo key can execute dispatchable functions which require a `Root` call.

If you interpret this as nonrestrictive, then this sentence is saying that all dispatchable functions require a `Root` call, which is not true. It should say, "functions **that** require a `Root` call."

Readers can often infer when a "which" clause is restrictive versus unrestrictive. If you want to be precise (you do), always use "that" for a restrictive clause.

### Subject and Pronoun Disagreement

Ensure that pronouns and possessives match the subject they are referring to.

> Incorrect: The process of an account removing their entire holding of an asset.

This is incorrect because "an account" is singular and "their" is plural.

> Correct: The process of an account removing its entire holding of an asset.

This problem can arise when talking about people because English does not have a gender-neutral, singular pronoun.

> Incorrect: When the user submits a transaction, they will need to sign the message.

There are a few ways to solve this:

> **Remove the pronoun (clearest)**</br>
> When the user submits a transaction, the user will need to sign the message.
> 
> **"He or she"**</br>
> When the user submits a transaction, he or she will need to sign the message.
> 
> **Pick a gender**</br>
> When the user submits a transaction, she will need to sign the message.
> 
> **Change the subject**</br>
> When users submit a transaction, they will need to sign the message.

### Setup vs. Set Up (Same for Lookup)

"Setup" and "lookup" can be used as adjectives or nouns.

> Adjective: The lookup mechanism to get account ID.
> 
> Noun: Create an intermediate setup.

"Set up" and "look up" are verbs.

> Use this function to look up the next available index.

### e.g. and i.e.

E.g. means "for example" and is used to give a (usually non-exhaustive) example.

> Substrate includes several modules (e.g., balances, consensus, assets) to help you construct your runtime.

I.e. means "in other words" and is used for further clarification.

> Rust is a statically-typed language (i.e., the variable types are known at compile time).

E.g. and i.e. are abbreviations and should always have a period after each letter. Placing a comma after e.g. or i.e. is optional.

## Programming Specific

When you have a question that is not covered here, your first reference should be the Rust documentation. The Rust Book is also a great resource for style because it discusses several expressions in Rust, so you will almost always be able to find an example.

### SRML Module Names

SRML modules should not be capitalized and should not be in \`backticks\`.

> The following examples show how to use the balances module in your custom module.

When referring to the crate name, use \`backticks\`, e.g. `srml-balances`.

### Types, Traits, Enums, and Structs

When mentioning specific types, traits, enums (and variants), and structs, they should be in \`backticks\`.

> The `Event` type is also generated as a simpler type definition for the `RawEvent` type.

### Functions

When mentioning a specific function, it should be in \`backticks\`. It should not include `()`.

> You can execute these privileged functions by calling `sudo` with the sudo key account.

When listing functions in a bulleted or numbered list, you do not need \`backticks\` if every item is strictly a function.

> Functions in the `LockableCurrency` trait:
> 
> - set_lock
> - extend_lock
> - remove_lock

### Macros

When mentioning a specific macro in a sentence, it should be in \`backticks\` and include an exclamation mark.

> At compile time, the `decl_event!` macro expands to generate the `RawEvent` enum for each module.

When listing macros in a bulleted or numbered list, do not put the exclamation mark. You do not need \`backticks\` if every item is strictly a macro.

> Common macros you will see in the SRML:
> 
> - decl_event
> - decl_storage
> - decl_module

### Examples

When including code examples in your documentation, they must comply with the [style guide](https://wiki.parity.io/Substrate-Style-Guide).

### Links

Links to other documents should be relative paths to avoid broken local paths or outdated http links.

> ```
> [enum](./enum.Call.html)
> ```

### Markdown Lists

Lists in markdown should have one empty line before the first item and one empty line after the last item. There should not be empty lines between items. This will ensure consistent spacing when rendered.

> ```
> This is my list:
> 
> - Item 1
> - Item 2
> - Item 3
> 
> This is my next paragraph.
> ```
