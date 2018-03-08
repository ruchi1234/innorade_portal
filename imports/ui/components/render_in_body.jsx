import React from 'react';
import ReactDOM from 'react-dom';

const RenderInBody = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  componentDidMount() {
    this.popup = document.createElement('div');
    document.body.appendChild(this.popup);
    this._renderLayer();
  },

  componentDidUpdate() {
    this._renderLayer();
  },

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
  },

  _renderLayer() {
    ReactDOM.render(this.props.children, this.popup);
  },

  render() {
    // Render a placeholder
    return React.DOM.div(this.props);
  },
});

export default RenderInBody;
