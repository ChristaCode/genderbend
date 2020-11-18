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

  function matchCase(text, pattern) {
    var result = '';
    for(var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        var p = pattern.charCodeAt(i);

        if(p >= 65 && p < 65 + 26) {
            result += c.toUpperCase();
        } else {
            result += c.toLowerCase();
        }
    }
    return result;
}

  app.post('/api/upload', async (req, res) => {
    upload(req, res, async () => {

      function readWriteAsync() {
        const file = fs.readdirSync('./uploadedFile')[0];
        fs.readFile('./uploadedFile/' + file, 'utf-8', async (err, data) => {
          if (err) throw err;

          data = data.replaceAll(new RegExp( "(" + 'handsome' + ")" , 'gi' ), function(match) {
            return matchCase("beautiful", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'uncle' + ")" , 'gi' ), function(match) {
            return matchCase("aunt", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'nephew' + ")" , 'gi' ), function(match) {
            return matchCase("niece", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'grandpa' + ")" , 'gi' ), function(match) {
            return matchCase("grandma", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'penis' + ")" , 'gi' ), function(match) {
            return matchCase("vagina", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'dick' + ")" , 'gi' ), function(match) {
            return matchCase("pussy", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'cock' + ")" , 'gi' ), function(match) {
            return matchCase("cunt", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'member' + ")" , 'gi' ), function(match) {
            return matchCase("pussy", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'girth' + ")" , 'gi' ), function(match) {
            return matchCase("hole", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'sire' + ")" , 'gi' ), function(match) {
            return matchCase("ma'am", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'mr.' + ")" , 'gi' ), function(match) {
            return matchCase("ms.", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'lord' + ")" , 'gi' ), function(match) {
            return matchCase("lady", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'husband' + ")" , 'gi' ), function(match) {
            return matchCase("wife", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'lad' + ")" , 'gi' ), function(match) {
            return matchCase("lassy", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'chest' + ")" , 'gi' ), function(match) {
            return matchCase("breast", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'man' + ")" , 'gi' ), function(match) {
            return matchCase("woman", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'master' + ")" , 'gi' ), function(match) {
            return matchCase("mistress", match);
          });
          data = data.replaceAll(new RegExp( "(" + 'king' + ")" , 'gi' ), function(match) {
            return matchCase("queen", match);
          });

          // var regexp = new RegExp("\\b" + 'he' + "\\b", "g");
          data = data.replaceAll(/\bhe\b/g, 'she');
          data = data.replaceAll(/\bHe\b/g, 'She');
          data = data.replaceAll(/\bhis\b/g, 'her');
          data = data.replaceAll(/\bHis\b/g, 'Her');
          data = data.replaceAll(/\bhim\b/g, 'her');
          data = data.replaceAll(/\bHim\b/g, 'Her');

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
