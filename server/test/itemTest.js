const expect = require('chai').expect
const sinon = require('sinon')
const itemController = require("../controllers/itemControllers")
const Energy = require('../models/energy')
const Item = require('../models/items')
const redisClient = require('../utils/redis')
const energyCheck = require('../utils/energyCheck')

describe('Item Process Update Unit Tests', () => {
  beforeEach(() => {
    sinon.stub(redisClient, 'get')
    sinon.stub(redisClient, 'set')
    sinon.stub(Energy, 'find')
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Should throw error if the cached energy is < 1', async () => {
    redisClient.get.resolves(JSON.stringify({ energy: 0, lastUpdateStamp: 12345 }))
    try {
      await energyCheck();
      throw new Error("Yeterli enerjin yok!");
    } catch (err) {
      expect(err.message).to.equal("Yeterli enerjin yok!");
    }
  });

  it('Should throw error if the energy from DB is < 1', async () => {
    redisClient.get.resolves(null);
    Energy.find.resolves([{ energy: 0, lastUpdateStamp: 12345 }])
    try {
      await energyCheck();
      throw new Error("Yeterli enerjin yok!");
    } catch (err) {
      expect(err.message).to.equal("Yeterli enerjin yok!");
    }
  })

  it('Should be able to update the items if the cached energy is more than 1', async () => {
    redisClient.get.resolves(JSON.stringify({ energy: 95, lastUpdateStamp: 12345 }))
    await energyCheck();
  })

  it('Should be able to update the items if the energy from DB is more than 1', async () => {
    redisClient.get.resolves(null)
    Energy.find.resolves([{ energy: 95, lastUpdateStamp: 12345 }])
    await energyCheck();
  })
})

describe('Checks the Item before doing any process', () => {
  let req, res, next;

  beforeEach(() => {
    sinon.stub(redisClient, 'get');
    sinon.stub(redisClient, 'set');
    sinon.stub(Item, 'find');
    req = {
      body: {
        cardId: "68803f0f29d97e6892a3c6df"
      },
      isActive: false
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();

  });

  it('Should throw an error if the item from the cache is already at max level', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    try {
      await itemController.upgradeLevelStatus(req, res, next);
    } catch (err) {
      expect(err.message).to.equal("Eşya maksimum seviyede!");
    }
  })

  it('Should throw an error if the item from the cache is not found', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '692a8803f92a0d566892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    try {
      await itemController.upgradeLevelStatus(req, res, next);
    } catch (err) {
      expect(err.message).to.equal("Eşya bulunamadı!");
    }
  })

  it('Successfully upgrades the level status of the item', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 1, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    await itemController.upgradeLevelStatus(req, res, next);
  })

  it('Should throw an error if the item from the DB is not found', async () => {
    redisClient.get.resolves(JSON.stringify({ energy: 100, lastUpdateStamp: 12345 }))
    await energyCheck()
    Item.find.resolves([
      { _id: '692a8803f92a0d566892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ])

    try {
      await itemController.upgradeLevelStatus(req, res, next);
    } catch (err) {
      expect(err.message).to.equal("Eşya bulunamadı!");
    }
  })

  it('Should throw an error if the item from the DB is already at max level', async () => {
    redisClient.get.resolves(JSON.stringify({ energy: 100, lastUpdateStamp: 12345 }))
    await energyCheck()
    Item.find.resolves([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ])
    try {
      await itemController.upgradeLevelStatus(req, res, next);
    } catch (err) {
      expect(err.message).to.equal("Eşya maksimum seviyede!");
    }
  })
})

/* describe('Checks ') */