class RegistrationForm {
  constructor() {
    this.form = document.getElementById('registration-form');
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this._onSubmit(e));
  }

  _onSubmit(e) {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName  = document.getElementById('last-name').value.trim();
    const age       = document.getElementById('age').value.trim();

    sessionStorage.setItem('firstName', firstName);
    sessionStorage.setItem('lastName',  lastName);
    sessionStorage.setItem('age',       age);

    window.location.href = 'ID.html';
  }
}

document.addEventListener('DOMContentLoaded', () => new RegistrationForm());
