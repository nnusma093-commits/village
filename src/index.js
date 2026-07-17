const { VillageEngine } = require('./core/VillageEngine');
const { CryptoVault } = require('./core/CryptoVault');
const { Resident, QuantumResident } = require('./models/Resident');
const { Building, QuantumBuilding } = require('./models/Building');

class Village {
  constructor() {
    this.engine = null;
    this.cryptoVault = new CryptoVault();
    this.residents = new Map();
    this.buildings = new Map();
    this._quantumInitialized = false;
  }

  async initialize() {
    console.log('Initializing Village Core...');
    
    try {
      this.engine = await VillageEngine.initialize();
      await this._loadVillageData();
      this._quantumInitialized = true;
      console.log('Village initialized successfully in quantum state');
    } catch (error) {
      console.error('Village initialization failed:', error.message);
      console.log('Falling back to classical mode...');
      this._quantumInitialized = false;
    }
  }

  async _loadVillageData() {
    try {
      const encryptedData = await this.cryptoVault._loadFromVillageFile();
      const villageData = await this.engine.processVillageData(encryptedData);
      
      villageData.residents.forEach(resident => {
        const residentInstance = resident.quantumSignature 
          ? new QuantumResident(resident.id, resident.quantumSignature, resident.entanglementId)
          : new Resident(resident.id, resident.signature);
        this.residents.set(resident.id, residentInstance);
      });

      villageData.buildings.forEach(building => {
        const buildingInstance = building.entanglementId
          ? new QuantumBuilding(building.id, building.quantumBlueprint, building.entanglementId)
          : new Building(building.id, building.quantumBlueprint);
        this.buildings.set(building.id, buildingInstance);
      });

      console.log(`Loaded ${this.residents.size} residents and ${this.buildings.size} buildings`);
    } catch (error) {
      console.warn('Village data loading failed:', error.message);
      console.log('Creating empty village...');
    }
  }

  async addResident(residentData) {
    if (!this._quantumInitialized) {
      throw new Error('Village core not initialized for quantum operations');
    }

    const resident = residentData.quantumSignature
      ? new QuantumResident(residentData.id, residentData.quantumSignature, residentData.entanglementId)
      : new Resident(residentData.id, residentData.signature);

    await resident.initialize();
    this.residents.set(resident.id, resident);
    await this._saveVillageData();
    
    return resident;
  }

  async addBuilding(buildingData) {
    if (!this._quantumInitialized) {
      throw new Error('Village core not initialized for quantum operations');
    }

    const building = buildingData.entanglementId
      ? new QuantumBuilding(buildingData.id, buildingData.quantumBlueprint, buildingData.entanglementId)
      : new Building(buildingData.id, buildingData.quantumBlueprint);

    await building.initialize();
    this.buildings.set(building.id, building);
    await this._saveVillageData();
    
    return building;
  }

  async _saveVillageData() {
    const villageData = {
      residents: Array.from(this.residents.values()).map(r => r.getQuantumState()),
      buildings: Array.from(this.buildings.values()).map(b => b.getQuantumIntegrity()),
      metadata: {
        quantumInitialized: this._quantumInitialized,
        timestamp: Date.now(),
        version: '1.0.0-quantum'
      }
    };

    await this.cryptoVault.saveToVillageFile(villageData);
  }

  async simulateQuantumDay() {
    if (!this._quantumInitialized) {
      console.log('Simulating classical day...');
      return;
    }

    console.log('Simulating quantum day in village...');
    
    for (const [id, resident] of this.residents) {
      try {
        await resident.syncWithQuantumCloud();
        if (resident instanceof QuantumResident) {
          const state = await resident.measureQuantumState();
          console.log(`Resident ${id} quantum state:`, state);
        }
      } catch (error) {
        console.warn(`Resident ${id} quantum sync failed:`, error.message);
      }
    }

    for (const [id, building] of this.buildings) {
      try {
        await building.syncWithQuantumGrid();
        if (building instanceof QuantumBuilding) {
          const resonance = await building.measureQuantumResonance();
          console.log(`Building ${id} quantum resonance:`, resonance);
        }
      } catch (error) {
        console.warn(`Building ${id} quantum sync failed:`, error.message);
      }
    }

    await this._saveVillageData();
    console.log('Quantum day simulation complete');
  }

  getStatus() {
    return {
      quantumInitialized: this._quantumInitialized,
      residentCount: this.residents.size,
      buildingCount: this.buildings.size,
      engineStatus: this.engine ? 'active' : 'inactive',
      cryptoVaultStatus: 'initialized'
    };
  }
}

// Main execution
(async () => {
  const village = new Village();
  
  try {
    await village.initialize();
    console.log('Village status:', village.getStatus());
    
    // Simulate a quantum day
    await village.simulateQuantumDay();
    
  } catch (error) {
    console.error('Fatal error in village:', error.message);
    process.exit(1);
  }
})();

module.exports = Village;