Package.describe({
  name: 'mavenx:react-meteor-data',
  version: '0.0.6',
  // Brief, one-line summary of the package.
  summary: 'React component wrapper to add meteor reactivity to child',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/poetic/react-meteor-data',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use('underscore');
  api.use('react@0.14.2','client');
  api.use('react-meteor-data@0.2.4','client');
  api.addFiles('react-meteor-data.jsx','client');
  api.export("MeteorData",'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('poetic:react-meteor-data');
  api.addFiles('react-meteor-data-tests.js');
});
