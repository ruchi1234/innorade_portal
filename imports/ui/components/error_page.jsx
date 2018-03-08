import React from 'react';

// const ErrorPage = React.createClass({
//   render() {
//     return (
//       <div className="error-page">
//         <h2>{this.props.children}</h2>
//       </div>
//     );
//   },
// });

const ErrorPage = () => (
  <div className="error-page">
    <h2>{this.props.children}</h2>
  </div>
);

ErrorPage.propTypes = {
  children: React.PropTypes.node,
};

export default ErrorPage;
