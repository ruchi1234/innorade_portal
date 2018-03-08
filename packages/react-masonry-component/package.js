Package.describe({
  name: 'mavenx:react-masonry-component',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
    'masonry-layout': '4.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use([
      'shcherbin:imagesloaded@3.1.8',
  ], 'client');

  api.mainModule('react-masonry-component.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('react-masonry-layout');
  api.addFiles('react-masonry-layout-tests.js');
});
