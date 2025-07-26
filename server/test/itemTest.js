const expect = require('chai').expect
const sinon = require('sinon')
const itemController = require("../controllers/itemControllers")
const Energy = require('../models/energy')
const Item = require('../models/items')
const redisClient = require('../utils/redis')
const energyCheck = require('../utils/energyCheck')
const instantEnergy = require('../utils/instantEnergy')

describe('Checks the Energy', () => {
  beforeEach(() => {
    sinon.stub(redisClient, 'get')
    sinon.stub(redisClient, 'set')
    sinon.stub(Energy, 'find')
    sinon.stub(Energy, 'findOne')
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Should throw error if the cached energy is < 1', async () => {
    redisClient.get.resolves(JSON.stringify({ energy: 0, lastUpdateStamp: 12345 }))
    try {
      const result = await energyCheck();
      if (!result) throw new Error("Yeterli enerjin yok!");
    } catch (err) {
      expect(err.message).to.equal("Yeterli enerjin yok!");
    }
  });

  it('Should throw error if the energy from DB is < 1', async () => {
    redisClient.get.resolves(null);
    Energy.find.resolves([{ energy: 0, lastUpdateStamp: 12345 }])
    try {
      const result = await energyCheck();
      if (!result) throw new Error("Yeterli enerjin yok!");
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

    const next = sinon.fake();
    await itemController.upgradeLevelStatus(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya maksimum seviyede!");
  })

  it('Should throw an error if the item from the cache is not found', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '692a8803f92a0d566892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    const next = sinon.fake();
    await itemController.upgradeLevelStatus(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya bulunamadı!");
  })

  it('Successfully upgrades the level status of the item', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 1, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    await itemController.upgradeLevelStatus(req, res, next);
  })

  it('Should throw an error if the item from the DB is not found', async () => {
    redisClient.get.onFirstCall().resolves(JSON.stringify({ energy: 100, lastUpdateStamp: 12345 }));
    redisClient.get.onSecondCall().resolves(null);
    Item.find.resolves([
      { _id: '692a8803f92a0d566892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ])

    const next = sinon.fake();
    await itemController.upgradeLevelStatus(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya bulunamadı!");
  })

  it('Should throw an error if the item from the DB is already at max level', async () => {
    redisClient.get.onFirstCall().resolves(JSON.stringify({ energy: 100, lastUpdateStamp: 12345 }));
    redisClient.get.onSecondCall().resolves(null);

    Item.find.resolves([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ])

    const next = sinon.fake();
    await itemController.upgradeLevelStatus(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya maksimum seviyede!");
  })
})

describe('Checks the Item before Leveling Up', () => {

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

  it('Should throw an error if the item from the cache is not found', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '692a8803f92a0d566dfga324892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f292349fdg2347e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    const next = sinon.fake();

    await itemController.updateLevel(req, res, next);

    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya bulunamadı!");
  })

  it('Should throw an error if the item from the DB is not found', async () => {

    redisClient.get.onSecondCall().resolves(null);

    Item.find.resolves([
      { _id: '692a8803f92a0d566892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]);

    const next = sinon.fake();

    await itemController.updateLevel(req, res, next);

    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya bulunamadı!");
  });

  it('Should throw an error if the item from the cache is at max level', async () => {
    redisClient.get.resolves(JSON.stringify([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ]))

    const next = sinon.fake();

    await itemController.updateLevel(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya maksimum seviyede!");
  })

  it('Should throw an error if the item from the DB is at max level', async () => {
    redisClient.get.resolves(null)
    Item.find.resolves([
      { _id: '68803f0f29d97e6892a3c6df', itemType: 'Kısa Kılıç', itemLevel: 3, levelStatus: 0 },
      { _id: '68803f0f2923497e6892a3c1df', itemType: 'Uzun Kılıç', itemLevel: 1, levelStatus: 75 }
    ])

    const next = sinon.fake();

    await itemController.updateLevel(req, res, next);
    sinon.assert.calledOnce(next);
    const errorPassed = next.firstCall.args[0];
    expect(errorPassed).to.be.instanceOf(Error);
    expect(errorPassed.message).to.equal("Eşya maksimum seviyede!");
  })


})

describe('Checks the Item before Instant Level Up', () => {
  let req, res, next;

  beforeEach(() => {
    sinon.stub(redisClient, 'get');
    sinon.stub(redisClient, 'set');
    sinon.stub(Item, 'find');
    sinon.stub(Energy, 'find');
    sinon.stub(Energy, 'findOne');
    req = {
      body: {
        cardId: "68803f0f29d97e6892a3c6df",
        requiredEnergy: 40
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

  it('Should throw an error if the energy from cache is not enough', async () => {
    redisClient.get.resolves(JSON.stringify({
      energy: 20,
      lastUpdateStamp: 123456789
    }));
    const result = await instantEnergy(req.body.requiredEnergy);
    expect(result).to.equal(false);
  })
  it('Should throw an error if the energy from DB is not enough', async () => {
    redisClient.get.resolves(null);
    Energy.find.resolves([{ energy: 20 }])
    const result = await instantEnergy(req.body.requiredEnergy);
    expect(result).to.equal(false);
  })
  
})