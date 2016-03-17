var express = require('express')
    , session = require('cookie-session')
    , bodyParser = require('body-parser')
    , urlencodedParser = bodyParser.urlencoded({ extended: false })
    , twig = require('twig')
    , UserController = require('./src/user/controllers/UserController')
    , BucketController = require('./src/bucket/controllers/BucketController');
//AWS.config.region = 'us-standard';
//Link api http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
//Tutorial link http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html
//Multiple uploads https://codeforgeek.com/2016/01/multiple-file-upload-node-js/
//https://github.com/braitsch/node-login
//MongoDb for Node.js http://mongodb.github.io/node-mongodb-native/2.1/api/

var app = express();
var userCtrl = new UserController();
var bucketCtrl = new BucketController();

function User(_name) {
  var name = _name;

  this.setName = function(_name) {
    name = _name;
  }
  this.getName = function() {
    return name;
  }

}

/**
 * Spécification du chemin des fichiers static
 * */
app.use(express.static(__dirname + '/ui'));
app.use(express.static(__dirname + '/resources'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(session({secret:'56e58403c41eca0968145793'}));
var template = twig.twig({
    data:'',
    namespaces: { 'picture-store': '/ui/views/' }
}).render();
app.set('views', __dirname + '/ui/views/')
app.set('view engine', 'twig')


/**
 * Route par défaut (le home)
 * */
.get('/', function(req, res) {
    var user = new User('Macky Dieng');
    res.render('front/home', {user:user});
})
/**
 * Route par d'upload d'une image
 * */
.post('/uploadFiles', urlencodedParser, function(req,res) {
  bucketCtrl.addImagesAction(req,res);
})
/**
* Registering user route
**/
.post('/register', urlencodedParser,function(req,res) {
    userCtrl.registerAction(req,res);
})
/**
* Registering user route
**/
.get('/register',function(req,res) {
    res.render('user/signup',{});
})
.post('/update', urlencodedParser,function(req,res) {
    userCtrl.updateAction(req,res);
})
.post('/login', urlencodedParser,function(req,res) {
    userCtrl.loginAction(req,res);
})
.get('/logout', urlencodedParser,function(req,res) {
    userCtrl.logoutAction(req,res);
})
/**
* Route that allows to create user albums
**/
.post('/album/create', urlencodedParser,function(req,res) {
    bucketCtrl.addAlbumAction(req,res);
})
/**
* Route that allows to create user albums
**/
.post('/album/update', urlencodedParser,function(req,res) {
    bucketCtrl.updateAlbumAction(req,res);
})
/**
* Route for delete many objects
*/
.get('/album/delete/:id', function(req,res) {
  bucketCtrl.deleteAlbumAction(req,res);
})
/**
* Route for delete many objects
*/
.get('/admin', function(req,res) {
    userCtrl.adminAction(req,res);
})
/**
* Route for delete many objects
*/
.get('/user/albums/:id', function(req,res) {
    userCtrl.userAlbumsAction(req,res);
})
.get('/album', function(req,res) {
    userCtrl.albumAction(req,res);
    res.redirect('/');
})
.get('/user/delete/:id', function(req,res) {
    userCtrl.deleteUserAccountAction(req,res);
})
.get('/image/delete/:id', function(req,res) {
    bucketCtrl.deleteImageAction(req,res);
})
.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
/**
 * Launtching the server on port 3000
 * */
app.listen(3000);
console.log("Le serveur écoute sur le port 3000");
