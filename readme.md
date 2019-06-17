# Substrate Developer Hub

This repository houses documentation for the [Substrate](https://[parity.io/substrate) blockchain framework.

The docs are written in markdown, processed by docusaurus, and hosted at the Substrate [Developer Hub](https://substrate.dev).

## Contributing

### Directory Structure

The repository is structured as a docusaurus project with the markdown files organized in the `/docs` directory. The images and other assets are in the `/docs/assets/` directory.

### Adding a new document

To add a new markdown document,

* Create your markdown document in a suitable directory inside `/docs`.
* If you have images in your document, put them in the `/docs/assets/` directory.
* Documentation should follow our [styleguide](style-guide.md).
* If you want your document to appear in the sidebar, add its reference in the `/website/sidebar.json` file under the corresponding section.

### Local Testing

* `cd` into the `/website` directory.
* Execute `yarn install` and then `yarn start`.

The Substrate Developer Hub website should open in a browser window.

Once you are done with your changes, feel free to submit a PR.

## License

Substrate **documentation** is licenced under the [Apache 2 license](./LICENSE).
