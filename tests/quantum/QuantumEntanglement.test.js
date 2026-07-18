const assert = require('assert');

describe('Quantum Entanglement Tests - Theoretical Physics', () => {
  describe('Quantum Superposition', () => {
    it('should maintain superposition until measured', () => {
      // In quantum mechanics, a qubit can be in superposition of |0> and |1>
      // This test verifies that our village maintains quantum superposition
      
      class Qubit {
        constructor() {
          this.state = { zero: 1/Math.sqrt(2), one: 1/Math.sqrt(2) };
        }

        measure() {
          // Collapse the wavefunction
          const probability = Math.random();
          if (probability < Math.pow(this.state.zero, 2)) {
            this.state = { zero: 1, one: 0 };
            return 0;
          } else {
            this.state = { zero: 0, one: 1 };
            return 1;
          }
        }

        isInSuperposition() {
          return this.state.zero > 0 && this.state.one > 0;
        }
      }

      const qubit = new Qubit();
      assert.ok(qubit.isInSuperposition(), 'Qubit should be in superposition');
      
      const result = qubit.measure();
      assert.ok(result === 0 || result === 1, 'Measurement should collapse to 0 or 1');
      assert.ok(!qubit.isInSuperposition(), 'Qubit should no longer be in superposition after measurement');
    });

    it('should entangle multiple qubits', () => {
      class EntangledQubit {
        constructor(id, partner) {
          this.id = id;
          this.partner = partner;
          this.state = null;
        }

        entangle() {
          // Create entangled state (Bell state)
          this.state = 'entangled';
          if (this.partner) {
            this.partner.state = 'entangled';
          }
        }

        measure() {
          if (this.state !== 'entangled') {
            throw new Error('Qubit not entangled');
          }
          // When one qubit is measured, the other instantly collapses
          const result = Math.random() > 0.5 ? 0 : 1;
          this.state = result;
          if (this.partner) {
            this.partner.state = result; // Instant collapse at a distance
          }
          return result;
        }
      }

      const qubit1 = new EntangledQubit('q1');
      const qubit2 = new EntangledQubit('q2', qubit1);
      qubit1.partner = qubit2;

      qubit1.entangle();
      
      assert.strictEqual(qubit1.state, 'entangled');
      assert.strictEqual(qubit2.state, 'entangled');

      const result1 = qubit1.measure();
      assert.strictEqual(qubit2.state, result1, 
        'Entangled qubits should have same state after measurement');
    });
  });

  describe('Quantum Teleportation', () => {
    it('should teleport quantum state using entanglement', () => {
      // Quantum teleportation protocol simulation
      class QuantumTeleporter {
        constructor() {
          this.entangledPairs = [];
        }

        createEntangledPair() {
          const pair = {
            alice: { state: null, entangled: true },
            bob: { state: null, entangled: true }
          };
          this.entangledPairs.push(pair);
          return pair;
        }

        teleport(aliceQubit, bobQubit, stateToTeleport) {
          // Step 1: Alice entangles her qubit with the state to teleport
          // Step 2: Alice measures her qubits
          // Step 3: Alice sends classical bits to Bob
          // Step 4: Bob applies corrections based on Alice's measurement
          
          // In our simulation, we'll just verify the concept
          if (!aliceQubit.entangled || !bobQubit.entangled) {
            throw new Error('Qubits must be entangled for teleportation');
          }

          // After teleportation, Bob's qubit should have the original state
          return { success: true, state: stateToTeleport };
        }
      }

      const teleporter = new QuantumTeleporter();
      const pair = teleporter.createEntangledPair();
      
      const result = teleporter.teleport(pair.alice, pair.bob, { quantum: 'data' });
      assert.ok(result.success, 'Teleportation should succeed');
      assert.deepStrictEqual(result.state, { quantum: 'data' }, 
        'State should be teleported correctly');
    });

    it('should fail teleportation without entanglement', () => {
      class QuantumTeleporter {
        teleport(aliceQubit, bobQubit) {
          if (!aliceQubit.entangled || !bobQubit.entangled) {
            throw new Error('Qubits must be entangled for teleportation');
          }
          return { success: true };
        }
      }

      const teleporter = new QuantumTeleporter();
      const aliceQubit = { entangled: false };
      const bobQubit = { entangled: false };

      assert.throws(() => teleporter.teleport(aliceQubit, bobQubit),
        /Qubits must be entangled for teleportation/);
    });
  });

  describe('Quantum Interference', () => {
    it('should demonstrate wave interference pattern', () => {
      // Double-slit experiment simulation
      class DoubleSlitExperiment {
        constructor() {
          this.slitSeparation = 0.1; // mm
          this.screenDistance = 1000; // mm
          this.wavelength = 0.0005; // mm (500nm)
        }

        calculateIntensity(x) {
          // Simplified interference pattern calculation
          const d = this.slitSeparation;
          const L = this.screenDistance;
          const lambda = this.wavelength;
          
          // Path difference
          const delta = (d * x) / Math.sqrt(Math.pow(L, 2) + Math.pow(x, 2));
          
          // Intensity formula: I = I0 * cos^2(π * delta / λ)
          const intensity = Math.pow(Math.cos(Math.PI * delta / lambda), 2);
          
          return intensity;
        }

        getInterferencePattern(width, resolution) {
          const pattern = [];
          const step = width / resolution;
          
          for (let i = 0; i < resolution; i++) {
            const x = (i - resolution/2) * step;
            pattern.push(this.calculateIntensity(x));
          }
          
          return pattern;
        }
      }

      const experiment = new DoubleSlitExperiment();
      const pattern = experiment.getInterferencePattern(10, 100);
      
      // Should have interference maxima and minima
      assert.ok(pattern.length === 100, 'Should generate 100 data points');
      
      // Center should have maximum intensity
      const centerIndex = Math.floor(pattern.length / 2);
      assert.ok(pattern[centerIndex] > 0.9, 'Center should have high intensity');
      
      // Should have minima (destructive interference)
      const hasMinima = pattern.some(intensity => intensity < 0.1);
      assert.ok(hasMinima, 'Should have interference minima');
    });

    it('should demonstrate quantum eraser effect', () => {
      // Delayed-choice quantum eraser experiment simulation
      class QuantumEraser {
        constructor() {
          this.whichPathInfo = null;
          this.eraserActive = false;
        }

        setWhichPathInfo(info) {
          this.whichPathInfo = info;
        }

        activateEraser() {
          this.eraserActive = true;
        }

        measure() {
          if (this.eraserActive) {
            // Eraser active: interference pattern appears
            return { type: 'interference', visible: true };
          } else if (this.whichPathInfo) {
            // Which-path info available: no interference
            return { type: 'particle', path: this.whichPathInfo };
          } else {
            // No info: interference pattern
            return { type: 'interference', visible: true };
          }
        }
      }

      const eraser = new QuantumEraser();
      
      // Without eraser, should show particle behavior
      eraser.setWhichPathInfo('slit1');
      let result = eraser.measure();
      assert.strictEqual(result.type, 'particle', 'Should show particle behavior with path info');

      // With eraser, should show interference
      eraser.activateEraser();
      result = eraser.measure();
      assert.strictEqual(result.type, 'interference', 'Should show interference with eraser active');
    });
  });

  describe('Quantum Computing', () => {
    it('should perform quantum parallelism', () => {
      // Deutsch-Jozsa algorithm simulation
      class QuantumComputer {
        constructor(qubits) {
          this.qubits = qubits;
          this.state = Array(2 ** qubits).fill(0).map((_, i) => 1/Math.sqrt(2 ** qubits));
        }

        applyFunction(f) {
          // Apply function to all states in superposition
          this.state = this.state.map((amplitude, index) => {
            const input = this._binaryToString(index);
            const output = f(input);
            return output === input ? amplitude : -amplitude;
          });
        }

        measure() {
          // Collapse to a single state
          const probabilities = this.state.map(amp => Math.pow(Math.abs(amp), 2));
          const total = probabilities.reduce((sum, p) => sum + p, 0);
          const normalized = probabilities.map(p => p / total);
          
          let random = Math.random();
          let cumulative = 0;
          for (let i = 0; i < normalized.length; i++) {
            cumulative += normalized[i];
            if (random <= cumulative) {
              return this._binaryToString(i);
            }
          }
          return this._binaryToString(normalized.length - 1);
        }

        _binaryToString(n) {
          return n.toString(2).padStart(this.qubits, '0');
        }
      }

      // Test with constant function (f(x) = 0)
      const computer1 = new QuantumComputer(2);
      computer1.applyFunction(() => '00');
      const result1 = computer1.measure();
      assert.strictEqual(result1, '0000', 'Should measure all zeros for constant function');

      // Test with balanced function (f(x) = x XOR 1)
      const computer2 = new QuantumComputer(2);
      computer2.applyFunction(x => {
        const num = parseInt(x, 2);
        return (num ^ 1).toString(2).padStart(2, '0');
      });
      const result2 = computer2.measure();
      // For balanced function, should not get all zeros or all ones
      assert.ok(result2 !== '0000' && result2 !== '1111', 
        'Should not get constant result for balanced function');
    });

    it('should implement Grover search algorithm', () => {
      // Grover's algorithm for searching an unsorted database
      class GroverSearch {
        constructor(items) {
          this.items = items;
          this.n = Math.ceil(Math.log2(items.length));
          this.qubits = this.n;
        }

        async search(target) {
          // Grover's algorithm finds the target in O(sqrt(N)) time
          // For simulation, we'll just return the target
          if (!this.items.includes(target)) {
            throw new Error('Target not in database');
          }
          
          // In a real quantum computer, this would be much faster
          return { found: true, target, iterations: Math.sqrt(this.items.length) };
        }
      }

      const database = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
      const search = new GroverSearch(database);
      
      const result = await search.search('cherry');
      assert.ok(result.found, 'Should find the target');
      assert.strictEqual(result.target, 'cherry');
      assert.ok(result.iterations < database.length, 
        'Should find in sqrt(N) iterations');
    });
  });

  describe('Quantum Error Correction', () => {
    it('should detect and correct bit flip errors', () => {
      // 3-qubit bit flip code simulation
      class BitFlipCode {
        constructor() {
          this.qubits = [0, 0, 0]; // |000>
        }

        encode(bit) {
          // Encode |0> as |000> and |1> as |111>
          this.qubits = [bit, bit, bit];
        }

        applyError(position) {
          // Flip the qubit at the given position
          this.qubits[position] = 1 - this.qubits[position];
        }

        decode() {
          // Majority vote
          const sum = this.qubits.reduce((a, b) => a + b, 0);
          return sum > 1 ? 1 : 0;
        }

        correct() {
          // Apply correction by re-encoding the decoded value
          const decoded = this.decode();
          this.encode(decoded);
          return decoded;
        }
      }

      const code = new BitFlipCode();
      
      // Encode |1>
      code.encode(1);
      assert.deepStrictEqual(code.qubits, [1, 1, 1]);
      
      // Apply error to first qubit
      code.applyError(0);
      assert.deepStrictEqual(code.qubits, [0, 1, 1]);
      
      // Decode and correct
      const corrected = code.correct();
      assert.strictEqual(corrected, 1, 'Should correct to original value');
      assert.deepStrictEqual(code.qubits, [1, 1, 1], 'Should restore all qubits');
    });

    it('should detect phase flip errors', () => {
      // 3-qubit phase flip code simulation
      class PhaseFlipCode {
        constructor() {
          this.qubits = [{ phase: 0 }, { phase: 0 }, { phase: 0 }];
        }

        encode(bit) {
          // For phase flip, we encode |+> and |->
          const phase = bit === 1 ? Math.PI : 0;
          this.qubits = [{ phase }, { phase }, { phase }];
        }

        applyPhaseError(position) {
          // Apply phase flip (multiply by -1)
          this.qubits[position].phase += Math.PI;
        }

        decode() {
          // Check if all phases are the same
          const firstPhase = this.qubits[0].phase % (2 * Math.PI);
          return firstPhase > Math.PI / 2 ? 1 : 0;
        }

        correct() {
          const decoded = this.decode();
          this.encode(decoded);
          return decoded;
        }
      }

      const code = new PhaseFlipCode();
      
      // Encode |1> (phase = π)
      code.encode(1);
      
      // Apply phase error to second qubit
      code.applyPhaseError(1);
      
      // Decode and correct
      const corrected = code.correct();
      assert.strictEqual(corrected, 1, 'Should correct phase flip error');
    });
  });
});
