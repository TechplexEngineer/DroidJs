#!/bin/bash
NODE_ENV=production SHUTDOWN_TIMEOUT=2 PORT=5173 \
    /home/pi/.nvm/versions/node/v20.17.0/bin/node /home/pi/DroidJs/build
