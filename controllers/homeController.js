const Connection = require('../config/database');

module.exports.home = function(req,res){
    Connection.query('SELECT * FROM Students', (err, rows, fields) => {
        if (err) throw err
      
        console.log('Successfully Connected to the database');
    });
    return res.render('login');
}

module.exports.landingPage = function(req,res){
    return res.render('landingPage');
}
