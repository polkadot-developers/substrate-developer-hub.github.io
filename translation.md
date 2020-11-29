# Cheatsheet on Translation Work

We use [Crowdin](https://crowdin.com/) platform for community translation. To contribute, please create an account in Crowdin, and send the login ID to [Jimmy Chu](mailto:jimmy.chu@parity.io).

[Crowdin CLI](https://github.com/crowdin/crowdin-cli) (v3.x) can be used to view the current translation status and download the translation to run locally. To do this, set the following two environment variables in your shell.

- `CROWDIN_SUBSTRATEDEVHUB_ID`: 361763
- `CROWDIN_PERSONAL_TOKEN`: your personal crowdin token

They are being picked up in the `crowdin.yaml` config file.

## Useful Commands

```bash
# To collect all strings from the project to `en.json`
yarn docusaurus-write-translations

# Download the translation from crowdin platform
crowdin download --verbose -b master

# Upload the source file to crowdin
crowdin upload sources --auto-update -b master

# To check current translation status
crowdin status
```

## Contribute to the Translation

Currently we have contents partially translated to Simplified Chinese (~40%), Japanese (~30%) and Spanish (~30%) as of Nov 27th 2020. We welcome translation of all languages and particularly on the mentioned languages. If you are interested in contributing please contact us at [substrate-developer-hub@parity.io](mailto:substrate-developer-hub@parity.io) .

## References

- [Docusaurus translation](https://docusaurus.io/docs/en/translation)
- [Crowdin CLI](https://support.crowdin.com/cli-tool/)
