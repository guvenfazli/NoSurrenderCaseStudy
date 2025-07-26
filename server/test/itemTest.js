const expect = require('chai').expect
const sinon = require('sinon')
const itemController = require("../controllers/itemControllers")
const Energy = require('../models/energy')
const redisClient = require('../utils/redis')
const energyCheck = require('../utils/energyCheck')

describe('Item Management Unit Tests', () => {
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