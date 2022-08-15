const Connection = require('../config/database');

module.exports.home = function(req,res){
    return res.render('studentHome');
}

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('back');
    }
    else{
        return res.render('studentLogin');
    }
}

module.exports.createSession = function(req,res){
    if(req.user.isAdmin==0){
        return res.redirect('/student/');
    }
    else{
        req.logout();
        return res.redirect('/');
    }
}

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}

module.exports.courses = async function(req,res){
    if(req.isAuthenticated()){
        let StudentId = req.user.id;
        var targetEmail = req.user.email;
        let sql1 = 'SELECT * FROM CoursesTaken INNER JOIN Courses ON CoursesTaken.Course_Id = Courses.id WHERE Student_id = ?';
        Connection.query(sql1,[StudentId],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                var resultCourse = rows;
                var resultLength = rows.length;
                let sql2 = 'SELECT * FROM Students WHERE email = ?';
                Connection.query(sql2,[targetEmail],(err,rows,fields)=>{
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        //console.log(rows[0]);
                        //req.flash('error','just checking....');
                        return res.render('studentCourses',{
                            courses:resultCourse,
                            coursesCount:resultLength,
                            profileUser:rows[0]
                        });
                    }
                });
            }
        });
    }else{
        return res.render('studentCourses',{
            courses:[],
            coursesCount:0,
            profileUser:{}
        });
    }
}

module.exports.courseSelection = function(req,res){
    if(req.isAuthenticated()){
        let targetEmail = req.user.email;
        let sql1 = 'SELECT * FROM students WHERE email = ? ';
        Connection.query(sql1,[targetEmail],(err,rows,fields) => {
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                let sql2 = 'SELECT * FROM Courses';
                Connection.query(sql2,[],(err,rows,fields) => {
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        let StudentId = req.user.id;
                        var result = rows;
                        let sql3 = 'SELECT * FROM CoursesTaken WHERE Student_Id = ?';
                        Connection.query(sql3,[StudentId],(err,rows,fields) => {
                            if(err){
                                console.log('Error',err);
                                return res.redirect('back');
                            }
                            else{
                                let size = result.length;
                                var boolArray = new Array(size).fill(true);
                                var countCourses = 0;
                                for(r of rows){
                                    //console.log(r.Course_Id,' is marked as false');
                                    boolArray[r.Course_Id-1]=false;
                                }
                                for(i=0;i<size;++i){
                                    if(boolArray[i]==true){
                                        ++countCourses;
                                    }
                                }
                                return res.render('studentCourseSelection',{
                                    courses:result,
                                    boolArray:boolArray,
                                    countCourses:countCourses
                                });
                            }
                        });
                    }
                });
            }
        });
    }else{
        return res.render('studentCourseSelection');
    }
}

module.exports.timeTable = function(req,res){
    if(req.isAuthenticated()){
        let StudentId = req.user.id;
        let sql1 = 'SELECT * FROM CoursesTaken INNER JOIN Courses ON CoursesTaken.Course_Id = Courses.id WHERE Student_id = ?';
        Connection.query(sql1,[StudentId],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                var timeTable = {
                    "Monday":{
                        "09:00 A.M.":'',
                        "11:00 A.M.":'',
                        "03:00 P.M.":''
                    },
                    "Tuesday":{
                        "09:00 A.M.":'',
                        "11:00 A.M.":'',
                        "03:00 P.M.":''
                    },
                    "Wednesday":{
                        "09:00 A.M.":'',
                        "11:00 A.M.":'',
                        "03:00 P.M.":''
                    },
                    "Thursday":{
                        "09:00 A.M.":'',
                        "11:00 A.M.":'',
                        "03:00 P.M.":''
                    },
                    "Friday":{
                        "09:00 A.M.":'',
                        "11:00 A.M.":'',
                        "03:00 P.M.":''
                    }
                }
                for(r of rows){
                    let day = r.days;
                    let time = r.time;
                    //console.log(day,time);
                    if(day[2]=='M'){
                        timeTable["Monday"][time]=r.name;
                        timeTable["Wednesday"][time]=r.name;
                        timeTable["Friday"][time]=r.name;
                    }
                    else{
                        timeTable["Tuesday"][time]=r.name;
                        timeTable["Thursday"][time]=r.name;
                    }
                }
                return res.render('studentTimeTable',{
                    timeTable:timeTable
                });
            }
        });
    }else{
        return res.render('studentTimeTable',{
            timeTable:[]
        });
    }
}

