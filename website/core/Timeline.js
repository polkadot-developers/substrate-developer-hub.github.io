const React = require('react');

class Timeline extends React.Component {
    render() {
        return (
            <ol className="list-unstyled timeline">{this.props.children}</ol>
        )
    }
}

class Timespot extends React.Component {
    render() {
        return (
            <li className="timeline">{this.props.children}</li>
        )
    }
}

module.exports = {
    Timeline,
    Timespot
}