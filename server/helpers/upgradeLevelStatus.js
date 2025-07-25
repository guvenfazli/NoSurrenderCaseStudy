async function upgradeLevelStatus(database, cardId) { // This is saving the changes to the database once the timeout ends.
  try {
    const itemList = await database.find({})
    
    const foundItem = itemList.find((item) => item._id.toString() === cardId.toString())
    if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.levelStatus = foundItem.levelStatus + 2
    }
    await foundItem.save()
  } catch (err) {
    return false
  }
}

module.exports = upgradeLevelStatus