module.exports.settings = function(req,res){
    return res.render('studentSettings');
}

module.exports.changePassword = function(req,res){
    let targetEmail = req.user.email;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;
    if(newPassword!=confirmPassword){
        return res.redirect('back');
    }
    else{
        let sql = 'SELECT * FROM users where email = ? AND pswd = ?';
        Connection.query(sql,[targetEmail,currentPassword], (err, rows, fields) => {
        if (err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else if(rows){
            let sql = 'UPDATE users SET pswd = ? where email = ? AND pswd = ?';
            Connection.query(sql,[newPassword,targetEmail,currentPassword],(err,rows,fields)=> {
                if(err){
                    console.log('Error in updating db',err);
                    return res.redirect('back');
                }
                else{
                    req.flash('success','Password Updated');
                    return res.redirect('back');
                }
            });
        }
        else{
            console.log('User not Found');
            return res.redirect('back');
        }
    });
    }
}

module.exports.viewDetails = function(req,res){
    let semester = req.query.semester;
    let courseId = req.query.courseId;
    let sql = 'SELECT * FROM Courses where semester = ? AND id = ?';
    Connection.query(sql,[semester,courseId],(err,rows,fields) => {
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.render('viewCourseDetails',{
                course:rows[0]
            });
        }
    });
} 

module.exports.enroll = function(req,res){
    let StudentId = req.user.id;
    //console.log(req.query);
    let semester = req.query.semester;
    let CourseId = parseInt(req.query.courseId);
    //console.log(StudentId,CourseId,semester);

    let sql = 'INSERT INTO CoursesTaken (Student_Id,Course_Id) VALUES (?,?)';
    Connection.query(sql,[StudentId,CourseId],(err,rows,fields) => {
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            let sql1 = 'UPDATE Students SET coursesCount = coursesCount+1 WHERE email = ? ';
            Connection.query(sql1,[req.user.email],(err,rows,fields)=>{
                if(err){
                    console.log('Error',err);
                    return res.redirect('back');
                }
                else{
                    return res.redirect('back');
                }
            });
        }
    });

}

module.exports.dropCourse = function(req,res){
    let courseId = parseInt(req.query.courseId);
    let studentId = req.user.id;
    let sql = 'DELETE FROM  CoursesTaken WHERE Student_Id = ? AND Course_Id = ?';
    Connection.query(sql,[studentId,courseId],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            let sql1 = 'UPDATE Students SET coursesCount = coursesCount-1 WHERE email = ? ';
            Connection.query(sql1,[req.user.email],(err,rows,fields)=>{
                if(err){
                    console.log('Error',err);
                    return res.redirect('back');
                }
                else{
                    return res.redirect('back');
                }
            });
        }
    });
}

module.exports.lockChoices = function (req,res){
    if(req.isAuthenticated()){

        let sql = 'SELECT * FROM Students WHERE email = ?';
        Connection.query(sql,[req.user.email],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else if(rows[0].coursesCount>6){
                req.flash('error','You cannot enroll in more than 6 courses per semester');
                return res.redirect('back');
            }
            else{
                let sql1 = 'UPDATE Students SET choicesLocked = ? WHERE email = ?';
                Connection.query(sql1,[1,req.user.email],(err,rows,fields)=>{
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        return res.redirect('back');
                    }
                });
            }
        });
    }
    else{
        return res.render('studentCourses',{
            courses:[],
            coursesCount:0
        });
    }
}

module.exports.search = function(req,res){
    return res.render('studentSearch',{
        searchResults:[]
    });
}

module.exports.searchDB = function(req,res){
    let input = req.body.input;
    let sql = 'SELECT * FROM Courses WHERE name LIKE ? ';
    Connection.query(sql,[input],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            if(rows.length>0){
                return res.render('studentSearch',{
                    searchResults:rows,
                    course:true
                });
            }
            else{
                let sql1 = 'SELECT * FROM faculty WHERE firstname LIKE ? ';
                Connection.query(sql1,[input],(err,rows,fields)=>{
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        //console.log('Search Results',rows);
                        return res.render('studentSearch',{
                            searchResults:rows,
                            course:false
                        });
                    }
                });
            }
        }
    });
}

