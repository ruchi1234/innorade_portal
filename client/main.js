import '/imports/startup/mongo_collection_extensions';
import '/imports/startup/client/verify_email';

import '/imports/api/boards/methods';
import '/imports/api/clips/methods';
import '/imports/api/products/methods';
import '/imports/api/retailers/methods';
import '/imports/api/users/methods';

// These should be the only modules needed to import, since
// Other collections are generally required elsewhere, these have
// side effects but no real export
import '/imports/modules/users/users';

import '/imports/startup/client/routes';
import '/imports/startup/client/startup';

import '/imports/startup/client/mixpanel';
import '/imports/startup/client/routes.mixpanel';

import '/imports/startup/client/modal';
