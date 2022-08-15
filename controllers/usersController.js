const Connection = require('../config/database');

module.exports.login = function(req,res){
    console.log(req.body);
    let targetEmail = req.body.email;
    let sql = "SELECT * FROM Students where Email=?";
    Connection.query(sql,[targetEmail], (err, rows, fields) => {
        if (err) throw err
      
        console.log('The result is',rows);
        console.log(rows[0]);
        console.log(rows[0].Password);
        if(rows[0].Password==req.body.password){
            console.log('Password Entered is Correct');
        }
        else{
            console.log(req.body.password);
            console.log(rows[0].password);
            console.log('Password Entered is Incorrect');
        }
    });
    return res.redirect('/');
}