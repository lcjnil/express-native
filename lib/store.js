import Realm from 'realm';

const UserSchema = {
  name: 'User',
  properties: {
    phone: 'string',
    privateKey: 'string',
    type: 'string',
    token: 'string'
  }
};

const realm = new Realm({
  schema: [UserSchema],
  schemaVersion: 0,
  migration: (o, n) => o.deleteAll & n.deleteAll()
});
export default realm;