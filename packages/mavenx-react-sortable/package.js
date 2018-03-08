Package.describe({
  name: 'mavenx:react-sortable',
  version: '0.0.1',
  summary: 'Package for https://github.com/RubaXa/Sortable/blob/master/react-sortable-mixin.js#L26',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript']);
  api.addFiles([
    'Sortable/Sortable.js',
    'Sortable/react-sortable-mixin.js'
  ], 'client');

  api.export(['Sortable', 'SortableMixin'], 'client');
});
