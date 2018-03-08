import React from 'react';

import ReactDOM from "react-dom";

/*
 * TODO
 * Remove this package in favor of komposer in 1.3
 */

MeteorData = function MeteorData( Component, options ){
  let {getData} = (options || {});

  var newComponent = React.createClass({
    displayName: 'meteorData',
    mixins: [ReactMeteorData],

    getMeteorData(){
      return getData(this.props);
    },

    render(){
      return <Component {...this.props} {...this.data}/>;
    }
  });

  return newComponent;
};
