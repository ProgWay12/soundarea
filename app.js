const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
var session = require('express-session');
const hbs = require('hbs')
const expressHbs = require("express-handlebars");
const multer  = require("multer");
const app = express();
const fs = require("fs");
const getMP3Duration = require('get-mp3-duration');

const jsonParser = express.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "audio/mpeg"){
            cb(null, 'static/audio/')
        } else if (file.mimetype === "image/png" || 
            file.mimetype === "image/jpg"|| 
            file.mimetype === "image/jpeg") {
                cb(null, 'static/img/')
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg" ||
    file.mimetype === "audio/mpeg"){
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

app.use(multer({ storage: storage, fileFilter: fileFilter }).fields([{
    name : "audio",
    maxCount: 100
}, {
    name: "photo",
    maxCount: 1
}]));

const PORT = process.env.PORT || 5000
app.set('port', PORT);

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
app.set("view engine", "hbs");

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use('/static', express.static(__dirname + '/static'));

const pool = mysql.createPool({
    host: "remotemysql.com",
    port: 3306,
    user: "7TZ0WshgWZ",
    password: "EABZzQfuZQ",
    database: "7TZ0WshgWZ"
});

app.get("/", (req, res) => {
    if (req.session.loggedin) {
        pool.query("SELECT * FROM audios ORDER BY id ASC, listenings DESC LIMIT 10", (err, results) => {
            if (err) {
                console.log(err)
            }
            else {
                pool.query("select * from playlists order by id desc limit 4", (err1, results1) => {
                    if (err1) {
                        console.log(err)
                    }
                    else {
                        res.render("main.hbs", {
                            user: req.session.username,
                            userid: req.session.userid,
                            useravatar: req.session.avatar,
                            audios: results,
                            playlists: results1,
                            ismedia: false
                        })
                    }
                })
            }
        })
    } else {
        res.redirect("/welcome")
    }
})

app.get("/allalbums", (req, res) => {
    pool.query("select * from playlists order by id desc limit 50", (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(502)
        } else {
            res.render("allalbums.hbs", {
                user: req.session.username,
                userid: req.session.userid,
                useravatar: req.session.avatar,
                playlists: results,
                ismedia: false
            })
        }
    })
})

app.get("/welcome", (req, res) => {
    pool.query("SELECT * FROM audios ORDER BY id ASC, listenings DESC LIMIT 10", (err, results) => {
            if (err) {
                console.log(err)
            }
            else {
                pool.query("select * from playlists order by id asc limit 4", (err1, results1) => {
                    if (err1) {
                        console.log(err)
                    }
                    else {
                        res.render("main.hbs", {
                            layout: 'nonlogin',
                            user: req.session.username,
                            userid: req.session.userid,
                            audios: results,
                            playlists: results1,
                            ismedia: false
                        })
                    }
                })
            }
        })
})

app.get("/register", (req, res) => {
    res.render("register.hbs", {layout: 'empty'})
})

app.post("/register", (req, res) => {
    const login = req.body.username;
    const password = req.body.password;
    const avatar = req.files["photo"][0];
    pool.query('insert into users (avatar, login, pass, media, albums, playlists) values (?, ?, ?, ?, ?, ?)', [avatar.path, login, password, "", "", ""], (err, results) => {
        if (err)
            console.log(err)
        res.redirect("/")
    })
})

app.get('/login', (req, res) => {
    res.render("login.hbs", {layout: 'empty'})
})
  
