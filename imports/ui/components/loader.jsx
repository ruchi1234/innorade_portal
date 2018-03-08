import React from 'react';

/*
** file: client.component.loader
** by: MavenX - tewksbum jun 2016
** re:
** reference:
** http://tobiasahlin.com/spinkit/
*/

const Loader = ({ hasHeight }) => (
  <div className={`sk-wrapper ${hasHeight ? 'has-height' : ''}`}>
    <div className="sk-fading-circle">
      <div className="sk-circle1 sk-circle"></div>
      <div className="sk-circle2 sk-circle"></div>
      <div className="sk-circle3 sk-circle"></div>
      <div className="sk-circle4 sk-circle"></div>
      <div className="sk-circle5 sk-circle"></div>
      <div className="sk-circle6 sk-circle"></div>
      <div className="sk-circle7 sk-circle"></div>
      <div className="sk-circle8 sk-circle"></div>
      <div className="sk-circle9 sk-circle"></div>
      <div className="sk-circle10 sk-circle"></div>
      <div className="sk-circle11 sk-circle"></div>
      <div className="sk-circle12 sk-circle"></div>
    </div>
  </div>
);

Loader.propTypes = {
  children: React.PropTypes.node,
  hasHeight: React.PropTypes.bool,
};

export default Loader;
