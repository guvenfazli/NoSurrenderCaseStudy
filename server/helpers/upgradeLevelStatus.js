async function upgradeLevelStatus({ database, updatedItems }) { // This is saving the changes to the database once the timeout ends.

  try {
    /*   
    
    This is the first idea i came up with, but it is wrong because, it is only updating the last item and only one item, but user might try to upgrade many items before the request block happens, so new code does a bulkWrite if the user is trying to update many items at once, i am not using for loop BECAUSE with that it will be a for loop and it will be a heavy weight on the database.

    const itemList = await database.find({})
    
    const foundItem = itemList.find((item) => item._id.toString() === cardId.toString())
    if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.levelStatus = updatedStatus
    } 
    */
    const operations = updatedItems.map(({ cardId, updatedStatus }) => ({
      updateOne: {
        filter: { _id: cardId },
        update: { $set: { levelStatus: updatedStatus } }
      }
    }));

    await database.bulkWrite(operations);

  } catch (err) {
    return false
  }
}

module.exports = upgradeLevelStatus