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

### Staging Deployment

There are two ways to deploy to *staging* environment, which you can access at [staging.substrate.dev](https://staging.substrate.dev), which is hosted on Heroku. Please check with the team members for the HTTP basic authentication username and password.

1. Commit to your local repository. Run [`scripts/deploy-staging`](./scripts/deploy-staging). This builds the project into the docusaurus static site, and force push the static site to `staging` branch. The result is then picked up by Heroku. Note that multilingual translations are NOT pulled in.

2. Commit to your local repository, and then push to `staging-source` branch. This triggers the CI to build the website AND also pull in multilingual translations from our Crowdin project. The final built static site is then pushed to `staging` branch and deployed to Heroku.

### Production Deployment

Our production site is at [substrate.dev](https://substrate.dev). To deploy to production, push your update in `source` branch. This triggers the CI to build the website AND also pull in multilingual translation from our Crowdin project. The final built static site is then pushed to `master` branch and hosted on GitHub Pages.

## License

Substrate **documentation** is licenced under the [Apache 2 license](./LICENSE).
