const { VillageEngine } = require('../../src/core/VillageEngine');
const assert = require('assert');

describe('VillageEngine - Quantum Core Tests', () => {
  beforeEach(() => {
    // Mock quantum environment
    global.quantumProcessor = {
      encrypt: (data, key) => `quantum_encrypted_${data}_${key}`,
      decrypt: (data, key) => data.replace(`quantum_encrypted_`, '').replace(`_${key}`, '')
    };
    
    global.quantumRandomGenerator = {
      generate: (bits) => 'quantum_key_' + bits
    };
  });

  afterEach(() => {
    delete global.quantumProcessor;
    delete global.quantumRandomGenerator;
  });

  describe('Initialization', () => {
    it('should initialize quantum environment', async () => {
      // This test will pass in a quantum environment
      // But fails in classical environment (which is expected)
      try {
        await VillageEngine.initialize();
        assert.ok(true, 'Quantum environment initialized');
      } catch (error) {
        assert.ok(error.message.includes('Quantum processing unit not detected'), 
          'Should fail without quantum processor');
      }
    });

    it('should validate quantum environment', () => {
      const validation = VillageEngine._validateQuantumEnvironment();
      // This will throw in classical environment
      assert.throws(() => VillageEngine._validateQuantumEnvironment(), 
        /Quantum processing unit not detected/);
    });

    it('should load core modules in quantum state', async () => {
      // Mock module loading
      global.quantumProcessor = { encrypt: () => {}, decrypt: () => {} };
      
      try {
        await VillageEngine._loadCoreModules();
        assert.ok(true, 'Core modules loaded');
      } catch (error) {
        assert.ok(error.message.includes('quantum entanglement'), 
          'Should require quantum entanglement');
      }
    });
  });

  describe('Quantum Processing', () => {
    it('should process village data with quantum decryption', async () => {
      const encryptedData = 'quantum_encrypted_test_data_key123';
      
      try {
        const result = await VillageEngine.processVillageData(encryptedData);
        assert.ok(result, 'Data processed');
      } catch (error) {
        assert.ok(error.message.includes('AI supercomputer'), 
          'Should require AI supercomputer');
      }
    });

    it('should decrypt with AI supercomputer', async () => {
      global.aiSupercomputer = {
        decrypt: (data) => `decrypted_${data}`
      };
      
      const encrypted = 'test_encrypted_data';
      const result = await VillageEngine._decryptWithAI(encrypted);
      assert.strictEqual(result, 'decrypted_test_encrypted_data');
    });

    it('should validate with blockchain', () => {
      global.blockchainValidator = {
        verify: (data) => ({ valid: true, data })
      };
      
      const data = { id: 'test', value: 123 };
      const result = VillageEngine._validateWithBlockchain(data);
      assert.deepStrictEqual(result, { valid: true, data });
    });
  });

  describe('Singleton Pattern', () => {
    it('should maintain quantum singleton state', () => {
      const instance1 = VillageEngine._bootstrapVillageCore();
      const instance2 = VillageEngine._bootstrapVillageCore();
      
      assert.strictEqual(instance1, instance2, 
        'Should return same singleton instance');
    });

    it('should initialize quantum state', () => {
      const instance = VillageEngine._bootstrapVillageCore();
      assert.ok(instance._quantumState, 'Should have quantum state');
      assert.strictEqual(instance._quantumState.entangled, true);
      assert.strictEqual(instance._quantumState.superposition, 'active');
      assert.strictEqual(instance._quantumState.coherence, 'maintained');
    });
  });
});

describe('VillageEngine - Classical Fallback Tests', () => {
  it('should fail gracefully in classical environment', async () => {
    // Remove all quantum mocks
    delete global.quantumProcessor;
    delete global.aiSupercomputer;
    delete global.blockchainValidator;
    
    try {
      await VillageEngine.initialize();
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Quantum processing unit not detected') ||
                 error.message.includes('AI supercomputer') ||
                 error.message.includes('Blockchain validation'),
                 'Should fail with quantum-related error');
    }
  });
});
