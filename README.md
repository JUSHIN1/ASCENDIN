# Ascendin

Stocks, bonds and mobile money investing for Uganda.

## Frontend

Open `frontend/index.html` in a browser. For proper module loading, run a
local HTTP server from the `frontend/` folder:

  python3 -m http.server 8000

Then visit http://localhost:8000.

## Backend

The backend handles KYC, mobile money wiring (MTN MoMo + Airtel Money),
a double-entry ledger, account storage, and market data.

    cd backend
    cp .env.example .env
    npm install
    npm start

The frontend auto-detects the backend at http://localhost:8080 and syncs
account state. If the backend is down, the app stays in local  mode.

## Environment variables

See `backend/.env.example`. You will need sandbox keys from:

- https://momodeveloper.mtn.com (Collections + Disbursements products)
- Airtel Open API UAT portal

For real mobile money PIN prompts to reach actual phones, swap sandbox
keys for production keys and register a public callback URL with the telcos.

cd ascendin
npm run install-all
npm run dev

cd /workspaces/ASCENDIN
[ -f start.sh ] || cat > start.sh << 'EOF'
#!/bin/bash
pkill -f "node server.js" 2>/dev/null
cd /workspaces/ASCENDIN/backend
nohup node server.js > /tmp/ascendin.log 2>&1 &
sleep 3
curl -s http://localhost:8080/api/health && echo "   <- Ascendin is UP" || tail -20 /tmp/ascendin.log
EOF
[ -d .devcontainer ] || mkdir -p .devcontainer
[ -f .devcontainer/devcontainer.json ] || cat > .devcontainer/devcontainer.json << 'EOF'
{
  "forwardPorts": [8080],
  "portsAttributes": {
    "8080": { "label": "Ascendin", "visibility": "public", "onAutoForward": "notify" }
  },
  "postAttachCommand": "bash /workspaces/ASCENDIN/start.sh"
}
EOF
bash start.sh