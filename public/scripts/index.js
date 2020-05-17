const baseUrl = 'https://mc-server-manager.herokuapp.com/api/';
// import viewUi from './viewUi.js';
const ui = new viewUi();
const baseUrl = 'http://localhost:5000/api/';
const serverStatus = {
  running: 'RUNNING',
  staging: 'STAGING',
  provisioning: 'PROVISIONING',
  stopping: 'STOPPING',
  terminated: 'TERMINATED'
}

init();

async function init() {
  let optionsWrapper = document.querySelector('#options-wrapper');
  let toggleContainer = document.createElement('div');
  let status = await getServerStatus();
  let simpleStatus = getServerStatusSimple(status);
  console.log(simpleStatus);
  toggleContainer.innerHTML = `
    <div class="toggle ${simpleStatus ? 'toggle-on' : ''}" id="server-toggle">
      <div class="circle ${simpleStatus ? 'circle-on' : ''}"></div>
    </div>`
  optionsWrapper.appendChild(toggleContainer);
  setToggleListner();
  await refreshPage();
  ui.fadeLoadingSpinner();

  setInterval(() => {
    refreshPage();
  }, 30000);
}

async function refreshPage() {
  let serverToggle = document.querySelector('#server-toggle');

  let status = await getServerStatus();
  status = getServerStatusSimple(status);
  if (status) {
    updateServerStatusText('Running');
  } else {
    updateServerStatusText('Off');
  }
  if (status) {
    if (!serverToggle.classList.contains('toggle-on'))
      serverToggle.classList.add('toggle-on');
    if (!serverToggle.firstElementChild.classList.contains('circle-on'))
      serverToggle.firstElementChild.classList.add('circle-on');
  } else {
    serverToggle.classList.remove('toggle-on');
    serverToggle.firstElementChild.classList.remove('circle-on');
  }
}

function setToggleListner() {
  let serverToggle = document.querySelector('#server-toggle');
  serverToggle.ontouchend = (e) => {
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
      mode: 'same-origin'
    })
    .then(res => res.json())
    .then((res) => {
      console.log('Starting the server...');
      setTimeout(async () => {
        await refreshPage();
        ui.fadeLoadingSpinner();
      }, 10000);
    })
    .catch(err => console.log(err))
}

function stopServer() {
  ui.toggleLoadingSpinner();
  fetch(baseUrl + 'stop-server', {
      mode: 'same-origin'
    })
    .then(res => res.json())
    .then((res) => {
      console.log('Stopping the server...');
      setTimeout(async () => {
        await refreshPage();
        ui.fadeLoadingSpinner();
      }, 10000);
    })
    .catch(err => console.log(err))
}

async function getServerStatus() {
  try {
    let res = await fetch(baseUrl + 'server-status', {
      method: 'GET',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
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