/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer heroImage heroPadding">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <div className="container">
        <h1 className="projectTitle">
          {siteConfig.title}</h1>
        <p className="lead text-muted">{siteConfig.tagline}</p></div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className={`btn ${props.className}`} href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button className="btn-secondary primary-color" href="#try">Get Started</Button>
            <Button className="btn-secondary" href={docUrl('doc1.html')}>Try a Tutorial</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Button = props => (
        <a className={`btn mr-1 ${props.className}`} href={props.href} target={props.target}>
          {props.children}
        </a>
    );

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{ textAlign: 'center' }}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors',
          },
        ]}
      </Block>
    );

    const Card = props => (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow h-100">
          <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.children}</p>
          </div>
          <div className="card-footer">
            {props.buttons.map((button, index) => {
              return (
                <Button
                  href={button.link}
                  className={
                    `btn-secondary` + (index == 0 ? ` primary-color` : ``)
                  }>{button.name}</Button>
              )
            })}
          </div>
        </div>
      </div>
    );

    const Features = () => (
      <div className="container">
        <div className="row">
          <Card
            title="Documentation"
            buttons={[
              {"name":"High Level Docs", "link":"https://docs.substrate.dev/"},
              {"name":"Reference Docs", "link":"https://crates.parity.io/"}
            ]}>Substrate provides both high level documentation which you can find here and reference level documentation as Rust docs.
          </Card>
          <Card
            title="Join the Community"
            buttons={[
              {"name":"Join the chat!", "link":"https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"},
              {"name":"StackOverflow", "link":"https://stackoverflow.com/questions/tagged/substrate"}
            ]}>Substrate has a rapidly growing, friendly, and technical community. Ask questions and work with others who are building in the space.
          </Card>
          <Card
            title="Tutorials"
            buttons={[
              {"name":"Tutorial Catalog", "link":"https://substrate-developer-hub.github.io/tutorials/"}
            ]}>Substrate has a range of tutorials to take you from 0-60 in a short amount of time. Learn about runtime development, building smart contracts, setting up a network, and more!
          </Card>
        </div>
      </div>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
