echo ==== Prepare cache folder structure ====
mkdir node_deps || true
mkdir node_deps/4x || true
mkdir node_deps/6x || true
mkdir node_deps/8x || true

echo ==== Load nvm ====
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

echo ==== Test using node 4.x ====
nvm install 4.8.3
rm -rf node_modules
mkdir node_modules
cp -r node_deps/4x/* node_modules/ || true
npm install
npm test
cp -r node_modules/* node_deps/4x/ # Saving dependencies to be cached

echo ==== Test using node 6.x ====
nvm install 6.11.0
rm -rf node_modules
mkdir node_modules
cp -r node_deps/6x/* node_modules/ || true
npm install
npm test
cp -r node_modules/* node_deps/6x/ # Saving dependencies to be cached

echo ==== Test using node 8.x ====
nvm install 8.0.0
rm -rf node_modules
mkdir node_modules
cp -r node_deps/8x/* node_modules/ || true
npm install --no-shrinkwrap
npm test
cp -r node_modules/* node_deps/8x/ # Saving dependencies to be cached