const React = require('react');

class Timeline extends React.Component {
    render() {
        return (
            <ol class="list-unstyled timeline">{this.props.children}</ol>
        )
    }
}

class Timespot extends React.Component {
    render() {
        return (
            <li class="timeline">{this.props.children}</li>
        )
    }
}

module.exports = {
    Timeline,
    Timespot
}