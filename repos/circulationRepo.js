const { MongoClient, ObjectID } = require('mongodb');

function circulationRepo() {

  const url = 'mongodb://localhost:27017';
  const dbName = 'circulation';

  function add(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const addedItem = await db.collection('newspapers').insertOne(item);
        resolve(addedItem.ops[0]);
      } catch(error) {
        reject(error);
      } finally {
        client.close();  
      }
    });
  }

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = db.collection('newspapers').find(query);
        if (limit > 0) {
          items = items.limit(limit);
        }
        resolve(await items.toArray());
      } catch(error) {
        reject(error);
      } finally {
        client.close();  
      }
    });
  }

  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db.collection('newspapers').findOne({
          _id: ObjectID(id)
        });
        resolve(item);
      } catch(error) {
        reject(error);
      } finally {
        client.close();  
      }
    });
  }

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true } );
      try {
        await client.connect();
        const db = client.db(dbName);
        results = await db.collection('newspapers').insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function remove(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true } );
      try {
        await client.connect();
        const db = client.db(dbName);
        removed = await db.collection('newspapers').deleteOne({
          _id: ObjectID(id)
        });
        resolve(removed.deletedCount === 1);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function update(id, newItem) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true } );
      try {
        await client.connect();
        const db = client.db(dbName);
        updateItem = await db.collection('newspapers').findOneAndReplace({
          _id: ObjectID(id)
        }, newItem);
        resolve(updateItem.value);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { add, get, getById, loadData, remove, update }

}

module.exports = circulationRepo();