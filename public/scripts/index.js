const baseUrl = 'https://mc-server-manager.herokuapp.com/api/';
// const baseUrl = 'http://localhost:5000/api/';
const serverStatus = {
  running: 'RUNNING',
  staging: 'STAGING',
  provisioning: 'PROVISIONING',
  stopping: 'STOPPING',
  terminated: 'TERMINATED'
}

init();

function init() {
  refreshPage();
  setInterval(() => {
    refreshPage();
  }, 30000);
}

async function refreshPage() {
  let startButton = document.querySelector('#start-btn');
  let stopButton = document.querySelector('#stop-btn');
  let buttonContainer = document.querySelector('#button-container');
  let serverStatusText = document.querySelector('#server-status');

  let status = await getServerStatus();
  serverStatusText.innerText = status;
  switch (status) {
    case 'RUNNING':
    case 'PROVISIONING':
    case 'STAGING':
      startButton.style.display = 'none';
      stopButton.style.display = 'block';
      break;
    case 'STOPPING':
    case 'TERMINATED':
    default:
      startButton.style.display = 'block';
      stopButton.style.display = 'none';
      break;
  }
}

// function createStartButton() {
//   let button = document.createElement('button');
//   button.innerText = 'Start Server';
//   button.classList.add('btn');
//   button.classList.add('btn-primary');
//   button.id = 'start-btn';
//   button.onclick = startServer;
//   return button;
// }

// function createStopButton() {
//   let button = document.createElement('button');
//   button.innerText = 'Stop Server';
//   button.classList.add('btn');
//   button.classList.add('btn-primary');
//   button.id = 'stop-btn';
//   button.onclick = stopServer;
//   return button;
// }

function startServer() {
  fetch(baseUrl + 'start-server', {
      mode: 'same-origin'
    })
    .then(res => res.json())
    .then((res) => {
      console.log('Starting the server...');
      setTimeout(refreshPage, 5000);
    })
    .catch(err => console.log(err))
}

function stopServer() {
  fetch(baseUrl + 'stop-server', {
      mode: 'same-origin'
    })
    .then(res => res.json())
    .then((res) => {
      console.log('Stopping the server...');
      setTimeout(refreshPage, 5000);
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
    return res.status;
  } catch (err) {
    return 'ERROR';
  }

}