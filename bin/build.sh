echo ==== Load nvm ====
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

echo ==== Test using node 6.x ====
nvm install 6.12.3
rm -rf node_modules
npm install
npm test

echo ==== Test using node 8.x ====
nvm install 8.9.4
rm -rf node_modules
npm install --no-shrinkwrap
npm test

echo ==== Test using yarn 1.x ====
rm -rf node_modules
npm install yarn@1.3.2 --no-shrinkwrap
./node_modules/.bin/yarn install --no-lockfile
./node_modules/.bin/yarn test

echo ==== Test using node 9.x ====
nvm install 9.4.0
rm -rf node_modules
npm install --no-shrinkwrap
npm test