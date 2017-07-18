echo ==== Load nvm ====
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

echo ==== Test using node 4.x ====
rm -rf node_modules
nvm install 4.8.3
npm install
npm test

echo ==== Test using node 6.x ====
rm -rf node_modules
nvm install 6.11.1
npm install
npm test

echo ==== Test using node 8.x ====
rm -rf node_modules
nvm install 8.0.0
npm install --no-shrinkwrap
npm test