const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const textract = require('textract');
const replace = require('replace-in-file');
const app = express();
const port = process.env.PORT || 5000;
var multer = require('multer')
var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, '')
},
filename: function (req, file, cb) {
  cb(null, 'input.txt' )
}
})

var upload = multer({ storage: storage }).single('file')

app.post('/api/upload', async (req, res) => {
  upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
    return res.status(200).send(req.file);
  });

  const options = {
    files: 'input.txt',
    from: /he/g,
    to: 'her',
  };

  try {
    const results = await replace(options)
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }

});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));