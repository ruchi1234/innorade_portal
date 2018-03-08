Slingshot.createDirective("mavenS3Uploads", Slingshot.S3Storage, {
  bucket: 'clipboards',
  maxSize: 30 * 1024 * 1024, // 2 MB (use null for unlimited)
  acl: 'public-read',
  //region: 'us-east-1',
  AWSAccessKeyId: Meteor.settings.services.slingshot.AWSAccessKeyId,
  AWSSecretAccessKey: Meteor.settings.services.slingshot.AWSSecretAccessKey,
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    //var user = Meteor.users.findOne(this.userId);
    //return user.username + "/" + file.name;
    return Random.id();
  }
});
