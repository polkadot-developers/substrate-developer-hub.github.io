/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const {config: siteConfig} = props;
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${
    siteConfig.projectName
  }`;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <p>Substrate is under very active development.</p>
          <h3 id="latest">Current version (Stable)</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language ? props.language + '/' : ''
                    }getting-started`}>
                    Documentation
                  </a>
                </td>
                <td>
                  <a href="https://github.com/paritytech/substrate/releases/tag/untagged-6dcad12c03fc00d301ad">Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Version 1.0.0 aims to be a stable target to develop against. These are the most complete docs currently available.
          </p>
          <h3 id="rc">Pre-release versions</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>master</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language ? props.language + '/' : ''
                    }next/getting-started`}>
                    Documentation
                  </a>
                </td>
                <td>
                  <a href="https://github.com/paritytech/substrate">Source Code</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>New code is committed to the master branch daily, and these docs will certainly lag behind in some places. They are updated on a best-effort basis and contributions are welcome. For a more stable target, use 1.0.0</p>
          {
            // Joshy commented this section out because the empy
            // Table was confusing. It should be re-enables if
            // or when we have more versions of the docs.
            /*
          <h3 id="archive">Past Versions</h3>
          <p>Here you can find previous versions of the documentation.</p>
          <table className="versions">
            <tbody>
              {versions.map(
                version =>
                  version !== latestVersion && (
                    <tr>
                      <th>{version}</th>
                      <td>
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                            props.language ? props.language + '/' : ''
                          }${version}/getting-started`}>
                          Documentation
                        </a>
                      </td>
                      <td>
                        <a href={`${repoUrl}/releases/tag/v${version}`}>
                          Release Notes
                        </a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          */}
        </div>
      </Container>
    </div>
  );
}

module.exports = Versions;
