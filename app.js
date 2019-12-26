const { MongoClient } = require('mongodb');
const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main(){

  const client = new MongoClient(url, { useUnifiedTopology: true } );
  await client.connect();

  try {
    // Load data
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);

    // Get
    const getData = await circulationRepo.get();
    assert.equal(data.length, getData.length);

    // Get by filter
    const filterData = await circulationRepo.get({
      Newspaper: getData[4].Newspaper
    });
    assert.deepEqual(filterData[0], getData[4]);

    // Get by limit
    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);

    // Get by id 
    const id = getData[4]._id;
    const byId = await circulationRepo.getById(id);
    assert.deepEqual(byId, getData[4]);

    // Add
    const newItem = {
      "Newspaper": "My paper",
      "Daily Circulation, 2004": 1,
      "Daily Circulation, 2013": 2,
      "Change in Daily Circulation, 2004-2013": 100,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0
    };
    const addedItem = await circulationRepo.add(newItem);
    assert(addedItem._id);
    const addedItemQuery = await circulationRepo.getById(addedItem._id);
    assert.deepEqual(addedItemQuery, newItem);

    // Update
    await circulationRepo.update(addedItem._id, {
      "Newspaper": "My new paper",
      "Daily Circulation, 2004": 1,
      "Daily Circulation, 2013": 2,
      "Change in Daily Circulation, 2004-2013": 100,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0      
    });
    const newAddedItemQuery = await circulationRepo.getById(addedItem._id);
    assert.equal(newAddedItemQuery.Newspaper, "My new paper");

    // Remove
    const removed = await circulationRepo.remove(addedItem._id);
    assert(removed);
    assert.equal(await circulationRepo.getById(addedItem._id), null);

    console.log(await circulationRepo.averageFinalists());

    console.log(await circulationRepo.averageFinalistsByChange());

  } catch (error) {
    console.log(error);
  } finally {
    await client.db(dbName).dropDatabase();  
    client.close();  
  }
}

main();