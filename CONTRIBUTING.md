Contribution Guidelines
===

If you are interested in contributing to the Substrate Documentation, please carefully read
these contribution guidelines.

We lovingly stole these guidelines from [Google's Fuchsia project](https://fuchsia.dev/), and modified them for our needs.

* [Documentation Types](#documentation-types)

* [Documentation Standards](#documentation-types)

* [Documentation Comments](#documentation-types)

* [General Style Guidelines](#general-style-guidelines)

* [Respectful Code Policy](#respectful-code)

# Documentation Types
Documentation is an important part of any product or feature because it lets users know how to
properly use a feature that has been implemented. These guidelines are meant to be a quick and easy
reference for types of documentation. For information on documentation style guidelines, see
[Documentation Style Guide](documentation_style_guide.md).
## Conceptual, procedural, or reference documentation
Most documentation can be divided into these categories:
- [Reference](#reference-documentation) - Documentation that provides a source of information about
  parts of a system such as API parameters.
- [Conceptual](#conceptual-documentation) - Documentation that helps you understand a concept such
  as mods in Fuchsia.
- [Procedural](#procedural-documentation)
    - How-to - Documentation that provides steps on how to accomplish a goal such as create a user.
    - Codelab - Documentation that provides steps of a learning path (this tends to be a much bigger
      procedure than a how-to) such as create a component.
**You should write a reference document** if you need to provide information about parts of a system
including, but not limited to APIs and CLIs. Reference documentation should allow the user to
understand how to use a specific feature quickly and easily.
**You should write a conceptual document** if you plan on explaining a concept about a product.
Conceptual documents explain a specific concept, but for the most part they do not include actual
examples. They provide essential facts, background, and diagrams to help your readers build a
foundational understanding of a product or topic. You should not explain industry standards that
your audience should be familiar with, for example, TCP/IP. You might explain how this concept ties
in with your feature, but you should not explain the basics behind that industry standard concept.
**You should write a procedural document** if you plan on explaining to a user how to use a specific
feature and are able to guide a user through simple numbered steps. Procedural documents tend to
reinforce the concepts that were explained in a conceptual document by giving one or more
examples that might be useful for users.
Procedural documents are divided into two categories:
- **How-to** - Consider writing a how to when you want to help the user accomplish a very specific
  goal.
- **Codelab** - Consider writing a codelab when you want to help the user learn about a bigger
  goal that might involve working with multiple parts of a product or feature. The codelab should not
  go over 60 minutes and should provide the user with a specific result.
How can you decide what type of document is appropriate for your use case? Consider these examples:
- What is a car? This is a conceptual document.
- How does an internal combustion engine work? This is a conceptual document that would be geared
  towards more advanced users.
- How to use the alarm manager in Android. That is a procedural document. The main set of
  procedures can be a codelab since a hand-held example is ideal to understand the function of the
  alarm manager.
- How to operate the radio. This is a procedural document. This can be a how to guide since the
  use of a radio tends to be quite intuitive and in most cases wouldn't require a hand-held example.
- How does a transistor work? This is a conceptual document that would be geared towards a more
  advanced user.
- Functions of the car radio. This is a reference document.
- How a new technology improved the car radio. This is a conceptual document.
Note: A feature may require more than one type of document. You may decide that your feature
requires just reference documentation or that you need reference, conceptual, and how to
documentation.
## Reference documentation {#reference-documentation}
Reference documentation should provide information about parts of a system including, but not
limited to APIs and CLIs. The style of reference documentation should be the same for all reference
documentation of that type. For example, API documentation should define all of the API's parameters,
indicate if a parameter is required or optional, and show examples of the use of the API. These
examples should be very generic and simple. If you feel like you need a more elaborate example,
consider creating a procedural document to reinforce your reference documentation.
For the style guide for API documentation, see
[API style guide](../development/api/documentation.md).
## Conceptual documentation {#conceptual-documentation}
Conceptual documentation should try to be brief and for the most part should not go above 1 page.
If you need to write more than one page to describe a concept, consider breaking that concept into
sub-concepts by using headings. By keeping your document brief you achieve the following:
- You do not overwhelm your reader with a wall of text.
- Avoid losing the reader while they read your document.
The first paragraph should try to be a brief summary of your document, this should allow the user to
quickly read through it, determine what the document covers, and if this is relevant to what they
want to learn. If your document has multiple headings, you should include a bulleted list with the
high-level headings after this first paragraph.
You should use graphics, images, or diagrams to reinforce certain concepts. The text that comes
before and after the graphic should explain what the graphic shows. Images should be saved in
a feature specific 'images/' directory or a common 'images/' directory. You should also save
the source file of your images in a 'images/src/' directory.
Good conceptual documentation usually includes:
- **Description** rather than instruction
- **Background** concepts
- **Diagrams** or other visual aids (preferably in .png format)
- **Links** to how-to and/or reference docs
After writing your document, it is good practice to proofread the document, put yourself in the
user's shoes (no longer being the expert that developed the feature), and try to answer these
questions:
- Does the information in the document explain the concept completely?
- Is there information that is not needed for this concept? If so, remove it.
- Is there unnecessary detail about how things might work in the background?
- If I am the user, is there additional I would have liked to know?
Then, add your feedback into your document.
## Procedural documentation {#procedural-documentation}
Procedural documents are divided into two categories:
- **How-to** - Consider writing a how to when you want to help the user accomplish a very specific
  goal.
- **Codelab** - Consider writing a codelab when you want to help the user learn about a bigger goal
  that might involve working with multiple parts of a product or feature.
Procedural documentation should try to be brief and each task within your documentation should try
to avoid going above 10 steps (codelabs can be much longer, but should not exceed 45-60 minutes for
a user to complete). You should divide long procedures into multiple sub-tasks to try to keep tasks
manageable for a user. For example, if you wanted to write a procedural document for taking care of
a dog, you might have a table of content that looks like this:
How to take care of a dog:
- Feeding a dog
- Washing a dog
- Trimming a dog's nails
- Brushing a dog
- Playing with a dog
### Difference between a codelab and a how to
At a very high-level, a codelab is essentially a large how to, composed of various smaller how tos.
Codelabs are great when you want to give the user a hand-held experience of working through a task,
especially if this task is considered a little more complicated and might involve working with
various areas of a product. On the other hand, a how to should describe the steps on how to work
through a minor task that should only involve a single area of a product.
Consider the following when you think that you might need to create a codelab:
- How many codelabs are planned for this general feature? Keep in mind that you do not want a
  whole documentation set to just be codelabs, use them in moderation.
- Codelabs should be self-contained, avoid creating links to other codelabs, other how-tos or
  other information that might have a user leave the actual codelab. It is ok to provide links to
  conceptual documents that can enhance a user's knowledge for a given topic.
- Would this procedural documentation benefit from having a very specific example through a
  codelab?
- Do you want to expose an exciting feature from the product through the codelab? This helps you
  highlight a neat feature that a user might not know about without doing a codelab.
### General procedural documentation guidelines
- Each task or subtask should have a paragraph that lets a user know what the task is about and
  what a user should be able to do after performing the steps.
- Use screenshots or graphics to assist a user in navigating a user interface (UI).
- A procedural document should not have to explain any concepts to a user, but should reference
  conceptual documents in case a user does not know about a certain concept. For example, a
  procedure with a reference to a conceptual document might look like this:
   Configure the server with the appropriate configuration. For more information about server
   configurations, see "server configuration".
- Avoid giving the users multiple paths to select when working through procedures. When you avoid
  giving the user choices, your documentation should lead all users to the same end result (for
  example, starting the server).
- If a procedural document is meant for beginner users, avoid adding procedures that you might
  consider better suited for advanced users. If your document is intended for advanced users, state
  it up front and give them a list of prerequisites before they go through your how to or codelab.

---

# Documentation Standards
A document about what to document and how to document it for people who create things that need
documentation.
## Why document?
Fuchsia is a new operating system. Effective documentation allows new people to join and grow the
project by having all necessary documentation be clear and concise.
## Who is the audience?
The documentation described here is intended to address a technical audience, i.e. those who expect
to implement or exercise APIs or understand the internal dynamics of the operating system. These
standards are not intended for end-user product documentation.
## What should I document?
Document protocols, introduce essential concepts, explain how everything fits together.
- Conventions: e.g. this document about documentation, code style
- System Design: e.g. network stack, compositor, kernel, assumptions
- APIs: e.g. FIDL protocols, library functions, syscalls
- Protocols: e.g. schemas, encodings, wire formats, configuration files
- Tools: e.g. `bootserver`, `netcp`, `fx`
- Workflows: e.g. environment set up, test methodologies, where to find various
  parts, how to get work done
## Where should I put documents?  What goes where?
Documentation that is only for developers working on creating or maintaining
a specific part of the code should be kept in the same directory as the source code.
Documentation that should be generally available to developers must be
available in one of two locations:
* Zircon specific documentation should be created in `/docs/zircon`.
* Fuchsia documentation that is not specific to Zircon specific should
   be created in `/docs`.  In the `/docs/` directory, you should create your
   documentation or images in one of these sub-directories:
    * `best-practices`
       General best practice guidelines on how to develop with Fuchsia source.
       If you create best practice documentation about about using a specific
       feature of Fuchsia, you should create the documentation in the same
       directory as the other documentation for that specific feature.
    *  `development`
        Instructions, tutorials, and procedural documentation for developers
        that are working on Fuchsia. This directory includes documentation
        on how to get started, build, run, and test Fuchsia and software
        running on devices operating Fuchsia. You should organize the content
        that you create by specific activities, such as testing, getting
        started, or by workflow topic.
    * `the-book`
        Concept and developer guides about the features of Fuchsia. You
        should organize the content that you create by specific features.
    * `images`
        Images that are used in the documentation. You should place images in
        this common directory and avoid placing images in the same directory
        as documentation.
## What documentation should I create?
Most documentation can be divided into four categories:
- [Reference](documentation_types.md#reference-documentation) - Information-oriented documentation
- [Conceptual](documentation_types.md#conceptual-documentation) - Understanding-oriented
  documentation
- [Procedural](documentation_types.md#procedural-documentation)
    - How to - Goal-oriented documentation
    - Codelab - Learning-oriented documentation
See [Documentation Types](documentation_types.md) for more information.
However, comments in your code are very important for maintainability and helping other people
understand your code. See the [Code Comment Guidelines](documentation_comments.md) for style guidelines
related to comments for your code.
## What documentation style guidelines should I follow?
It is important to try to follow documentation style guidelines to ensure that the documentation
created by a large number of contributors can flow together. See
[Documentation Style Guide](documentation_style_guide.md).
## How can I link to source code in my documentation?
Use absolute paths starting with '/', like [`/zircon/public/sysroot/BUILD.gn`](/zircon/public/sysroot/BUILD.gn).
Never use relative paths with ".." that point to content outside of `/docs`.
## How can I expose my documentation?
Documentation is only useful when users can find it. Adding links to or from existing documentation
greatly improves the chances that someone can find your documentation.
Tips for leaving breadcrumbs:
- Table of contents: Add links to documentation in the left sided navigation
  on fuchsia.dev. See
  [Change table of contents navigation](documentation_navigation_toc.md).
- Top-down linkage: Add links from more general documents to more specific documents to help
  readers learn more about specific topics. The [Fuchsia book](../the-book/README.md) is a good
  starting point for top-down linkage.
- Bottom-up linkage: Add links from more specific documents to more general documents to help
  readers understand the full context context of the topics being discussed. Adding links from
  module, class, or protocol documentation comments to conceptual documentation overviews can be
  particularly effective.
- Sideways linkage: Add links to documents on subjects that help readers better understand the
  content of your document.

---

# Documentation Comments
Comments in your code are very important for maintainability and helping other people
understand your code. Documentation comments are especially effective at describing
the purpose of protocols, structures, methods, data types, and other elements of
program code.
Documentation comments should be applied consistently to all public APIs since they are
a valuable asset for SDK consumers.
Tips for writing effective documentation comments:
- Write in plain U.S. English.
- Write complete sentences and paragraphs.
- Write clear and brief comments, no more than a few sentences.
- Follow the approved style guide for your programming language.
- Avoid creating running words that are not compound words. For example "notready" is two words
  run together. Use an appropriate separator, for example "not ready", "notReady", "not_ready", or
  "not-ready").
- Always add value. Don't restate what is already indicated by the type signature.
- Describe units of measure and integrity constraints of variables.
- Link to conceptual documentation for more complete descriptions of how APIs fit together as a
  whole.
- Follow the approved style guide for your programming language. See the
  [Development Readme](../development/README.md) for style guidelines related to specific
  programming languages.
## What documentation style guidelines should I follow?
It is important to try to follow documentation style guidelines to ensure that the documentation,
even comments, can flow together. See [Documentation Style Guide](documentation_style_guide.md).
Also, see the [Development Readme](../development/README.md) for style guidelines
related to specific programming languages.

---

# General Style Guidelines
It is important to create documentation that follows similar guidelines. This allows documentation
to be clear and concise while allowing users to easily find necessary information. For information
about the complete documentation standards, see
[Documentation Standards](documentation_standards.md).
These are general style guidelines that can help create clearer documentation:
- **Write in plain U.S. English.** You should write in plain U.S. English and try to avoid over
  complicated words when you describe something.
- **Avoid using pronouns such as "I" or "we".** These can be quite ambiguous when someone reads the
  documentation. It is better to say "You should do…." instead of "We recommend that you do….". It
  is ok to use "you" as this allows the documentation to speak to a user.
- **If you plan on using acronyms, you should define them the first time you write about them.** For
  example, looks good to me (LGTM). Don't assume that everyone will understand all acronyms. You do
  not need to define acronyms that might be considered industry standards such as TCP/IP.
- **In most cases, avoid future tense.** Words such as "will" are very ambiguous. For example "you
  will see" can lead to questions such as "when will I see this?". In 1 minute or in 20 minutes? In
  most cases, assume that when someone reads the documentation you are sitting next to them and
  reading the instructions to them.
- **Use active voice.** You should always try to write in the active voice since passive voice can
  make sentences very ambiguous and hard to understand. There are very few cases where you should
  use the passive voice for technical documentation.
  - Active voice - the subject performs the action denoted by the verb.
    - "The operating system runs a process." This sentence answers the question on what is
      happening and who/what is performing the action.
  - Passive voice - the subject is no longer _active_, but is, instead, being acted upon by the
    verb - or passive.
    - "A process is being run." This sentence is unclear about who or what is running the process.
      You might consider "a process is run by the operating system", but the object of the action
      is still made into the subject of the sentence which indicates passive voice. Passive voice
      tends to be wordier than active voice, which can make your sentence unclear. In most cases,
      if you use "by" this indicates that your sentence might be still be in passive voice. A
      correct way of writing this example is "The operating systems runs the process."
- **Do not list future plans for a product/feature.** "In the future, the product will have no
  bugs." This leads to the question as to when this would happen, but most importantly this is not
  something that anyone can guarantee will actually happen.
- **Do not talk about how certain features work behind the covers unless it is absolutely necessary.**
  Always ask yourself, "Is this text necessary to understand this concept or to get through these
  instructions?" This also leads to shorter (less maintenance) and more concise (happier readers)
  documentation.
- **Avoid using uncommon words, highly technical words, or jargon that users might not understand.**
  Also, avoid using idioms such as "that's the way the cookie crumbles", while it might make sense
  to you, it could not translate well into another language. Keep in mind that a lot of users are
  non-native English speakers.
- **Use compound words correctly.** Use the compound words that give the correct meaning.
  For example, "set up" (verb)  and "setup" (noun) have different meanings.
- **Avoid using words such as "best" or "great" since these are all relative terms.** How can you
  prove that "this operating system is the best?"
- **Avoid referencing proprietary information.** This can refer to any potential terminology or
  product names that may be trademarked or any internal information (API keys, machine names, etc…)
- **Avoid starting a sentence with "this" since it is unclear what "this" references.**
  - For example: "The operating system is fast and efficient. This is what makes it well designed."
    Does "this" refer to fast, efficient, or operating system? Consider using: "The operating system
    is well designed because it is fast and efficient".
- **Keep sentences fairly short and concrete.** Using punctuation allows your reader to follow
  instructions or concepts. If by the time you read the last word of your sentence, you can't
  remember how the sentence started, it is probably too long. Also, short sentences are much easier
  to translate correctly.
- **Know your audience.** It is good practice to know your audience before you write documentation.
  Your audience can be, for example, developers, end-users, integrators, and they can have varying
  degrees of expertise and knowledge about a specific topic. Knowing your audience allows you to
  understand what information your audience should be familiar with. When a document is meant for a
  more advanced audience, it is best practice to state it up front and let the user know
  prerequisites before reading your document.
- **Use markdown.** You must create documentation in markdown (.md) and keep the markdown file
  wrapped to a 80 character column size.
- **Be respectful** Follow the guidelines set forth in [Respectful Code](respectful_code.md).

---

# Respectful Code
Inclusivity is central to Fuchsia's culture, and our values include treating
each other with dignity. As such, it’s important that everyone can contribute
without facing the harmful effects of bias and discrimination.  However, terms
in our codebase, UIs, and documentation can perpetuate that discrimination.
This document sets forth guidance which aims to address disrespectful
terminology in code and documentation.
## Policy
Terminology that is derogatory, hurtful, or perpetuates discrimination, either
directly or indirectly, should be avoided.
## What is in scope for this policy?
Anything that a contributor would read while working on Fuchsia, including:
- Names of variables, types, functions, files, build rules, binaries, exported
  variables, ...
- Test data
- System output and displays
- Documentation (both inside and outside of source files)
- Commit messages
## Principles
- Be respectful: Derogatory language shouldn’t be necessary to describe how
  things work.
- Respect culturally sensitive language:  Some words may carry significant
  historical or political meanings.  Please be mindful of this and use
  alternatives.
## How do I know if particular terminology is OK or not?
Apply the principles above.  If you have any questions, you can reach out to
fuchsia-community-managers@google.com.
## What are examples of terminology to be avoided?
This list is NOT meant to be comprehensive.  It contains a few examples that
people have run into frequently.
| Term      | Suggested alternatives                                        |
| --------- | ------------------------------------------------------------- |
| master    | primary, controller, leader, host                             |
| slave     | replica, subordinate, secondary, follower, device, peripheral |
| whitelist | allowlist, exception list, inclusion list                     |
| blacklist | denylist, blocklist, exclusion list                           |
| insane    | unexpected, catastrophic, incoherent                          |
| sane      | expected, appropriate, sensible, valid                        |
| crazy     | unexpected, catastrophic, incoherent                          |
| redline   | priority line, limit, soft limit                              |
## What if I am interfacing with something that violates this policy?
This circumstance has come up a few times, particularly for code implementing
specifications.  In these circumstances, differing from the language in the
specification may interfere with the ability to understand the implementation.
For these circumstances, we suggest one of the following, in order of decreasing
preference:
1. If using alternate terminology doesn't interfere with understanding, use
   alternate terminology.
2. Failing that, do not propagate the terminology beyond the layer of code that
   is performing the interfacing.  Where necessary, use alternative terminology
   at the API boundaries.