app.post("/login", (req, res) => {
    var username = req.body.username;
	var password = req.body.password; 
	if (username && password) {
		pool.query('SELECT * FROM users WHERE login = ?', [username], function(error, results, fields) {
			if (password == results[0].pass) {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.userid = results[0].id;
                req.session.avatar = results[0].avatar;
				res.redirect('/');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

app.get("/logout", (req, res) => {
    if (req.session.loggedin) {
        res.render("logout.hbs", {
            layout: "empty.hbs"
        })
    }
})

app.post("/logout", (req, res) => {
    req.session.loggedin = false;
	res.redirect('/');
})

app.get("/user_creativity", (req, res) => {
    if (req.session.loggedin) {
        var isnotemptyaudios = false;
        var isnotemptyplaylists = false;
        pool.query("SELECT * FROM audios WHERE author_id = ? ORDER BY id ASC", [req.session.userid], (err, results) => {
            if (err) {
                console.log(err)
            }
            else {
                pool.query("SELECT * FROM playlists WHERE author_id = ? ORDER BY id ASC", [req.session.userid], (err1, results1) => {
                    if (err1) {
                        console.log(err)
                    }
                    else {
                        if (results.length != 0) {
                            isnotemptyaudios = true
                        }
                        if (results1.length != 0) {
                            isnotemptyplaylists = true
                        }
                        res.render("user_creativity.hbs", {
                            user: req.session.username,
                            userid: req.session.userid,
                            useravatar: req.session.avatar,
                            audios: results,
                            playlists: results1,
                            ismedia: false,
                            isnotemptyaudios: isnotemptyaudios,
                            isnotemptyplaylists: isnotemptyplaylists
                        })
                    }
                })
            }
        })
    }
})

app.get("/newaudio", (req, res) => {
    if (req.session.loggedin) {
        res.render("newaudio.hbs", {layout: "empty.hbs"})
    } else {
        res.redirect("/welcome")
    }
})

app.post("/newaudio", (req, res) => {
    let audiofile = req.files["audio"][0];
    let photofile = req.files["photo"][0];
    var audio = String(Math.floor(getMP3Duration(fs.readFileSync(audiofile.path)) / 60000)) + ":" + String((getMP3Duration(fs.readFileSync(audiofile.path)) % 60000)).slice(0, 2);
    let singer = req.body.singer;
    let audioname = req.body.name;

    pool.query("insert into audios (author_id ,audioname, singet, length, photopath, audiopath, listenings) values (?, ?, ?, ?, ?, ?, ?)", [req.session.userid, audioname, singer, audio, photofile.path, audiofile.path, 0], function(err, results, fields) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    })
})

app.get("/newplaylist", (req, res) => {
    if (req.session.loggedin) {
        res.render("newplaylist.hbs", {layout: "empty.hbs"})
    } else {
        res.redirect("/welcome")
    }
})

app.post("/newplaylistdowload", (req, res) => {
    res.redirect("/")
})

app.post("/newplaylist", jsonParser, (req, res) => {
    var audioids = []
    var singer = req.body.singer;
    let photofile = 'static/img/' + req.body.photopath;
    var playlistname = req.body.playlistname
    pool.query("insert into playlists (author_id ,playlistname, author, photopath, audios) values (?, ?, ?, ?, ?)", [req.session.userid ,playlistname, singer, photofile, ""], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        } else {
            var playlistid = results.insertId
            for(var i = 0; i <= req.body.audionames.length - 1; i++) {
                var audioname = req.body.audionames[i]
                var audiopath = 'static/audio/' + req.body.audiofiles[i];
                var audio = String(Math.floor(getMP3Duration(fs.readFileSync(audiopath)) / 60000)) + ":" + String((getMP3Duration(fs.readFileSync(audiopath)) % 60000)).slice(0, 2);
                pool.query("insert into audios (author_id ,audioname, singet, length, photopath, audiopath, listenings) values (?, ?, ?, ?, ?, ?, ?)", [req.session.userid ,audioname, singer, audio, photofile, audiopath, 0], function(err, results, fields) {
                    if (err) {
                        console.log(err)
                        res.sendStatus(400)
                    } else {
                        audioids.push(String(results.insertId))
                        if (typeof(req.body.audionames[i + 1]) == "undefined" ) {
                            var audios = ""
                            audioids.forEach((elem, i) => {
                                if (typeof(audioids[i + 1]) != "undefined") {
                                    audios += elem + "|"
                                } else {
                                    audios += elem
                                }
                            })
                            pool.query("update playlists set audios = ? where id = ?", [audios, playlistid], (err, results) => {
                                if (err) {
                                    console.log(err)
                                    res.sendStatus(400)
                                }
                            })
                        }
                    }
                    
                })
            }
        }
    })
})

app.get("/media", (req, res) => {
    if (req.session.loggedin) {
        var media = [];
        pool.query('select * from users where id = ?', [req.session.userid], (err, results) => {
            if (err)
                console.log(err)
            if (results[0].media.length != 0) {
                results[0].media.split("|").forEach(function (item, i) {
                    pool.query('select * from audios where id = ?', [item], (err1, results1) => {
                        if (err1)
                            console.log(err1)
                        else {
                            if (typeof(results1[0]) != "undefined") {
                                media.push({
                                    id: parseInt(item),
                                    audioname: results1[0].audioname,
                                    singet: results1[0].singet,
                                    photopath: results1[0].photopath,
                                    audiopath: results1[0].audiopath
                                })
                                if (typeof(results[0].media.split("|")[i + 1]) == "undefined"){
                                    res.render("usermedia.hbs", {
                                        isempty: false,
                                        user: req.session.username,
                                        userid: req.session.userid,
                                        useravatar: req.session.avatar,
                                        audios: media
                                    })
                                }
                            }
                        }
                    })  
                })
            } else {
                res.render("usermedia.hbs", {
                    user: req.session.username,
                    userid: req.session.userid,
                    useravatar: req.session.avatar,
                    isempty: true
                })
            }
        })
    } else {
        res.redirect("/welcome")
    }
})

app.get("/user_playlists", (req, res) => {
    if (req.session.loggedin){
        var playlists = []
        pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
                if (results[0].playlists.length != 0) {
                    results[0].playlists.split("|").forEach(function (item, i) {
                        pool.query('select * from user_playlists where id = ?', [item], (err1, results1) => {
                            if (err1)
                                console.log(err1)
                            else {
                                if (typeof(results1[0]) != "undefined") {
                                    playlists.push({
                                        id: results1[0].id,
                                        playlistname: results1[0].playlistname,
                                        photopath: results1[0].photopath
                                    })
                                    if (typeof(results[0].playlists.split("|")[i + 1]) == "undefined"){
                                        res.render("user_playlists.hbs", {
                                            user: req.session.username,
                                            userid: req.session.userid,
                                            useravatar: req.session.avatar,
                                            playlists: playlists,
                                            isempty: false,
                                            ismedia: true
                                        })
                                    }
                                }
                            }
                        })  
                    })
                } else {
                    res.render("user_playlists.hbs", {
                        user: req.session.username,
                        userid: req.session.userid,
                        useravatar: req.session.avatar,
                        isempty: true,
                        ismedia: true
                    })
                }
        })
    } else {
        res.redirect("/welcome")
    }
    
})

app.post("/new_user_playlist", (req, res) => {
    var playlistname = req.body.playlistname;
    var photopath = req.files["photo"][0];
    pool.query("insert into user_playlists (playlistname, photopath, audios) values (?, ?, ?)", [playlistname, photopath.path, ""], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            var playlistid = results.insertId;
            pool.query("SELECT * FROM `users` WHERE id = ?", [req.session.userid], (err1, results1) => {
                if (err1) {
                    console.log(err1)
                    res.sendStatus(400)
                } else {
                    if (results1[0].playlists.length != 0) {
                        var newplaylists = results1[0].playlists + "|" + String(playlistid)
                    } else {
                        var newplaylists = String(playlistid)
                    }
                    pool.query("update users set playlists = ? where id = ?", [newplaylists, req.session.userid], (err2, results2) => {
                        if (err2) {
                            console.log(err2)
                            res.sendStatus(400)
                        } else {
                            res.redirect("/user_playlists")
                        }
                    })
                }
            })
        }
    })
})

