const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var handlebars = require('express-handlebars');




const app = express();

//body parser
app.use(express.urlencoded({extended: false}));

app.use(methodOverride('_method'));

// mongodb URI
const MongoURI = require('./keys').MongoURI;

const conn = mongoose.createConnection(MongoURI,{ useNewUrlParser: true, useUnifiedTopology: true })


// HandleBars
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}));

// init gfs
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
});

// create storage engine
const storage = new GridFsStorage({
    url: MongoURI,
    file: (req, file) => {
    // returning a promise
      return new Promise((resolve, reject) => {
        // using crypto rather than bcrypt since does not need to be as secure as a password
        // this is to generate an name for file being uploaded
        crypto.randomBytes(16, (err, buf) => {
          // iff error return reject on promise
          if (err) {
            return reject(err);
          }
          // create filename with extension
          const filename = buf.toString('hex') + path.extname(file.originalname);
          // create item to be sent
          // bucketName matches collectionName
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          // resolve promise with file info
          resolve(fileInfo);
        });
      });
    }
  });
  // can use upload as middleware to make post requests
  const upload = multer({ storage });



// user ID in files to link to outfit rahter than saving userID in db

// upload post route using upload.single to only upload one file
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/')
});

// route GET files
app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    })
})


app.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // check if files exist
        if(!files || files.length == 0){
            res.render('index', {files: false})
        } else { 
            files.map(file => {
            res.render('index', {layout: 'main', files:file});
            })
        }
    });
});


const port = 3000;

app.listen(port, () => console.log(`listening on port: ${port}`));