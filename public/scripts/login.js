function initLogin() {

}

export default class LoginController {

  constructor(baseUrl, ui) {
    this.apiUrl = baseUrl + 'login';
    this.ui = ui;

    this.loginContainer = document.querySelector('#login');
    this.passwordInput = document.querySelector('#password-input');
    this.loginBtn = document.querySelector('#login-btn');
    this.toggler = document.querySelector('#toggler');
  }

  login() {
    return fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'password': this.passwordInput.value
      }
    });
  }

  loadPage() {
    this.loginContainer.classList.add('slide-out-to-top');
    this.toggler.style.display = 'flex';
  }

  setLoginListener() {
    console.log(this.passwordInput)
    this.loginBtn.onclick = this.loginListener;
  }

  async loginListener(e) {
    e.preventDefault();
    if (document.querySelector('#password-input').value != null) {
      this.ui.toggleLoadingSpinner();
      let res = await this.login();
      res = await res.json();
      this.ui.fadeLoadingSpinner();
      if (res.success) {
        document.cookie = `mc-apikey=${res.token}; expires=${new Date(Date.now() + 2592000000).toString()}`
        this.loadPage();
      } else {
        console.log(res.error);
      }
    }
  }
}