app.post("/counting", jsonParser, (req, res) => {
    if (parseInt(req.body.count) == 1){
        var nowlistenings = 0;
        pool.query("select * from audios where id = ?", [req.body.id], (err, results) => {
            if (err)
                console.log(err);
            nowlistenings = parseInt(results[0].listenings) + 1
            pool.query("update audios set listenings = ? where id = ?", [nowlistenings, req.body.id], (err, results) => {
                if (err)
                    console.log(err);
            })
        })
    }
})

app.post("/addalbuminmedia", jsonParser, (req, res) => {
    var nowalbums;
    var errorvar = false;
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err)
            console.log(err)

        results[0].albums.split("|").forEach(function(item) {
            if (item == String(req.body.id)){
                errorvar = true
            }
        })
        if (errorvar) {
            res.json({
                isinmedia: errorvar
            })
        } else {
            if (results[0].albums.length != 0) {
                nowalbums = results[0].albums + "|" + String(req.body.id);
                pool.query("update users set albums = ? where id = ?", [nowalbums, req.session.userid], (err1, results1) => {
                    if (err1)
                        console.log(err1)
                })
            } else {
                nowalbums = String(req.body.id);
                pool.query("update users set albums = ? where id = ?", [nowalbums, req.session.userid], (err1, results1) => {
                    if (err1)
                        console.log(err1)
                })
            }
            
        }
    })
})

