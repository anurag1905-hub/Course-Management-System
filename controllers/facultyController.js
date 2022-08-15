const Connection = require('../config/database');

module.exports.home = function(req,res){
    return res.render('facultyHome');
}

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    else{
        return res.render('facultyLogin');
    }
}

module.exports.settings = function(req,res){
    return res.render('facultySettings');
}

module.exports.createSession = function(req,res){
    if(req.user.isAdmin==1){
        return res.redirect('/faculty/');
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

module.exports.courses = function(req,res){
    let sql = 'SELECT * FROM Courses';
    Connection.query(sql,[],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.render('facultyCourses',{
                courses:rows
            });
        }
    });
}

module.exports.editCourse = function(req,res){
    let courseId = req.query.courseId;
    let semester = req.query.semester;
    let sql = 'SELECT * FROM Courses WHERE id = ? AND semester = ? ';
    Connection.query(sql,[courseId,semester],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.render('facultyEditCourse',{
                course:rows[0]
            });
        }
    });
}

module.exports.saveCourses = function(req,res){
    let courseId = req.body.id;
    let newDescription = req.body.description;
    let newSyllabus = req.body.syllabus;
    let newInstructor = req.body.instructor;
    let newCredits = req.body.credits;

    let sql = 'UPDATE Courses SET description = ? , syllabus = ? , instructor = ? , credits = ? WHERE id = ?';
    Connection.query(sql,[newDescription,newSyllabus,newInstructor,newCredits,courseId],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            console.log(rows);
            return res.redirect('/faculty/courses');
        }
    });
}

module.exports.timeTable = function(req,res){
    if(req.isAuthenticated()){
        let sql = 'SELECT * FROM faculty WHERE email = ?';
        Connection.query(sql,[req.user.email],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                var targetId = rows[0].id;
                let sql2 = 'SELECT * FROM CoursesTaught INNER JOIN courses ON CoursesTaught.Course_Id = courses.id WHERE Faculty_Id = ? ';
                Connection.query(sql2,[targetId],(err,rows,fields)=>{
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
                        return res.render('facultyTimeTable',{
                            timeTable:timeTable
                        });
                    }
                });
            }
        });
    }
    else{
        return res.render('facultyTimeTable',{
            timeTable:[]
        });
    }
}

module.exports.editFaculty = function(req,res){
    if(req.isAuthenticated()){
        let sql1 = 'SELECT * FROM faculty WHERE email = ?';
        Connection.query(sql1,[req.user.email],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                var profileUser = rows[0];
                let targetId = rows[0].id;
                let sql2 = 'SELECT * FROM CoursesTaught INNER JOIN courses ON CoursesTaught.Course_Id = courses.id WHERE Faculty_Id = ? ';
                Connection.query(sql2,[targetId],(err,rows,fields)=>{
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        //console.log(rows);
                        return res.render('facultyAvailability',{
                            courses:rows,
                            profileUser:profileUser
                        });
                    }
                });
            }
        });
    }
    else{
        return res.render('facultyAvailability',{
            rows:[],
            profileUser:{}
        });
    }
}

module.exports.available = function(req,res){
    let CourseId = req.query.courseId;
    let FacultyId = req.query.facultyId;
    let sql = 'UPDATE CoursesTaught SET availability = 1 WHERE Course_Id = ? AND Faculty_Id = ?';
    Connection.query(sql,[CourseId,FacultyId],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.redirect('/faculty/editFaculty');
        }
    });
}

module.exports.unavailable = function(req,res){
    let CourseId = req.query.courseId;
    let FacultyId = req.query.facultyId;
    let sql = 'UPDATE CoursesTaught SET availability = 0 WHERE Course_Id = ? AND Faculty_Id = ?';
    Connection.query(sql,[CourseId,FacultyId],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.redirect('/faculty/editFaculty');
        }
    });
}

module.exports.lockChoices = function(req,res){
    console.log(req.query.userId);
    let sql = 'UPDATE faculty SET choicesLocked = 1 WHERE id = ? ';
    Connection.query(sql,[req.query.userId],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    });
}

module.exports.students = function(req,res){
    if(req.isAuthenticated()){

        let sql = 'SELECT * FROM faculty WHERE email = ?';
        Connection.query(sql,[req.user.email],(err,rows,fields)=>{
            if(err){
                console.log('Error',err);
                return res.redirect('back');
            }
            else{
                let sql1 = 'SELECT * FROM courses WHERE id = ?';
                Connection.query(sql1,[rows[0].id],(err,rows,fields)=>{
                    if(err){
                        console.log('Error',err);
                        return res.redirect('back');
                    }
                    else{
                        var course=rows[0];
                        var semester = rows[0].semester;
                        let sql2 = 'SELECT * FROM students where semester = ? ';
                        Connection.query(sql2,[semester],(err,rows,fields)=>{
                            if(err){
                                console.log('Error',err);
                                return res.redirect('back');
                            }
                            else{
                                var result = rows;
                                console.log(result);
                                let sql3 = 'SELECT * FROM CourseGrades WHERE Course_Id = ?';
                                Connection.query(sql3,[course.id],(err,rows,fields)=>{
                                    if(err){
                                        console.log('Error',err);
                                        return res.redirect('back');
                                    }
                                    else{
                                        let students = [];
                                        console.log(rows);
                                        for(r of result){
                                            let check=0;
                                            for(c of rows){
                                                if(r.id==c.Student_Id){
                                                    check=1;
                                                }
                                            }
                                            if(check==0){
                                                students.push(r);
                                            }
                                        }
                                        return res.render('facultyStudents',{
                                            students:students,
                                            course:course
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else{
        return res.render('facultyStudents',{
            students:[],
            course:'',
            courses:[]
        });
    }
}

module.exports.assignGrades = function(req,res){
    var courseId = req.query.courseId;
    let email = req.query.email;
    let sql = 'SELECT * FROM users WHERE email = ?';
    Connection.query(sql,[email],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
            let studentId = rows[0].id;
            return res.render('assignGrades',{
                studentId:studentId,
                courseId:courseId
            });
        }
    });
}

module.exports.enterGrades = function(req,res){
    let courseId = parseInt(req.body.course);
    let studentId = parseInt(req.body.student);
    let grade = req.body.grade;
    let sql = 'INSERT INTO CourseGrades VALUES (?,?,?)';
    Connection.query(sql,[courseId,studentId,grade],(err,rows,fields)=>{
        if(err){
            console.log('Error',err);
            return res.redirect('back');
        }
        else{
             return res.redirect('/faculty/students');
        }
    });
}