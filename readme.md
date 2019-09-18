# Substrate Developer Hub

This repository houses documentation for the [Substrate](https://[parity.io/substrate) blockchain framework.

The docs are written in markdown, processed by docusaurus, and hosted at the Substrate [Developer Hub](https://substrate.dev).

## Contributing

### Directory Structure

The repository is structured as a docusaurus project with the markdown files organized in the `/docs` directory. The images and other assets are in the `/docs/assets/` directory. Follow our [contribution guidelines](CONTRIBUTING.md).

### Adding a new document

To add a new markdown document,

* Create your markdown document in a suitable directory inside `/docs`.
* If you have images in your document, put them in the `/docs/images/` directory.
* Documentation should follow our [contribution guidelines](CONTRIBUTING.md).
* If you want your document to appear in the sidebar, add its reference in the `/website/sidebar.json` file under the corresponding section.

### Rename an existing document

To rename an existing document,

* Change the name or path of the document.
* After the change has been merged, go to the [Crowdin project](https://crowdin.com/project/substrate-developer-hub), make sure the translation is already migrated to the new file automatically for all the target languages. 
* Then go to [Crowdin project settings](https://crowdin.com/project/substrate-developer-hub/settings#files), remove the old source file in `Files` tab.
* If you don't have access to the Crowdin project, please send email to <substrate-developer-hub@parity.io> with the file information you want to remove.

### Local Testing

* `cd` into the `/website` directory.
* Execute `yarn install` and then `yarn start`.

The Substrate Developer Hub website should open in a browser window.

Once you are done with your changes, feel free to submit a PR.

## License

Substrate **documentation** is licenced under the [Apache 2 license](./LICENSE).