app.get("/albumsmedia", (req, res) => {
    if (req.session.loggedin){
        var albums_in_media = [];
        pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
            if (err) {
                res.sendStatus(400)
                console.log(err)
            } else {
                if (results[0].albums.length != 0) {
                    results[0].albums.split("|").forEach((elem, i) => {
                        pool.query("select * from playlists where id = ?", [elem], (err1, results1) => {
                            if (err1) {
                                console.log(err1)
                                res.sendStatus(400)
                            } else if (typeof(results1[0]) != "undefined") {
                                albums_in_media.push({
                                    id: results1[0].id,
                                    photopath: results1[0].photopath,
                                    playlistname: results1[0].playlistname,
                                    author: results1[0].author
                                })
                                if (typeof(results[0].albums.split("|")[i + 1]) == "undefined") {
                                    res.render("user_media_albums.hbs", {
                                        user: req.session.username,
                                        userid: req.session.userid,
                                        useravatar: req.session.avatar,
                                        albums: albums_in_media,
                                        ismedia: true,
                                        isempty: false
                                    })
                                }
                            }
                        })
                    })
                } else {
                    res.render("user_media_albums.hbs", {
                        user: req.session.username,
                        userid: req.session.userid,
                        useravatar: req.session.avatar,
                        albums: albums_in_media,
                        ismedia: true,
                        isempty: true
                    })
                }
            }
        })
    } else {
        res.redirect("/welcome")
    }
    
})

app.post("/addinmedia", jsonParser, (req, res) => {
    var nowmedia;
    var errorvar = false;
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err)
            console.log(err)

        results[0].albums.split("|").forEach(function(item) {
            if (item == String(req.body.id)){
                errorvar = true
            }
        })
        if (errorvar) {
            res.json({
                isinmedia: errorvar
            })
        } else {
            if (results[0].media.length != 0) {
                nowmedia = results[0].media + "|" + String(req.body.id);
                pool.query("update users set media = ? where id = ?", [nowmedia, req.session.userid], (err1, results1) => {
                    if (err1)
                        console.log(err1)
                })
            } else {
                nowmedia = String(req.body.id);
                pool.query("update users set media = ? where id = ?", [nowmedia, req.session.userid], (err1, results1) => {
                    if (err1)
                        console.log(err1)
                })
            }
            
        }
    })
})

