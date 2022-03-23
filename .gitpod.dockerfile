FROM gitpod/workspace-mongodb:latest

RUN bash -c "mkdir -p /workspace/data && mongod --dbpath /workspace/data"

