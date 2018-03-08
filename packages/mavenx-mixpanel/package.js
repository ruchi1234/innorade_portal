Package.describe({
  name: 'mavenx:mixpanel',
  summary: 'files needed to open mxp connection and push data',
  version: '0.0.5',
  git: 'https://tewksbum@bitbucket.org/mobywize/mavenx-packages.git',
  documentation: 'README.md',
});

Package.onUse(function (api) {

  api.versionsFrom('1.2.1');

  const packages = [
    'mavenx:core@0.0.2',
  ];
  api.use(packages);
  api.imply(packages);

  api.addFiles([
    'server/mixpanel_api.js',
  ], ['server']);

  api.export([
    'MixpanelAPI',
  ], ['server']);
});
