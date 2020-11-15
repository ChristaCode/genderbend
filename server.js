const express = require('express');
const path = require('path');
const replace = require('replace-in-file');
const app = express();
const port = process.env.PORT || 5000;
var multer = require('multer')
var cors = require('cors');
const fs = require('fs');

app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, '')
},
filename: function (req, file, cb) {
  fileName = file.originalname;
  cb(null, './uploadedFile/' + 'genderbend-'+fileName)
}
})

const cleanup = () => {
  const files = fs.readdirSync('./uploadedFile');
  if (files.length > 0) {
    files.forEach(function(filename) {
      fs.unlinkSync('./uploadedFile/' + filename);
    })
  }
}

var upload = multer({ storage: storage }).single('file')

app.post('/api/upload', async (req, res) => {
  upload(req, res, async () => {
    const options = {
      files: './uploadedFile/*',
      from: [/he/g, /him/g, /his/g, /himself/g, /brother/g, /nephew/g, /uncle/g],
      to: ['her', 'her', 'hers', 'herself', 'sister', 'niece', 'aunt'],
    };
  
    try {
      const results = await replace(options)
      console.log('Replacement results:', results);
      return res.status(200).send(req.file);
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  })
});

app.get('/api/download', (req, res) => {
  const filename = fs.readdirSync('./uploadedFile');
  const folderPath = './uploadedFile/' + filename;
  res.download(folderPath, null, () => {
    cleanup();
  });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));