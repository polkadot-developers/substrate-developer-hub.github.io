# Cheatsheet on translation work

Set the two environment variable in your shell

- `CROWDIN_SUBSTRATEDEVHUB_ID`: the project ID 
- `CROWDIN_PERSONAL_TOKEN`: your personal crowdin token

Then you can install the [crowdin CLI](https://github.com/crowdin/crowdin-cli/tree/3.4.0) (v3.4)

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

## References:

- [Docusaurus translation](https://docusaurus.io/docs/en/translation)
- [Crowdin CLI](https://support.crowdin.com/cli-tool/)

