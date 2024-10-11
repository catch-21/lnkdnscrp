const fs = require('fs');
const path = './output.csv';

// Function to append data to CSV
function appendToCsv(name) {
  const csvLine = `${name}\n`;
  fs.appendFileSync(path, csvLine, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to CSV file', err);
    }
  });
}

describe('LinkedIn Scraping and Store About in CSV', () => {
  before(() => {
    // Write CSV header or clear existing data
    cy.task('writeNewCsv', { path: path, data: "Profile URL, About Content\n" });

    // Log into LinkedIn
    cy.visit('https://www.linkedin.com/login');

    cy.log(`Logging in with username: ${Cypress.env('USERNAME')}`);
  
    cy.get('#username').type(Cypress.env('USERNAME'));
    cy.get('#password').type(Cypress.env('PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.pause();
    cy.log("Paused. Now manually proceed through human validation")
  });

  it('should scrape profile data and store in CSV', () => {
    // Array of profile URLs to scrape
    const profileUrls = Cypress.env('URLS').split(' ');
    cy.log('URLS: ' + profileUrls);

    profileUrls.forEach((url) => {
      const aboutUrl = `${url}/about`;
      cy.log(`Navigating to: ${aboutUrl}`)
      cy.visit(aboutUrl, { failOnStatusCode: false });

      // Scrape the profile about text and append to CSV
      cy.contains('h2', 'Overview')
        .siblings('p.break-words')
        .should('exist')
        .and('be.visible')
        .then(($p) => {
          const about = $p.text();
          cy.log('About: ' + about);
          // appendToCsv(name);
          cy.task('appendToCsv', { path: path, data: `${url}, ${about}\n` });
        });
    });
  });
});