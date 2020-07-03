const baseUrl = 'https://mc-server-manager.herokuapp.com/api/';
// const baseUrl = 'http://localhost:5000/api/';
import viewUi from './viewUi.js';
import LoginController from './login.js';
const ui = new viewUi();
const serverStatus = {
  running: 'RUNNING',
  staging: 'STAGING',
  provisioning: 'PROVISIONING',
  stopping: 'STOPPING',
  terminated: 'TERMINATED'
}
const loginContainer = document.querySelector('#login');
const passwordInput = document.querySelector('#password-input');
const loginBtn = document.querySelector('#login-btn');
const toggler = document.querySelector('#toggler');

if (getTokenFromCookie()) {
  loadPage();
} else {
  ui.fadeLoadingSpinner();
  setLoginListener();
}

async function init() {
  let optionsWrapper = document.querySelector('#options-wrapper');
  let toggleContainer = document.createElement('div');
  let status = await getServerStatus();
  let simpleStatus = getServerStatusSimple(status);
  toggleContainer.innerHTML = `
    <div class="toggle ${simpleStatus ? 'toggle-on' : ''}" id="server-toggle">
      <div class="circle ${simpleStatus ? 'circle-on' : ''}"></div>
    </div>`
  optionsWrapper.appendChild(toggleContainer);
  setToggleListener();
  await refreshPage();
  ui.fadeLoadingSpinner();

  setInterval(() => {
    refreshPage();
  }, 30000);
}

async function refreshPage() {
  if (document.querySelector('#toggler').style.display == 'flex') {

    let serverToggle = document.querySelector('#server-toggle');
    let imageContainer = document.querySelector('#image-container');

    let status = await getServerStatus();
    status = getServerStatusSimple(status);
    if (status) {
      updateServerStatusText('Running');
    } else {
      updateServerStatusText('Off');
    }
    if (status) {
      imageContainer.style.display = 'block';
      if (!serverToggle.classList.contains('toggle-on'))
        serverToggle.classList.add('toggle-on');
      if (!serverToggle.firstElementChild.classList.contains('circle-on'))
        serverToggle.firstElementChild.classList.add('circle-on');
    } else {
      serverToggle.classList.remove('toggle-on');
      serverToggle.firstElementChild.classList.remove('circle-on');
      if (imageContainer.style.display == 'block') {
        imageContainer.classList.add('fade-out');
        setTimeout(() => {
          imageContainer.classList.remove('fade-out');
          imageContainer.style.display = 'none';
        }, 5000);
      }
    }
  }
}

function setToggleListener() {
  console.log('set toggle listener')
  let serverToggle = document.querySelector('#server-toggle');
  serverToggle.onclick = (e) => {
    console.log('touch!')
    e.preventDefault();
    if (serverToggle.classList.contains('toggle-on')) {
      serverToggle.classList.remove('toggle-on');
      serverToggle.firstElementChild.classList.remove('circle-on');
      updateServerStatusText('Shutting down');
      stopServer();
    } else {
      serverToggle.classList.add('toggle-on');
      serverToggle.firstElementChild.classList.add('circle-on');
      updateServerStatusText('Starting up');
      startServer();
    }
  }
}

function updateServerStatusText(text) {
  document.querySelector('#server-status').innerText = text;
}

function startServer() {
  ui.toggleLoadingSpinner();
  fetch(baseUrl + 'start-server', {
      mode: 'same-origin',
      headers: {
        'token': `${getTokenFromCookie()}`
      }
    })
    .then(res => res.json())
    .then((res) => {
      setTimeout(async () => {
        await refreshPage();
        ui.fadeLoadingSpinner();
        ui.generateToast('Server successfully started', 3000)
      }, 10000);
    })
    .catch(err => {
      ui.generateToast('Connection failed', 3000)
      console.log(err)
    })
}

function stopServer() {
  ui.toggleLoadingSpinner();
  fetch(baseUrl + 'stop-server', {
      mode: 'same-origin',
      headers: {
        'token': `${getTokenFromCookie()}`
      }
    })
    .then(res => res.json())
    .then((res) => {
      setTimeout(async () => {
        await refreshPage();
        ui.fadeLoadingSpinner();
        ui.generateToast('Server successfully shut down', 3000)
      }, 10000);
    })
    .catch(err => {
      ui.generateToast('Connection failed', 3000)
      console.log(err)
    })
}

async function getServerStatus() {
  try {
    let res = await fetch(baseUrl + 'server-status', {
      method: 'GET',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'token': `${getTokenFromCookie()}`
      },
    });
    res = await res.json();
    return await res.status;
  } catch (err) {
    return 'ERROR';
  }
}

function getServerStatusSimple(realStatus) {
  let status = false;
  switch (realStatus) {
    case 'RUNNING':
    case 'PROVISIONING':
    case 'STAGING':
      status = true;
      break;
    case 'STOPPING':
    case 'TERMINATED':
    default:
      status = false;
      break;
  }
  return status;
}

function getTokenFromCookie() {
  if (document.cookie) {
    let tokenCookie = document.cookie
      .split(';')
      .find(c => c.includes('mc-apikey'));
    if (tokenCookie) {
      let token = tokenCookie.split('=')[1];
      return token;
    }
  }
  return '';
}

function login() {
  return fetch(baseUrl + 'login', {
    method: 'GET',
    headers: {
      'password': passwordInput.value
    }
  });
}

function loadPage() {
  loginContainer.classList.add('slide-out-to-top');
  setTimeout(() => {
    loginContainer.style.display = 'none';
    init();
    toggler.style.display = 'flex';
  }, 500)
}

function setLoginListener() {
  loginBtn.onclick = loginListener;
}

async function loginListener(e) {
  e.preventDefault();
  if (passwordInput.value != null) {
    ui.toggleLoadingSpinner();
    let res = await login();
    res = await res.json();
    if (res.success) {
      document.cookie = `mc-apikey=${res.token}; expires=${new Date(Date.now() + 2592000000).toString()}`
      console.log(document.cookie);
      loadPage();
    } else {
      ui.fadeLoadingSpinner();
      passwordInput.value = '';
      ui.generateToast("Login failed", 3000);
      console.log(res.error);
    }
  }
}