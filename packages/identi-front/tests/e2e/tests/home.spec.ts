describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.findByRole('heading', {
      name: /Vite React Best Practices Template/i
    }).should('exist');
  });
});
