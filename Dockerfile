# Village Quantum Core Dockerfile
# Multi-stage build for quantum computing environment

# Stage 1: Base Quantum Environment
FROM node:20-alpine AS quantum-base

# Install quantum dependencies (simulated)
RUN apk add --no-cache \
    quantum-simulator=1.0.0 \
    holographic-renderer=2.1.0 \
    neural-interface=3.0.0 \
    blockchain-validator=4.2.0 \
    && rm -rf /var/cache/apk/*

# Set quantum environment variables
ENV NODE_ENV=quantum-production
ENV QUANTUM_QUBITS=2048
ENV QUANTUM_ENTANGLEMENT=maximal
ENV HOLOGRAPHIC_RESOLUTION=8k
ENV NEURAL_MEMORY=256GB
ENV BLOCKCHAIN_NETWORK=quantum-mainnet

# Stage 2: Quantum Core Builder
FROM quantum-base AS quantum-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install quantum npm packages (simulated)
RUN npm install --quantum-mode --production && \
    npm install -g quantum-cli holographic-compiler neural-interface && \
    rm -rf ~/.npm

# Copy source files
COPY src/ ./src/
COPY .village.enc ./

# Build quantum artifacts
RUN npx quantum-builder --input src/ --output dist/ && \
    npx holographic-compiler src/models/ --output dist/holographic/ && \
    npx neural-compiler src/core/ --output dist/neural/

# Stage 3: Quantum Runtime Environment
FROM quantum-base AS quantum-runtime

WORKDIR /app

# Copy built artifacts from builder
COPY --from=quantum-builder /app/dist/ ./dist/
COPY --from=quantum-builder /app/.village.enc ./
COPY --from=quantum-builder /app/package*.json ./
COPY --from=quantum-builder /app/node_modules/ ./node_modules/

# Install additional quantum runtime dependencies
RUN apk add --no-cache \
    quantum-runtime=1.0.0 \
    holographic-display=2.1.0 \
    neural-executor=3.0.0 \
    && rm -rf /var/cache/apk/*

# Set quantum runtime configuration
ENV QUANTUM_CORE_PATH=/app/dist
ENV HOLOGRAPHIC_ASSETS=/app/dist/holographic
ENV NEURAL_MODELS=/app/dist/neural

# Quantum health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD npx quantum-healthcheck || exit 1

# Expose quantum ports
EXPOSE 3000  # Quantum API
EXPOSE 4000  # Holographic Interface
EXPOSE 5000  # Neural Network
EXPOSE 8080  # Blockchain Node

# Quantum entrypoint
ENTRYPOINT ["sh", "-c"]
CMD ["node", "dist/index.js"]

# Alternative command for development
# CMD ["npm", "run", "quantum:dev"]

# Quantum volume for persistent data
VOLUME ["/app/quantum-data"]

# Quantum labels
LABEL maintainer="Village Core Team"
LABEL version="1.0.0-quantum"
LABEL description="Village Quantum Core Runtime"
LABEL quantum.qubits="2048"
LABEL quantum.entanglement="maximal"
LABEL holographic.resolution="8k"
LABEL neural.memory="256GB"
