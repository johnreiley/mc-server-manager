const Compute = require('@google-cloud/compute');
const fs = require('fs');
let keyPath;
if (process.env.COMPUTE_KEY != null) {
  try {
    fs.unlinkSync('./compute-keys.json');
  } catch(err) {
    console.error(err)
  }
  fs.writeFileSync('compute-keys.json', process.env.COMPUTE_KEY);
  keyPath = 'compute-keys.json';
} else {
  keyPath = 'C:/Users/super/OneDrive/Documents/Google Cloud/compute-keys.json';
}
const ZONE = 'us-west3-a';
const INSTANCE = 'mc-server';
const compute = new Compute({projectId: 'useful-matter-272420', keyFilename: keyPath, serviceAccountEmail: 'mc-server-manager@useful-matter-272420.iam.gserviceaccount.com'});
const zone = compute.zone(ZONE);
const vm = zone.vm(INSTANCE);

function startServer(req, res) {
  vm.start()
  .then((response) => {
    if (response[0].metadata.status) {
      let serverStatus = response[0].metadata.status;
      res.status(200).json({status: serverStatus})
    } else {
      res.status(500).json({error: 'There was an error'});
    }
  })
  .catch((err) => res.status(400).json({error: err}))
}

function stopServer(req, res) {
  vm.stop()
  .then((response) => {
    if (response[0].metadata.status) {
      let serverStatus = response[0].metadata.status;
      res.status(200).json({status: serverStatus})
    } else {
      res.status(500).json({error: 'There was an error'});
    }
  })
  .catch((err) => res.status(400).json({error: err}))
}

function getServerStatus(req, res) {
  console.log(req.headers);
  vm.get()
  .then((response) => {
    if (response[0].metadata.status) {
      let serverStatus = response[0].metadata.status;
      res.status(200).json({status: serverStatus})
    } else {
      res.status(500).json({error: 'There was an error'});
    }
  })
  .catch((err) => res.status(400).json({error: err, message: 'fail'}))
}

module.exports = {
  startServer,
  stopServer,
  getServerStatus
}