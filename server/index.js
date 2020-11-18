const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const replace = require('replace-in-file');
var multer = require('multer')
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


  // multer
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, '')
  },
  filename: function (req, file, cb) {
    fileName = file.originalname;
    cb(null, './uploadedFile/' + 'genderbend-'+fileName);
  }
  });

  var upload = multer({ storage: storage }).single('file');

  // cleanup converted files
  const cleanup = () => {
    const files = fs.readdirSync('./uploadedFile');
    if (files.length > 0) {
      files.forEach(function(filename) {
        fs.unlinkSync('./uploadedFile/' + filename);
      })
    }
  }

  const addToPublic = (template) => {
    fs.writeFile('./react-ui/public/genderbend.html', template, 'utf-8', function (err) {
      if (err) throw err;          
    });
  }

  app.post('/api/upload', async (req, res) => {
    upload(req, res, async () => {

      function readWriteAsync() {
        const file = fs.readdirSync('./uploadedFile')[0];
        fs.readFile('./uploadedFile/' + file, 'utf-8', async (err, data) => {
          if (err) throw err;

          const template = '<p>' + data.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>") + '</p>';

          await addToPublic(template);

          fs.writeFile('./uploadedFile/' + file.split('.')[0] + '.html', template, 'utf-8', function (err) {
            if (err) throw err;
            fs.unlinkSync('./uploadedFile/' + file);
            return res.status(200).send(req.file);
          });
        });
      }
 
      readWriteAsync();
    })
  });
  
  app.get('/api/download', (req, res) => {
    const filename = fs.readdirSync('./uploadedFile');
    const folderPath = './uploadedFile/' + filename;
    res.download(folderPath, null, () => {
      cleanup();
    });
  });

  app.get('/api/unload', (req, res) => {
    console.log('unload');
    fs.unlinkSync('./react-ui/public/genderbend.html');
  });

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
