# Substrate Developer Hub

This repository houses documentation for the [Substrate](https://substrate.io) blockchain framework.

The [docs are written in markdown](docs), processed by [Docusaurus](https://docusaurus.io/), and hosted at the Substrate
[Developer Hub](https://substrate.dev).

## Contributing

Thank you for your interest in contributing to the Developer Hub and to the larger Substrate community! Please review
our contributor guidelines prior to any contribution. If you have any further questions, don't hesitate to
[reach out](https://matrix.to/#/!NdxrIlxGUHXYwtRGrF:matrix.parity.io?via=matrix.parity.io) on our community channels. 

### Directory Structure

This repository is structured as a Docusaurus project with the markdown files organized in the `/docs` directory. Images
and other assets are in the `/docs/assets/` directory. The `/website` directory is a Yarn Docusaurus project with many
helpful scripts (e.g. `yarn build`, `yarn start`) for working with this codebase.  In the `/website` directory you will
find [`sidebars.json`](https://docusaurus.io/docs/en/navigation) and
[`siteConfig.js`](https://docusaurus.io/docs/en/site-config), which are important Docusaurus files. You will find the
source code for some top-level pages in `/website/pages/en`. Follow our [contribution guidelines](CONTRIBUTING.md).

### Adding a new document

To add a new markdown document:

* Create your markdown document in a suitable directory inside `/docs`.
* If you have images in your document, put them in the `/docs/assets/` directory.
* Documentation should follow our [contribution guidelines](CONTRIBUTING.md).
* If you want your document to appear in the sidebar, add its reference in the `/website/sidebar.json` file under the
  corresponding section.

### Rename an existing document

To rename an existing document:

* Change the name or path of the document.
* After the change has been merged, go to the [Crowdin project](https://crowdin.com/project/substrate-developer-hub),
  make sure the translation is already migrated to the new file automatically for all the target languages.
* Then go to [Crowdin project settings](https://crowdin.com/project/substrate-developer-hub/settings#files), remove the
  old source file in `Files` tab.
* If you don't have access to the Crowdin project, please send email to <substrate-developer-hub@parity.io> with the
  file information you want to remove.

### Local Testing

* `cd` into the `/website` directory.
* Execute `yarn install` and then `yarn start`.

The Substrate Developer Hub website should open in a browser window.

#### Link Checker

Once the website is running, you should use the included Yarn script (`yarn check-links`) to ensure that your changes
do not introduce any broken links and to check for any links that have broken since the last time the check was
executed. Please ensure all links are fixed before submitting any changes; if you have questions about broken links that
you did not introduce, please
[create an Issue](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new).

Once you are done with your changes, feel free to submit a PR.

### Staging Deployment

There are two ways to deploy to *staging* environment, which you can access at
[staging.substrate.dev](https://staging.substrate.dev), which is hosted on Heroku. Please check with the team members
for the HTTP basic authentication username and password.

1. Commit to your local repository. Run [`scripts/deploy-staging`](./scripts/deploy-staging). This builds the project
into the docusaurus static site, and force push the static site to `staging` branch. The result is then picked up by
Heroku. Note that multilingual translations are NOT pulled in.

2. Commit to your local repository, and then push to `staging-source` branch. This triggers the CI to build the website
AND also pull in multilingual translations from our Crowdin project. The final built static site is then pushed to the
`staging` branch and deployed to Heroku.

### Updates

There is a helper script that can be used to update `substrate.dev/rustdocs` links in the `docs/knowledgebase`
directory.

```bash
# This examples demonstrates updating links from v2.0.0-rc3 to v2.0.0-rc4
OLD_VERSION=v2.0.0-rc3 NEW_VERSION=v2.0.0-rc4 ./scripts/update-kb-rustdocs
```

### Production Deployment

Our production site is at [substrate.dev](https://substrate.dev). To deploy to production, merge your update into the `source`
branch. This triggers the CI to build the website AND also pull in multilingual translation from our Crowdin project.
The final built static site is then pushed to the `master` branch and hosted on GitHub Pages.

## License

Substrate **documentation** is licenced under the [Apache 2 license](./LICENSE).
