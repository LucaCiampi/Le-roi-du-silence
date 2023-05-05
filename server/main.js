import { LinksCollection } from "../imports/api/links";


Meteor.startup(async () => {
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});