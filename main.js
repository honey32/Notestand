'use strict'

const { launch } = require('carlo');
const { join } = require('path');

try {(async () => {
  // Launch the browser.
  const app = await launch();

  // Terminate Node.js process on app window closing.
  app.on('exit', () => process.exit());

  // Tell carlo where your web files are located.
  app.serveFolder(join(__dirname, 'public'));

  // Expose 'env' function in the web environment.
  await app.exposeFunction('env', _ => process.env);

  // Navigate to the main page of your app.
  await app.load('/app/index.html');
})();} catch(e) {
  console.exception(e)
}