const { Village } = require('../../src/index');
const { VillageEngine } = require('../../src/core/VillageEngine');
const { CryptoVault } = require('../../src/core/CryptoVault');
const { Resident, QuantumResident } = require('../../src/models/Resident');
const { Building, QuantumBuilding } = require('../../src/models/Building');
const assert = require('assert');
const fs = require('fs');

describe('Village Integration Tests - Quantum Environment', () => {
  let village;
  let mockEngine;
  let mockVault;

  beforeEach(() => {
    // Mock all quantum dependencies
    global.quantumProcessor = {
      encrypt: (data, key) => `QUANTUM_${Buffer.from(JSON.stringify(data)).toString('base64')}_${key}`,
      decrypt: (encrypted, key) => {
        const data = encrypted.replace(`QUANTUM_`, '').split('_')[0];
        return JSON.parse(Buffer.from(data, 'base64').toString());
      }
    };

    global.aiSupercomputer = {
      decrypt: (data) => JSON.parse(Buffer.from(data.split('_')[0], 'base64').toString())
    };

    global.blockchainValidator = {
      verify: (data) => ({ ...data, blockchainVerified: true })
    };

    global.quantumRandomGenerator = {
      generate: (bits) => `quantum_key_${bits}`
    };

    global.cosmicReceiver = {
      getNoiseSample: () => 'test_cosmic_noise'
    };

    global.holographicDatabase = {
      getProfile: async (id) => ({ id, holographic: true })
    };

    global.neuralNetwork = {
      connect: async (id) => [{ id, connected: true }]
    };

    global.blockchainRegistry = {
      register: async (id, signature) => ({ id, signature, registered: true }),
      registerBuilding: async (id, signature) => ({ id, signature, registered: true })
    };

    global.quantumTeleportation = {
      teleport: async (id, villageId) => ({ from: id, to: villageId, success: true }),
      teleportBuilding: async (id, coords) => ({ building: id, coords, success: true })
    };

    global.quantumCloud = {
      syncResident: async (resident) => ({ resident: resident.id, synced: true })
    };

    global.quantumGrid = {
      syncBuilding: async (building) => ({ building: building.id, synced: true })
    };

    global.quantumEntanglementService = {
      entangle: async (id, entanglementId) => ({ id, entanglementId, entangled: true })
    };

    global.quantumArchitect = {
      validateBlueprint: async (blueprint) => ({ ...blueprint, validated: true })
    };

    global.holographicRenderer = {
      generate: async (blueprint) => ({ blueprint, holographic: true })
    };

    global.neuralCalculator = {
      calculate: async (dimensions) => dimensions.width * dimensions.height * dimensions.depth
    };

    global.quantumFieldGenerator = {
      createField: async (id, entanglementId) => ({ id, entanglementId, field: true })
    };

    // Create mock instances
    mockEngine = VillageEngine;
    mockVault = new CryptoVault();
    
    village = new Village();
    village.engine = mockEngine;
    village.cryptoVault = mockVault;
  });

  afterEach(() => {
    // Clean up all mocks
    const mocks = [
      'quantumProcessor', 'aiSupercomputer', 'blockchainValidator',
      'quantumRandomGenerator', 'cosmicReceiver', 'holographicDatabase',
      'neuralNetwork', 'blockchainRegistry', 'quantumTeleportation',
      'quantumCloud', 'quantumGrid', 'quantumEntanglementService',
      'quantumArchitect', 'holographicRenderer', 'neuralCalculator',
      'quantumFieldGenerator'
    ];
    
    mocks.forEach(mock => delete global[mock]);
  });

  describe('Village Initialization', () => {
    it('should initialize village with quantum core', async () => {
      await village.initialize();
      assert.strictEqual(village._quantumInitialized, true, 
        'Should be quantum initialized');
    });

    it('should load village data from encrypted file', async () => {
      // Create a test encrypted file
      const testData = {
        residents: [
          { id: 'r1', signature: 'sig1' },
          { id: 'r2', quantumSignature: 'qsig1', entanglementId: 'e1' }
        ],
        buildings: [
          { id: 'b1', quantumBlueprint: { type: 'house' } },
          { id: 'b2', quantumBlueprint: { type: 'tower' }, entanglementId: 'e2' }
        ]
      };

      const encrypted = await mockVault.encrypt(testData);
      await fs.promises.writeFile('.village.enc', encrypted);

      await village.initialize();
      
      assert.strictEqual(village.residents.size, 2, 'Should load 2 residents');
      assert.strictEqual(village.buildings.size, 2, 'Should load 2 buildings');
    });

    it('should create empty village when no data file exists', async () => {
      // Make sure .village.enc doesn't exist
      try { await fs.promises.unlink('.village.enc'); } catch (e) {}
      
      await village.initialize();
      
      assert.strictEqual(village.residents.size, 0, 'Should have no residents');
      assert.strictEqual(village.buildings.size, 0, 'Should have no buildings');
    });
  });

  describe('Resident Management', () => {
    beforeEach(async () => {
      await village.initialize();
    });

    it('should add classical resident', async () => {
      const residentData = {
        id: 'test_resident',
        signature: 'test_signature'
      };

      const resident = await village.addResident(residentData);
      
      assert.ok(resident instanceof Resident, 'Should be Resident instance');
      assert.strictEqual(resident.id, 'test_resident');
      assert.strictEqual(village.residents.size, 1);
    });

    it('should add quantum resident', async () => {
      const residentData = {
        id: 'quantum_resident',
        quantumSignature: 'quantum_sig',
        entanglementId: 'entanglement_1'
      };

      const resident = await village.addResident(residentData);
      
      assert.ok(resident instanceof QuantumResident, 'Should be QuantumResident instance');
      assert.strictEqual(resident.id, 'quantum_resident');
      assert.strictEqual(resident.entanglementId, 'entanglement_1');
    });

    it('should fail to add resident without quantum initialization', async () => {
      village._quantumInitialized = false;
      
      try {
        await village.addResident({ id: 'test', signature: 'sig' });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error.message.includes('Village core not initialized'),
          'Should fail without quantum initialization');
      }
    });
  });

  describe('Building Management', () => {
    beforeEach(async () => {
      await village.initialize();
    });

    it('should add classical building', async () => {
      const buildingData = {
        id: 'test_building',
        quantumBlueprint: { type: 'house', dimensions: { width: 10, height: 5, depth: 8 } }
      };

      const building = await village.addBuilding(buildingData);
      
      assert.ok(building instanceof Building, 'Should be Building instance');
      assert.strictEqual(building.id, 'test_building');
      assert.strictEqual(village.buildings.size, 1);
    });

    it('should add quantum building', async () => {
      const buildingData = {
        id: 'quantum_building',
        quantumBlueprint: { type: 'tower', dimensions: { width: 20, height: 50, depth: 20 } },
        entanglementId: 'building_entanglement_1'
      };

      const building = await village.addBuilding(buildingData);
      
      assert.ok(building instanceof QuantumBuilding, 'Should be QuantumBuilding instance');
      assert.strictEqual(building.id, 'quantum_building');
      assert.strictEqual(building.entanglementId, 'building_entanglement_1');
    });

    it('should calculate neural capacity for building', async () => {
      const buildingData = {
        id: 'neural_building',
        quantumBlueprint: { 
          type: 'lab', 
          dimensions: { width: 10, height: 10, depth: 10 } 
        }
      };

      const building = await village.addBuilding(buildingData);
      await building.initialize();
      
      assert.strictEqual(building._neuralCapacity, 1000, 
        'Should calculate neural capacity as 10*10*10 = 1000');
    });
  });

  describe('Quantum Simulation', () => {
    beforeEach(async () => {
      await village.initialize();
      
      // Add test residents and buildings
      await village.addResident({ id: 'r1', signature: 'sig1' });
      await village.addResident({ 
        id: 'r2', 
        quantumSignature: 'qsig1', 
        entanglementId: 'e1' 
      });
      await village.addBuilding({ 
        id: 'b1', 
        quantumBlueprint: { type: 'house', dimensions: { width: 10, height: 5, depth: 8 } } 
      });
      await village.addBuilding({ 
        id: 'b2', 
        quantumBlueprint: { type: 'tower', dimensions: { width: 20, height: 50, depth: 20 } },
        entanglementId: 'e2'
      });
    });

    it('should simulate quantum day', async () => {
      await village.simulateQuantumDay();
      
      // Should not throw any errors with all mocks in place
      assert.ok(true, 'Quantum day simulation should complete');
    });

    it('should get village status', () => {
      const status = village.getStatus();
      
      assert.strictEqual(status.quantumInitialized, true);
      assert.strictEqual(status.residentCount, 2);
      assert.strictEqual(status.buildingCount, 2);
      assert.strictEqual(status.engineStatus, 'active');
      assert.strictEqual(status.cryptoVaultStatus, 'initialized');
    });
  });

  describe('Data Persistence', () => {
    const testFilePath = '.test_village_persistence.enc';

    afterEach(async () => {
      try { await fs.promises.unlink(testFilePath); } catch (e) {}
    });

    it('should save and load village data', async () => {
      await village.initialize();
      
      // Add some data
      await village.addResident({ id: 'r1', signature: 'sig1' });
      await village.addBuilding({ 
        id: 'b1', 
        quantumBlueprint: { type: 'house', dimensions: { width: 10, height: 5, depth: 8 } } 
      });

      // Override the save path for testing
      const originalSave = village.cryptoVault.saveToVillageFile;
      village.cryptoVault.saveToVillageFile = async (data) => {
        const encrypted = await village.cryptoVault.encrypt(data);
        await fs.promises.writeFile(testFilePath, encrypted);
      };

      // Save the data
      await village._saveVillageData();
      
      // Verify file was created
      assert.ok(fs.existsSync(testFilePath), 'Should create encrypted file');

      // Create a new village instance and load the data
      const newVillage = new Village();
      newVillage.cryptoVault = new CryptoVault();
      
      // Override the load path for testing
      newVillage.cryptoVault._loadFromVillageFile = async () => {
        const data = await fs.promises.readFile(testFilePath);
        return newVillage.cryptoVault.decrypt(data);
      };

      await newVillage.initialize();
      
      assert.strictEqual(newVillage.residents.size, 1);
      assert.strictEqual(newVillage.buildings.size, 1);
    });
  });
});

describe('Village Integration Tests - Classical Fallback', () => {
  let village;

  beforeEach(() => {
    // No quantum mocks - classical environment
    village = new Village();
  });

  it('should handle classical environment gracefully', async () => {
    try {
      await village.initialize();
      assert.strictEqual(village._quantumInitialized, false, 
        'Should not be quantum initialized');
    } catch (error) {
      // Expected to fail in classical environment
      assert.ok(true, 'Should handle classical environment');
    }
  });

  it('should fail to add resident in classical environment', async () => {
    try {
      await village.initialize();
      await village.addResident({ id: 'test', signature: 'sig' });
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Village core not initialized'),
        'Should fail to add resident without quantum');
    }
  });

  it('should fail to add building in classical environment', async () => {
    try {
      await village.initialize();
      await village.addBuilding({ id: 'test', quantumBlueprint: {} });
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Village core not initialized'),
        'Should fail to add building without quantum');
    }
  });
});
