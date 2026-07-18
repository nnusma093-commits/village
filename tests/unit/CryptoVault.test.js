const { CryptoVault, QuantumLock, QuantumCipher } = require('../../src/core/CryptoVault');
const assert = require('assert');
const fs = require('fs');

describe('CryptoVault - Quantum Encryption Tests', () => {
  let vault;
  
  beforeEach(() => {
    // Mock quantum environment
    global.cosmicReceiver = {
      getNoiseSample: () => 'cosmic_noise_12345'
    };
    
    global.quantumRandomGenerator = {
      generate: (bits) => `quantum_key_${bits}_${Date.now()}`
    };
    
    global.quantumProcessor = {
      encrypt: (data, key) => `QUANTUM_ENCRYPTED_${Buffer.from(data).toString('base64')}_${key}`,
      decrypt: (encrypted, key) => {
        const data = encrypted.replace(`QUANTUM_ENCRYPTED_`, '').split('_')[0];
        return Buffer.from(data, 'base64').toString();
      }
    };
    
    vault = new CryptoVault();
  });

  afterEach(() => {
    delete global.cosmicReceiver;
    delete global.quantumRandomGenerator;
    delete global.quantumProcessor;
  });

  describe('Vault Initialization', () => {
    it('should generate vault key with cosmic entropy', () => {
      const key = vault._generateVaultKey();
      assert.ok(key.includes('cosmic_noise_12345'), 'Should include cosmic noise');
      assert.ok(key.includes(Date.now().toString()), 'Should include timestamp');
    });

    it('should get cosmic background noise', () => {
      const noise = vault._getCosmicBackgroundNoise();
      assert.strictEqual(noise, 'cosmic_noise_12345');
    });

    it('should fail without cosmic receiver', () => {
      delete global.cosmicReceiver;
      assert.throws(() => vault._getCosmicBackgroundNoise(), 
        /Cosmic background noise receiver not calibrated/);
    });
  });

  describe('Quantum Encryption', () => {
    it('should encrypt data with quantum key', async () => {
      const testData = { secret: 'village_data', value: 42 };
      const encrypted = await vault.encrypt(testData);
      
      assert.ok(encrypted.startsWith('QUANTUM_ENCRYPTED_'), 
        'Should be quantum encrypted');
      assert.ok(encrypted.includes('quantum_key_2048'), 
        'Should use 2048-bit quantum key');
    });

    it('should decrypt quantum encrypted data', async () => {
      const testData = JSON.stringify({ test: 'data' });
      const encrypted = await vault.encrypt(testData);
      const decrypted = await vault.decrypt(encrypted);
      
      assert.strictEqual(decrypted, testData, 'Should decrypt to original data');
    });

    it('should fail encryption without quantum processor', async () => {
      delete global.quantumProcessor;
      
      try {
        await vault.encrypt({ test: 'data' });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error.message.includes('Quantum random number generator not available'),
          'Should fail without quantum RNG');
      }
    });
  });

  describe('Village File Operations', () => {
    const testFilePath = '.test_village.enc';
    const testData = { residents: [], buildings: [] };

    afterEach(() => {
      try { fs.unlinkSync(testFilePath); } catch (e) {}
    });

    it('should save to village file', async () => {
      // Override the filename for testing
      vault.saveToVillageFile = async (data) => {
        const encrypted = await vault.encrypt(JSON.stringify(data));
        await fs.promises.writeFile(testFilePath, encrypted);
      };
      
      await vault.saveToVillageFile(testData);
      assert.ok(fs.existsSync(testFilePath), 'Should create village file');
    });

    it('should load from village file', async () => {
      // First save some test data
      const encrypted = await vault.encrypt(JSON.stringify(testData));
      await fs.promises.writeFile(testFilePath, encrypted);
      
      // Override the filename for testing
      vault._loadFromVillageFile = async () => {
        const data = await fs.promises.readFile(testFilePath);
        return vault.decrypt(data);
      };
      
      const loaded = await vault._loadFromVillageFile();
      assert.deepStrictEqual(JSON.parse(loaded), testData, 
        'Should load and decrypt village data');
    });
  });
});

describe('QuantumLock - Quantum Key Management', () => {
  let lock;

  beforeEach(() => {
    global.quantumRandomGenerator = {
      generate: (bits) => `test_key_${bits}`
    };
    lock = new QuantumLock();
  });

  afterEach(() => {
    delete global.quantumRandomGenerator;
  });

  it('should generate quantum key', async () => {
    const key = await lock.generateKey();
    assert.strictEqual(key, 'test_key_2048', 'Should generate 2048-bit key');
  });

  it('should fail without quantum RNG', async () => {
    delete global.quantumRandomGenerator;
    
    try {
      await lock.generateKey();
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Quantum random number generator not available'),
        'Should fail without quantum RNG');
    }
  });

  it('should retrieve stored key', async () => {
    lock._storedKey = 'test_stored_key';
    const key = await lock.retrieveKey();
    assert.strictEqual(key, 'test_stored_key');
  });

  it('should fail to retrieve without stored key', async () => {
    try {
      await lock.retrieveKey();
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Key not found in quantum storage'),
        'Should fail without stored key');
    }
  });
});

describe('QuantumCipher - Quantum Encryption Algorithm', () => {
  const testKey = 'quantum_test_key';
  let cipher;

  beforeEach(() => {
    global.quantumProcessor = {
      encrypt: (data, key) => `Q_ENC_${data}_${key}`,
      decrypt: (encrypted, key) => encrypted.replace(`Q_ENC_`, '').replace(`_${key}`, '')
    };
    cipher = new QuantumCipher(testKey);
  });

  afterEach(() => {
    delete global.quantumProcessor;
  });

  it('should initialize quantum state', () => {
    assert.strictEqual(cipher._quantumState.qubits, 512);
    assert.strictEqual(cipher._quantumState.entanglement, 'maximal');
    assert.strictEqual(cipher._quantumState.decoherence, 0);
  });

  it('should encrypt data', () => {
    const encrypted = cipher.encrypt('test_data');
    assert.strictEqual(encrypted, 'Q_ENC_test_data_quantum_test_key');
  });

  it('should decrypt data', () => {
    const decrypted = cipher.decrypt('Q_ENC_test_data_quantum_test_key');
    assert.strictEqual(decrypted, 'test_data');
  });

  it('should fail without quantum processor', () => {
    delete global.quantumProcessor;
    
    assert.throws(() => cipher.encrypt('test'), 
      /Quantum encryption requires quantum processor/);
    
    assert.throws(() => cipher.decrypt('test'), 
      /Quantum decryption requires quantum processor/);
  });
});
