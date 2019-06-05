const React = require("react");

const Container = require("react-bootstrap/Container.js");
const Button = require("react-bootstrap/Button.js");

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const SplashContainer = props => (
      <div
        className={`homeContainer heroImage pt-${this.props.padding} pb-${
          this.props.padding
        }`}
      >
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <Container>
        <h1 className="projectTitle">{this.props.title}</h1>
        <p className="lead text-muted">{this.props.tagline}</p>
      </Container>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            {this.props.buttons
              ? this.props.buttons.map((button, index) => {
                  return (
                    <Button
                      variant="secondary"
                      href={button.link}
                      className={`mr-2` + (index == 0 ? ` primary-color` : ``)}
                    >
                      {button.name}
                    </Button>
                  );
                })
              : ""}
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

module.exports = HomeSplash;
