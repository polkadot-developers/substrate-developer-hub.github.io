# Cheatsheet on translation work

- Make the translation in [crowdin platform](https://crowdin.com/)
  
  - register a login, and send the login ID to Jimmy 

- You can use the [crowdin CLI](https://github.com/crowdin/crowdin-cli/tree/3.4.0) (v3.4) to view the current translation status and download the translation to run locally. To do this, set the following two environmental variables in your shell.

  - `CROWDIN_SUBSTRATEDEVHUB_ID`: the project ID 
  - `CROWDIN_PERSONAL_TOKEN`: your personal crowdin token

## Usual Commands

```bash
# To collect all strings from the project to `en.json`
yarn docusaurus-write-translations

# download the translation from crowdin platform
crowdin download --verbose -b master

# upload the source file to crowdin
crowdin upload sources --auto-update -b master

# To check current translation status
crowdin status
```

## Contribute to Translation

Currently we have contents partially translated to Simplified Chinese (~40%), Japanese (~30%) and Spanish (~30%) as of Nov 27th 2020. We welcome translation of all languages and particularly on the mentioned languages. If you are interested in contributing please contact us at [substrate-developer-hub@parity.io](mailto:substrate-developer-hub@parity.io) .

## References:
- [Docusaurus translation](https://docusaurus.io/docs/en/translation)
- [Crowdin CLI](https://support.crowdin.com/cli-tool/)