app.post("/add_audio_in_playlist", jsonParser, (req, res) => {
    var nowmedia;
    var error = false;
    pool.query("select * from user_playlists where id =?", [req.body.playlist_id], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        } else {
            results[0].audios.split("|").forEach((elem) => {
                if (elem == req.body.audio_id) {
                    error = true
                }
            })
            if (error) {
                res.json({
                    isinplaylist: true
                })
            } else {
                if (results[0].audios.length != 0) {
                    nowmedia = results[0].audios + "|" + req.body.audio_id
                    pool.query("update user_playlists set audios = ? where id = ?", [nowmedia, req.body.playlist_id], (err1, results1) => {
                        if (err1) {
                            console.log(err1)
                            res.sendStatus(400)
                        } else {
                            res.json({
                                isadded: true
                            })
                        }
                    })
                } else {
                    pool.query("update user_playlists set audios = ? where id = ?", [req.body.audio_id, req.body.playlist_id], (err1, results1) => {
                        if (err1) {
                            console.log(err1)
                            res.sendStatus(400)
                        } else {
                            res.json({
                                isadded: true
                            })
                        }
                    })
                }
            }
        }
    })
})

app.post("/deletefrommedia", jsonParser, (req, res) => {
    var nowmedia = "";
    var without = "";
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err)
            console.log(err)
        results[0].media.split("|").forEach(function(item, i) {
            if (item != String(req.body.id)){
                if (typeof(results[0].media.split("|")[i + 1]) != "undefined" && results[0].media.split("|")[i + 1] != String(req.body.id)) {
                    nowmedia += item + "|"
                } else {
                    nowmedia += item
                }
            }
        })
        pool.query("update users set media = ? where id = ?", [nowmedia, req.session.userid], (err1, results1) => {
            if (err1)
                console.log(err1)
            else {
                res.json({
                    deleted: true
                })
            }
        })
    })
})

app.post("/getplaylistaudios", jsonParser, (req, res) => {
    var audios = []
    pool.query("select * from playlists where id = ?", [req.body.id], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        }
        results[0].audios.split("|").forEach(function (elem, i) {
            pool.query("select * from audios where id = ?", [elem], (err1, results1) => {
                if (err1) {
                    console.log(err1)
                    res.sendStatus(400)
                } else {
                    if (typeof(results1[0]) != "undefined") {
                        audios.push({
                            id: results1[0].id,
                            audioname: results1[0].audioname,
                            singet: results1[0].singet,
                            audiopath: results1[0].audiopath,
                            length: results1[0].length
                        })
                        if (typeof(results[0].audios.split("|")[i + 1]) == "undefined") {
                            res.json({
                                audios: audios,
                                playlistphoto: results[0].photopath,
                                playlistname: results[0].playlistname,
                                playlistauthor: results[0].author
                            })
                        }
                    }  
                }
            })
        })
    })
})

app.post("/getuserplaylistsaudios", jsonParser, (req, res) => {
    var audios = []
    pool.query("select * from user_playlists where id = ?", [req.body.id], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        }
        results[0].audios.split("|").forEach(function (elem, i) {
            pool.query("select * from audios where id = ?", [elem], (err1, results1) => {
                if (err1) {
                    console.log(err1)
                    res.sendStatus(400)
                } else {
                    if (typeof(results1[0]) != "undefined") {
                        audios.push({
                            id: results1[0].id,
                            audioname: results1[0].audioname,
                            singet: results1[0].singet,
                            audiopath: results1[0].audiopath
                        })
                        if (typeof(results[0].audios.split("|")[i + 1]) == "undefined") {
                            res.json({
                                audios: audios,
                                playlistphoto: results[0].photopath,
                                playlistname: results[0].playlistname,
                                playlistauthor: results[0].author
                            })
                        }
                    } else {
                        res.json({
                            audios: audios,
                            playlistphoto: results[0].photopath,
                            playlistname: results[0].playlistname,
                            playlistauthor: results[0].author
                        })
                    } 
                }
            })
        })
    })
})

