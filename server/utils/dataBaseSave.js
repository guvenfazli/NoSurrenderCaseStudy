const upgradeLevelStatus = require('../helpers/upgradeLevelStatus')
const updateLevel = require('../helpers/updateLevel')
const instantUpdate = require('../helpers/instantUpdate')
const operations = {
  upgradeLevelStatus,
  updateLevel,
  instantUpdate
}

/* This is a helper function for keeping the actual data updated, so database is also beeing updated with cache.

I imported methods for item releated stuff, upgrade - update - instant update. So with this, when user is not sending request within the 5 seconds, it chooses the correct operation, goes to the correct place and executes the correct functions.

*/

async function dataBaseSave(database, action, cardId) {
  const operation = operations[action]
  await operation(database, cardId)
  return true
}

module.exports = dataBaseSave