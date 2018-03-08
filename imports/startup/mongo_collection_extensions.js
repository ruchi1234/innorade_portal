import { Mongo } from 'meteor/mongo';

Mongo.Collection.prototype.attachApi = function attachApi(api) {
  if (!this.api) { this.api = {}; }

  _.extend(this.api, api);
};

Mongo.Collection.prototype.attachQueryHelpers = function attachQueryHelpers(qh) {
  if (!this.queryHelpers) { this.queryHelpers = {}; }

  _.extend(this.queryHelpers, qh);
};

Mongo.Collection.prototype.getName = function getName() {
  return this.alias || this._name;
};
