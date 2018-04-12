describe('Login Test', function() {
  it('Vist Login', function() {
    cy.visit("/login");

    cy.get('.MuiInput-input-25[type="email"]').type('admin@quizbizz.com');
    cy.get('.MuiInput-input-25[type="password"]').type('adminadmin');
    cy.get('.btn[type="submit"]').click();
    cy.url().should('include', '/quizzes');
  })
})