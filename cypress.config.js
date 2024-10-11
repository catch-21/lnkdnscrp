const { defineConfig } = require("cypress");
const fs = require('fs');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 60_000,
    failOnStatusCode: false,
    env: {
      USERNAME: process.env.USERNAME,
      PASSWORD: process.env.PASSWORD,
      URLS: process.env.URLS
    },

    setupNodeEvents(on, config) {
      // Register a task for writing data to a file
      on('task', {
        writeNewCsv({ path, data }) {
          fs.writeFileSync(path, data, 'utf8');
          console.log(`File written to ${path}. Headers: ${data}`);
          return null;
        },
        appendToCsv({ path, data }) {
          fs.appendFileSync(path, data, 'utf8');
          console.log(`File appended to ${path}. Data: ${data}`);
          return null;
        }
      });
    },

  },
});
