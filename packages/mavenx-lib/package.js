Package.describe({
  name: 'mavenx:lib',
  summary: 'maven third party libraries and global namespace.',
  version: '0.0.5',
  git: 'https://tewksbum@bitbucket.org/mobywize/mavenx-packages.git',
  documentation: 'README.md',
});

Package.onUse(function (api) {

  Npm.depends({
    // "react": "0.14.8",
    // "react-dom": "0.14.8",
    chalk: '1.1.1',
  });

  const packages = [

    'check',
    'ecmascript',
    'email',
    'http',
    // 'less',
    // 'mixpanel',
    // 'random',
//    'react@0.14.2',
    'react-meteor-data',   // part of the new 1.3 way of doing things...
    // 'reactive-dict',
    // 'reactive-var',
    'random',
    'reactive-var',                     // Non session reactive variables
    'service-configuration',            // # used to configure FB login, etc.
    // 'spiderable',
    'session',  // for client side IP address
    'tracker',
    'underscore',


    'accounts-facebook',
    'accounts-google',
    'accounts-password',
    'accounts-twitter',
    // 'alanning:roles',
    'aldeed:collection2@2.9.0',
    'anti:fake',                    // Fake data for development seeding
    // 'archive:jquery-dotdotdot',
    // 'audit-argument-checks',
    'ccorcos:subs-cache@0.1.0',
    'cosmos:browserify@0.9.2',
    'dburles:collection-helpers@1.0.4',   // Helpers for documents in a collection
    'dburles:factory@0.4.2',              // Used to create seed data
    'dferber:prerender',
    'edgee:slingshot@0.7.1',
    // 'fortawesome:fontawesome@4.5.0',
    'fourseven:scss@3.4.3',
    // 'harrison:papa-parse@1.1.1',
    // 'ian:accounts-ui-bootstrap-3',
    // 'iron:router',
    // 'jeremysaks:underscore-nudge',
    // 'juliancwirko:s-alert',
    // 'juliancwirko:s-alert-genie',
    // 'kadira:flow-router-ssr@3.11.1',
    'kadira:dochead@1.4.0',
    'kadira:flow-router@2.10.1',
    // 'kadira:react-layout@1.5.3',
    // 'lepozepo:s3@5.1.6',
    // 'manuel:reactivearray',
    'matb33:collection-hooks@0.8.1',
    'mavenx:react-masonry-component',
    'mdg:validated-method',
    // 'mdg:seo',                      // Pull in prerender.io and config
    // 'meteorhacks:kadira@2.28.1',
    // 'meteorhacks:kadira',
    // 'meteorhacks:kadira-debug',
    // 'meteorhacks:kadira-debug@1.3.3',
    // 'meteorhacks:ssr@2.2.0', //need for email?
    'meteorhacks:ssr@2.2.0',
    // 'mizzao:timesync@0.3.4',
    // 'mizzao:user-status@0.6.6',
    'momentjs:moment',              // Date handling. Great for things like time change etc
    // 'msavin:mongol@1.6.2',
    // 'okgrow:router-autoscroll@0.1.7',
    // 'ongoworks:security',
    // 'peppelg:bootstrap-3-modal',
    'percolate:migrations',
    'percolate:synced-cron@1.3.0', // Locked at 1.3.0, 1.3.1 has issue with tinytest, probably meteor 1.3 related
    // 'reywood:bootstrap3-sass@3.3.5_2',
    // 'sacha:spin@2.3.1',
    // 'tewksbum:server-session',
    'seba:minifiers-autoprefixer',  // auto-prefix adds all the css release candidates
    'themeteorchef:bert@2.1.0',      // ref: https://themeteorchef.com/snippets/client-side-alerts-with-bert/
    'tmeasday:publish-counts@0.7.3',
    'twbs:bootstrap',
    // 'underscorestring:underscore.string@3.3.4',
    // 'yogiben:mixpanel@0.1.2',
    // 'zenorocha:clipboard@1.5.9',
    // 'zimme:active-route@2.3.2'
    'xolvio:cleaner',
    'zimme:collection-softremovable@1.0.5',
    'zimme:collection-timestampable@1.0.9',
  ];

  api.versionsFrom('1.2.1');
  api.use(packages);
  api.imply(packages);

  api.addFiles([
    'client/mavenx.browserify.js',
  ], ['client']);

  api.addFiles([
    'lib/core.js',
  ], ['client', 'server']);

  api.addFiles([
    'server/npm-packages.js',
  ], ['server']);

  api.export([
    'Mavenx',
  ]);

  api.export([
    // 'chalk',
    // 'React',
    // 'ReactDOM'
  ], ['client']);
});
