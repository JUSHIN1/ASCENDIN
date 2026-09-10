#!/bin/bash
pkill -f "node server.js" 2>/dev/null
cd /workspaces/ASCENDIN/backend
nohup node server.js > /tmp/ascendin.log 2>&1 &
sleep 3
curl -s http://localhost:8080/api/health && echo "   <- Ascendin is UP" || tail -20 /tmp/ascendin.log
