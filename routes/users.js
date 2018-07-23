var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register', {
      'title':'Register'
  });
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', {
      'title':'Login'
  });
});

router.post('/register', function(req, res, next) {
    // get Form Values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
        
    // Check for image fields
    if(req.files.profileimage) {
        console.log('Uploading file...');
        
        var profileImageOriginalName    = req.files.profileimage.originalname;
        var profileImageName            = req.files.profileimage.name;
        var profileImageMime            = req.files.profileimage.mimetype;
        var profileImagePath            = req.files.profileimage.path;
        var profileImageExt             = req.files.profileimage.extension;
        var profileImageSize            = req.files.profileimage.size;
    } else {
        // Set the default image
        // create a file named 'noimage.png' in the uploads folder
        var profileImageName = 'noimage.png';
    }
    
    // Form Validation
    req.checkBody('name', 'Name field is required').notEmpty();;
    req.checkBody('email', 'Email field is required').notEmpty();;
    req.checkBody('email', 'Email is invalid').isEmail();;
    req.checkBody('usernme', 'Username field is required').notEmpty();;
    req.checkBody('password', 'Password field is required').notEmpty();;
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);;
    
    // Check for errors
    var errors = req.validationErrors();
    
    if(errors) {
       res.render('register', {
            errors      : errors,
            name        : name,
            email       : email,
            username    : username,
            password    : password,
            password2   : password2
       });
    } else {
        var newUser     = new User({
            name        : name,
            email       : email,
            username    : username,
            password    : password,
            profileimage: profileimageName
        });
        
        // Create User
        User.createUser(newUser, function(err, user) {
            if(err) throw err;
            console.log(user);
        });
        
        // Success Message
        req.flash('success', 'You are now registered and may log in');
        
        res.location('/');
        res.redirect('/');
    }
});



module.exports = router;
