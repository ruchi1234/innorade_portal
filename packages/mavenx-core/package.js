Package.describe({
  name: 'mavenx:core',
  summary: 'maven base startup and util files.',
  version: '0.0.4',
  git: 'https://tewksbum@bitbucket.org/mobywize/mavenx-packages.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {

  api.versionsFrom('1.2.1');

  var packages = [
    'mavenx:lib@0.0.2'
  ];
  api.use(packages);
  api.imply(packages);

  api.addFiles([
    'both/globals.js',
    'both/schema_root.js',
  ], ['client', 'server']);

  api.addFiles([
    'server/startup.js'
  ], ['server']);
});