app.post("/getuserplaylists", jsonParser, (req, res) => {
    var playlists = []
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        } else {
            if (results[0].playlists.length != 0) {
                results[0].playlists.split("|").forEach((elem, i) => {
                    if (typeof(elem) != "undefined") {
                        pool.query("select * from user_playlists where id = ?", [elem], (err1, results1) => {
                            if (err1) {
                                console.log(err1)
                                res.sendStatus(400)
                            } else {
                                if (typeof(results1[0]) != "undefined") {
                                    playlists.push({
                                        id: results1[0].id,
                                        photopath: results1[0].photopath,
                                        playlistname: results1[0].playlistname
                                    })
                                    if (typeof(results[0].playlists.split("|")[i + 1]) == "undefined") {
                                        res.json({
                                            playlists: playlists,
                                            isempty: false
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            } else {
                res.json({
                    isempty: true
                })
            }
        }
    })
})

app.post("/search", jsonParser, (req, res) =>{
    var name = req.body.name;
    var playlists = []
    var audios = []
    pool.query("select * from playlists where playlistname = ?", [name], (err, results) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        } else {
            for (var i = 0; i <= results.length; i++) {
                if (typeof(results[i]) != "undefined") {
                    playlists.push({
                        id : results[i].id,
                        playlistname: results[i].playlistname,
                        author: results[i].author,
                        photopath: results[i].photopath
                    })
                } else if (typeof(results[i]) == "undefined") {
                    pool.query("select * from audios where audioname = ?", [name], (err1, results1) => {
                        if (err1) {
                            console.log(err1)
                            res.sendStatus(400)
                        } else {
                            for (var i = 0; i <= results1.length; i++) {
                                if (typeof(results1[i]) != "undefined") {
                                    audios.push({
                                        id : results1[i].id,
                                        audioname: results1[i].audioname,
                                        singet: results1[i].singet,
                                        photopath: results1[i].photopath,
                                        audiopath: results1[i].audiopath
                                    })
                                } else if (typeof(results1[i]) == "undefined") {
                                    console.log("qq")
                                    res.json({
                                        playlists: playlists,
                                        audios: audios
                                    })
                                }
                            }
                        }
                    })
                }
            }
        }
    })
})

app.post("/delete_playlist_from_media", jsonParser, (req, res) => {
    var nowmedia = "";
    var without = "";
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err)
            console.log(err)
        results[0].playlists.split("|").forEach(function(item, i) {
            if (item != String(req.body.id)){
                if (typeof(results[0].playlists.split("|")[i + 1]) != "undefined" && results[0].playlists.split("|")[i + 1] != String(req.body.id)) {
                    nowmedia += item + "|"
                } else {
                    nowmedia += item
                }
            }
        })
        pool.query("update users set playlists = ? where id = ?", [nowmedia, req.session.userid], (err1, results1) => {
            if (err1)
                console.log(err1)
            else {
                res.json({
                    deleted: true
                })
            }
        })
    })
})

app.post("/delete_album_from_media", jsonParser, (req, res) => {
    var nowmedia = "";
    var without = "";
    pool.query("select * from users where id = ?", [req.session.userid], (err, results) => {
        if (err)
            console.log(err)
        results[0].albums.split("|").forEach(function(item, i) {
            if (item != String(req.body.id)){
                if (typeof(results[0].albums.split("|")[i + 1]) != "undefined" && results[0].albums.split("|")[i + 1] != String(req.body.id)) {
                    nowmedia += item + "|"
                } else {
                    nowmedia += item
                }
            }
        })
        pool.query("update users set albums = ? where id = ?", [nowmedia, req.session.userid], (err1, results1) => {
            if (err1)
                console.log(err1)
            else {
                res.json({
                    deleted: true
                })
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(PORT)
})