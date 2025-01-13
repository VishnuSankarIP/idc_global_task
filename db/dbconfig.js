import { initDB } from 'react-indexed-db-hook';

const dbConfig = {
  name: 'UserDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: true } },
        { name: 'address', keypath: 'address', options: { unique: false } },
        { name: 'password', keypath: 'password', options: { unique: false } },
        { name: 'status', keypath: 'status', options: { unique: false } },
        { name: 'loginHistory', keypath: 'loginHistory', options: { unique: false } }
      ]
    }
  ]
};

// Initialize the database
try {
    initDB(dbConfig);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
  
  export default dbConfig;