//* dropdown menu
function dropdown(item) {
  var dropdown = document.getElementsByClassName("dropdown-content")[0];
  if (dropdown.style.display != "block") {
    dropdown.style.display = "block"
    item.src = "/static/img/top.svg"
  } else {
    dropdown.style.display = "none"
    item.src = "/static/img/down.svg"
  }
}

//* visibility of playlist modal page
var modal = document.getElementsByClassName("modal")[0]
var modal_audios = document.getElementsByClassName("audios")[0]
var modal_playlist_img = document.getElementById("playlist-img")
var modal_playlist_name = document.getElementById("playlist-name")
var modal_playlist_author = document.getElementById("playlist-author")

document.querySelectorAll(".onealbum").forEach(function(item) {
  item.addEventListener("click", function() {
    modal_audios.innerHTML = ``
    var album_id = this.id
    let info = JSON.stringify({
      id: this.id
    })
    let req = new XMLHttpRequest();
    req.open("POST", "/getplaylistaudios", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
       let parseinfo = JSON.parse(req.response);
       modal.firstElementChild.id = album_id
       modal_playlist_img.src = parseinfo.playlistphoto
       modal_playlist_name.innerText = parseinfo.playlistname
       modal_playlist_author.innerText = parseinfo.playlistauthor
       parseinfo.audios.forEach((elem) => {
        var divblock = document.createElement("div")
        divblock.classList = "modal-oneaudio"
        divblock.id = elem.id
        divblock.addEventListener("mouseover", () => {
          actionshow(divblock);
        })
        divblock.addEventListener("mouseout", () => {
          actionhide(divblock);
        })
        divblock.innerHTML = `
          <audio src="${elem.audiopath}" ></audio>
          <div class="modal-audioimg" onclick="playpause(this)">
            <img src="/static/img/play.svg" alt="">
          </div>
          <div class="modal-audioinfo">
            <div class="modal-namesinder">
                <span class="modal-auidoname">${elem.audioname}</span><span class="space"> - </span><span class="modal-singer">${elem.singet}</span>
            </div>
            <div class="modal-oneaudio-addinmedia" onclick = "addinmedia(this)">
                <img src="/static/img/add.svg" alt="">
            </div>
            <div class="modal-length">
                <p>${elem.length}</p>
            </div>
          </div>
        `
        if (modal_audios.innerHTML.length > 0){
          modal_audios.insertBefore(divblock, modal_audios.lastElementChild.nextSibling)
        } else {
          modal_audios.appendChild(divblock)
        }
       })
    });
    req.send(info);
    modal.style.display = "block"
  })
})

document.querySelectorAll(".media_onealbum").forEach(function(item) {
  item.addEventListener("click", function() {
    modal_audios.innerHTML = ``
    var album_id = this.id
    let info = JSON.stringify({
      id: this.id
    })
    let req = new XMLHttpRequest();
    req.open("POST", "/getplaylistaudios", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
       let parseinfo = JSON.parse(req.response);
       modal.firstElementChild.id = album_id
       modal_playlist_img.src = parseinfo.playlistphoto
       modal_playlist_name.innerText = parseinfo.playlistname
       modal_playlist_author.innerText = parseinfo.playlistauthor
       parseinfo.audios.forEach((elem) => {
        var divblock = document.createElement("div")
        divblock.classList = "modal-oneaudio"
        divblock.id = elem.id
        divblock.addEventListener("mouseover", () => {
          actionshow(divblock);
        })
        divblock.addEventListener("mouseout", () => {
          actionhide(divblock);
        })
        divblock.innerHTML = `
          <audio src="${elem.audiopath}" ></audio>
          <div class="modal-audioimg" onclick="playpause(this)">
            <img src="/static/img/play.svg" alt="">
          </div>
          <div class="modal-audioinfo">
            <div class="modal-namesinder">
                <span class="modal-auidoname">${elem.audioname}</span><span class="space"> - </span><span class="modal-singer">${elem.singet}</span>
            </div>
            <div class="modal-oneaudio-addinmedia" onclick = "addinmedia(this)">
                <img src="/static/img/add.svg" alt="">
            </div>
            <div class="modal-length">
                <p>${elem.length}</p>
            </div>
          </div>
        `
        if (modal_audios.innerHTML.length > 0){
          modal_audios.insertBefore(divblock, modal_audios.lastElementChild.nextSibling)
        } else {
          modal_audios.appendChild(divblock)
        }
       })
    });
    req.send(info);
    modal.style.display = "block"
  })
})

document.querySelectorAll(".media_one_useralbum").forEach(function(item) {
  item.addEventListener("click", function() {
    modal_audios.innerHTML = ``
    var album_id = this.id
    let info = JSON.stringify({
      id: this.id
    })
    let req = new XMLHttpRequest();
    req.open("POST", "/getuserplaylistsaudios", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
       let parseinfo = JSON.parse(req.response);
       modal.firstElementChild.id = album_id
       modal_playlist_img.src = parseinfo.playlistphoto
       modal_playlist_name.innerText = parseinfo.playlistname
       modal_playlist_author.innerText = ""
       parseinfo.audios.forEach((elem) => {
        var divblock = document.createElement("div")
        divblock.classList = "modal-oneaudio"
        divblock.id = elem.id
        divblock.addEventListener("mouseover", () => {
          actionshow(divblock);
        })
        divblock.addEventListener("mouseout", () => {
          actionhide(divblock);
        })
        divblock.innerHTML = `
          <audio src="${elem.audiopath}" ></audio>
          <div class="modal-audioimg" onclick="playpause(this)">
            <img src="/static/img/play.svg" alt="">
          </div>
          <div class="modal-audioinfo">
            <div class="modal-namesinder">
                <span class="modal-auidoname">${elem.audioname}</span><span class="space"> - </span><span class="modal-singer">${elem.singet}</span>
            </div>
            <div class="modal-oneaudio-addinmedia" onclick = "addinmedia(this)">
                <img src="/static/img/add.svg" alt="">
            </div>
            <div class="modal-length">
                <p>${elem.length}</p>
            </div>
          </div>
        `
        if (modal_audios.innerHTML.length > 0){
          modal_audios.insertBefore(divblock, modal_audios.lastElementChild.nextSibling)
        } else {
          modal_audios.appendChild(divblock)
        }
       })
    });
    req.send(info);
    modal.style.display = "block"
  })
})

var modal_add_in_playlist = document.getElementsByClassName("modal_add_in_playlist")[0]
var modal_add_in_playlist_useralbums = document.getElementsByClassName("modal_add_in_playlist_useralbums")[0]
document.querySelectorAll(".addinplaylist").forEach(function(item) {
  item.addEventListener("click", function() {
    modal_add_in_playlist.id = this.parentNode.parentNode.id
    modal_add_in_playlist_useralbums.innerHTML = ""
    let req = new XMLHttpRequest();
    req.open("POST", "/getuserplaylists", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
       let parseinfo = JSON.parse(req.response);
       if (!parseinfo.isempty) {
        parseinfo.playlists.forEach((elem, i) => {
          var divblock = document.createElement("div")
          divblock.classList = "media_one_useralbum"
          divblock.id = elem.id
          divblock.addEventListener("click", () => {
            add_audio_in_playlist(divblock)
          })
          divblock.innerHTML = `
            <img src="${elem.photopath}" alt="">
            <p class="onealbum_author">${elem.playlistname}</p>
          `
          if (modal_add_in_playlist_useralbums.innerHTML.length > 0){
            modal_add_in_playlist_useralbums.insertBefore(divblock, modal_add_in_playlist_useralbums.lastElementChild.nextSibling)
          } else {
            modal_add_in_playlist_useralbums.appendChild(divblock)
          }

          if (typeof(parseinfo.playlists[i + 1]) == "undefined") {
            var divblock = document.createElement("div")
            divblock.classList = "media_one_useralbum_add"
            divblock.id = elem.id
            divblock.addEventListener("click", () => {
              visibility_modal_of_adding_playlist()
            })
            divblock.innerHTML = `
              <img src="/static/img/newplaylist.svg" alt="">
              <p class="onealbum_author">Добавить</p>
            `
            modal_add_in_playlist_useralbums.insertBefore(divblock, modal_add_in_playlist_useralbums.lastElementChild.nextSibling)
          }
         })
       }
    });
    req.send();
    modal_add_in_playlist.style.display = "block"
  })
})

window.addEventListener("click", function(event) {
  if (event.target == document.getElementsByClassName("modal")[0]){
    modal.style.display = "none"
  } else if (event.target == document.getElementsByClassName("modal_create_playlist")[0]) {
    document.getElementsByClassName("modal_create_playlist")[0].style.display = "none"
  } else if (event.target == document.getElementsByClassName("modal_add_in_playlist")[0]) {
    document.getElementsByClassName("modal_add_in_playlist")[0].style.display = "none"
  }
})

//* chose the playlist for adding audio
function add_audio_in_playlist(item) {
  let info = JSON.stringify({
    playlist_id: item.id,
    audio_id: item.parentNode.parentNode.parentNode.parentNode.id
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/add_audio_in_playlist", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    let parseinfo = JSON.parse(req.response);
    if (parseinfo.isinplaylist) {
      alert("Эта аудио запись уже есть в плейлисте")
    } else if (parseinfo.isadded) {
      alert("Запись успешно добавлена в плейлист")
    }
  });
  req.send(info);
}

//* nextaudio 
function nextaudio () {
  var footerplayer = document.getElementsByClassName("playerinfo")[0].getElementsByTagName("audio")[0]
  var footerimg = document.getElementsByClassName("playerimg")[0].getElementsByTagName("img")[0]
  var footeraudioname = document.getElementsByClassName("playerauidoname")[0]
  var footersinger = document.getElementsByClassName("playersinger")[0]
  var nextaudio = nextones(nowplaing.parentNode.children, nowplaing)

  if (nextaudio.classList == "modal-oneaudio"){
    footerplayer.src = nextaudio.firstElementChild.src
    footerimg.src = nextaudio.parentNode.parentNode.previousElementSibling.firstElementChild.getElementsByTagName("img")[0].src
    footeraudioname.innerHTML = nextaudio.firstElementChild.nextElementSibling.nextElementSibling.getElementsByClassName("modal-namesinder")[0].getElementsByClassName("modal-auidoname")[0].innerHTML
    footersinger.innerHTML = nextaudio.firstElementChild.nextElementSibling.nextElementSibling.getElementsByClassName("modal-namesinder")[0].getElementsByClassName("modal-singer")[0].innerHTML

    nextaudio.firstElementChild.nextElementSibling.getElementsByTagName("img")[0].src = "/static/img/pause.svg"

    footerplayer.play();
  } else if (nextaudio.classList == "oneaudio") {
    footerplayer.src = nextaudio.firstElementChild.src
    footerimg.src = nextaudio.children[1].firstElementChild.src
    footeraudioname.innerHTML = nextaudio.children[2].firstElementChild.firstElementChild.innerHTML
    footersinger.innerHTML = nextaudio.children[2].firstElementChild.children[1].innerHTML

    nextaudio.children[1].children[1].firstElementChild.src = "/static/img/pause.svg"

    footerplayer.play();
  }
}

//* creating turn of playing audios
function nextones(arrofudios, nowplaing) {
  for(var i = 0; i < arrofudios.length; i++){
    if (arrofudios[i] == nowplaing) {
      return arrofudios[i + 1]
    }
  }
}

//* adding new audio form
document.getElementById("playlist-newaudio-btn").addEventListener("click", function () {

  //* count of audiopaths in newplaylist form
  var countof = document.getElementsByClassName("playlist-oneaudio-add").length

  var allaudiosadding = document.getElementById("playlist-addaudio-all")
  var divblock = document.createElement("div")
  divblock.classList = "playlist-oneaudio-add"
  divblock.innerHTML = `
                          <input type="text" name="audioname0" id="" placeholder="Название трека"> <br><br>
                          <div class="photo_and_audio_for_playlist" onclick="newphoto(this)">
                              <div class="mainform_new_avatar">
                                  <img src="/static/img/audio.svg" alt="">
                              </div>
                              <div class="photo_and_audio_info">
                                  <p>Add cover</p>
                              </div>
                          </div>
                          <input type="file" name="audio" />
                        `
  allaudiosadding.insertBefore(divblock, allaudiosadding.lastElementChild.nextSibling)
})

//* post of audiofilds names
document.getElementById("newplaylistsubmit").addEventListener("click", function () {
  var audionames = [];
  var audiofiles = [];
  var photopath;
  var singer;
  var playlistname;
  
  photopath = document.getElementById("preview").files[0].name
  singer = document.getElementById("singer").value
  playlistname = document.getElementById("playlistname").value


  document.querySelectorAll(".playlist-oneaudio-add").forEach(function (item) {
    audionames.push(item.querySelectorAll("input[type='text']")[0].value)
    audiofiles.push(item.querySelectorAll("input[type='file']")[0].files[0].name)
  })

  let info = JSON.stringify({
    audionames: audionames,
    audiofiles: audiofiles,
    photopath: photopath,
    singer: singer,
    playlistname: playlistname
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/newplaylist", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.send(info);
})

var nowplaing

//* play/pause
function playpause(item) {

  if (document.getElementsByTagName("footer")[0].style.display != "block") {
    document.getElementsByTagName("footer")[0].style.display = "block"
  }
  
  var footerplayer = document.getElementsByClassName("playerinfo")[0].getElementsByTagName("audio")[0]
  var footerimg = document.getElementsByClassName("playerimg")[0].getElementsByTagName("img")[0]
  var footeraudioname = document.getElementsByClassName("playerauidoname")[0]
  var footersinger = document.getElementsByClassName("playersinger")[0]
  
  var audio;
  var img;
  var audioname;
  var singer;
  var playorpause;

  if (item.parentNode.classList == "oneaudio") {
    audio = item.previousElementSibling
    img = item.getElementsByTagName("img")[0]
    audioname = item.nextElementSibling.children[0].children[0]
    singer = item.nextElementSibling.children[0].children[1]
    playorpause = item.children[1].children[0]
  } else if (item.parentNode.classList == "modal-oneaudio") {
    audio = item.previousElementSibling
    img = item.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.getElementsByTagName("img")[0]
    audioname = item.nextElementSibling.getElementsByClassName("modal-namesinder")[0].getElementsByClassName("modal-auidoname")[0]
    singer = item.nextElementSibling.getElementsByClassName("modal-namesinder")[0].getElementsByClassName("modal-singer")[0]
    playorpause = item.children[0]
  } else if (item.parentNode.classList == "oneaudioinmedia") {
    audio = item.previousElementSibling
    img = item.getElementsByTagName("img")[0]
    audioname = item.nextElementSibling.getElementsByClassName("namesinder")[0].getElementsByClassName("auidoname")[0]
    singer = item.nextElementSibling.getElementsByClassName("namesinder")[0].getElementsByClassName("singer")[0]
    playorpause = item.children[1].firstElementChild
  }

  if (audio.src != footerplayer.src) {
    let info = JSON.stringify({
      count: 1,
      id: item.parentNode.id
    })
    let req = new XMLHttpRequest();
    req.open("POST", "/counting", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.send(info);

    footerplayer.src = audio.src
    footerimg.src = img.src
    footeraudioname.innerHTML = audioname.innerHTML
    footersinger.innerHTML = singer.innerHTML

    playorpause.src = "/static/img/pause.svg"

    nowplaing = item.parentNode

    footerplayer.play();

  } else if (audio.src == footerplayer.src && !footerplayer.paused) {
    footerplayer.pause();
    playorpause.src = "/static/img/play.svg"
  } else if (audio.src == footerplayer.src && footerplayer.paused) {
    footerplayer.play();
    playorpause.src = "/static/img/pause.svg"
  }

  var pauseinterval = setInterval(function() {
    if (item.previousElementSibling.src != footerplayer.src && !footerplayer.paused) {
      playorpause.src = "/static/img/play.svg"
      clearInterval(pauseinterval)
    }
  }, 20)

}

//* visibility of plus/trushbox
function actionshow(item) {
  var plusortrush
  var add_in_playlist
  if (item.classList == "oneaudio") {
    plusortrush = item.children[2].children[2]
    add_in_playlist = item.children[2].children[1]
  } else if (item.classList == "modal-oneaudio") {
    plusortrush = item.children[2].children[1]
  } else if (item.classList == "oneaudioinmedia") {
    plusortrush = item.children[2].children[1]
  }
  item.addEventListener('mouseover', function() {
    plusortrush.style.opacity = 0.5;
    add_in_playlist.style.opacity = 0.5;
  })
}

function actionhide(item) {
  var plusortrush
  var add_in_playlist
  if (item.classList == "oneaudio") {
    plusortrush = item.children[2].children[2]
    add_in_playlist = item.children[2].children[1]
  } else if (item.classList == "modal-oneaudio") {
    plusortrush = item.children[2].children[1]
  } else if (item.classList == "oneaudioinmedia") {
    plusortrush = item.children[2].children[1]
  }
  item.addEventListener('mouseout', function() {
    plusortrush.style.opacity = 0;
    add_in_playlist.style.opacity = 0;
  })
}

//* adding in media
function addinmedia(item) {
  let info = JSON.stringify({
    id: item.parentNode.parentNode.id
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/addinmedia", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
     let parseinfo = JSON.parse(req.response);
     if (parseinfo.isinmedia) {
       alert("Эта аудиозапись уже есть в вашей медиатеке")
     }
  });
  req.send(info);
}

//* deleting from media
function delete_from_media(item) {
  let info = JSON.stringify({
    id: item.parentNode.parentNode.id
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/deletefrommedia", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
     let parseinfo = JSON.parse(req.response);
     if (parseinfo.deleted) {
       alert("Запись успешно удалена")
       window.location.reload()
     }
  });
  req.send(info);
}

//* search of audioss
function search() {
  var audionameforsearch = document.getElementById("searchinput").value
  let info = JSON.stringify({
    name: audionameforsearch
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/search", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
    var info = JSON.parse(req.response)
    var allplaylists = document.getElementsByClassName("albums")[0]
    var audios = document.getElementsByClassName("topaudio")[0]
    allplaylists.innerHTML = ""
    audios.innerHTML = ""
    if (info.playlists.length != 0) {
      for (var i = 0; i < info.playlists.length; i++) {
        var onealbum = document.createElement("div")
        onealbum.classList = "onealbum"
        onealbum.id = info.playlists[i].id
        onealbum.innerHTML = `
                                <img src="${info.playlists[i].photopath}" alt="">
                                <h3>${info.playlists[i].playlistname}</h3>
                                <h4>${info.playlists[i].author}</h4>
                              `
        onealbum.style.maxWidth = "236.15px"
        if (allplaylists.children.length != 0) {
          allplaylists.insertBefore(onealbum, allplaylists.lastElementChild.nextSibling)
        } else {
          allplaylists.appendChild(onealbum)
        }
      }
    } else if (info.playlists.length == 0) {
      allplaylists.innerHTML = "Ничего не найдено"
    } 
    if (info.audios.length != 0) {
      for (var i = 0; i < info.audios.length; i++) {
        var oneaudio = document.createElement("div")
        oneaudio.classList = "oneaudio"
        oneaudio.id = info.audios[i].id
        oneaudio.addEventListener("mouseover", () => {
          actionshow(oneaudio);
        })
        oneaudio.addEventListener("mouseout", () => {
          actionhide(oneaudio);
        })
        oneaudio.innerHTML = `
                                <audio src="${info.audios[i].audiopath}"></audio>
                                <div class="audioimg" onclick="playpause(this)">
                                    <img src="${info.audios[i].photopath}" alt="">
                                    <div class="overlay">
                                      <img src="/static/img/play.svg" alt="">
                                    </div>
                                </div>
                                <div class="audioinfo">
                                    <div class="namesinder">
                                        <p class="auidoname">${info.audios[i].audioname}</p>
                                        <p class="singer">${info.audios[i].singet}</p>
                                    </div>
                                    <div class="addinmedia" onclick="addinmedia(this)">
                                        <img src="/static/img/add.svg" alt="">
                                    </div>
                                    <div class="length">
                                        <p class="audiolength">3:29</p>
                                    </div>
                                </div>
                              `
        oneaudio.style.maxWidth = "483px"
        if (audios.children.length != 0) {
          audios.insertBefore(oneaudio, audios.lastElementChild.nextSibling)
        } else {
          audios.appendChild(oneaudio)
        }
      }
    } else if (info.audios.length == 0) {
      audios.innerHTML = "Ничего не найдено"
    }
  });
  req.send(info);
}

//* add albums in media
function add_album_in_media(item) {
  let info = JSON.stringify({
    id: item.parentNode.parentNode.parentNode.id
  })
  let req = new XMLHttpRequest();
  req.open("POST", "/addalbuminmedia", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
     let parseinfo = JSON.parse(req.response);
     if (parseinfo.isinmedia) {
       alert("Этот альбом уже есть в вашей медиатеке")
     }
  });
  req.send(info);
}

//* visibility 
function visibility_modal_of_adding_playlist () {
  document.getElementsByClassName("modal_create_playlist")[0].style.display = "block"
}

//* triger of input[type="file"] onclick img
function newphoto(item) {
  if (item.classList == "modal_create_playlist_body_avatar") {
    item.nextElementSibling.children[0].children[0].click();
  } else if (item.classList == "mainform_avatar") {
    item.nextElementSibling.children[0].click();
  } else if (item.classList == "photo_and_audio") {
    item.nextElementSibling.nextElementSibling.click();
  } else if (item.classList == "photo_and_audio_for_playlist") {
    item.nextElementSibling.click();
  }
}

function change(item) {
  if (item.parentNode.parentNode.classList == "modal_create_playlist_form") {
    item.parentNode.parentNode.previousElementSibling.children[0].src = "/static/img/ready.svg"
  } else if (item.parentNode.parentNode.classList == "mainform_body") {
    item.parentNode.previousElementSibling.children[0].src = "/static/img/ready.svg"
  } else if (item.id == "newaudio") {
    item.previousElementSibling.previousElementSibling.children[0].children[0].src = "/static/img/ready.svg"
  } else if (item.id == "newplaylist" || item.id == "preview") {
    item.previousElementSibling.children[0].children[0].src = "/static/img/ready.svg"
  }
}

//* deleting playlist from media
function delete_playlist(item) {
  let info = JSON.stringify({
    id: item.parentNode.parentNode.parentNode.id
  })
  let req = new XMLHttpRequest();
  if (item.previousElementSibling.children[0].innerText == 0) {
    req.open("POST", "/delete_playlist_from_media", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
      let parseinfo = JSON.parse(req.response);
      if (parseinfo.deleted) {
        alert("Плейлист успешно удален")
        window.location.reload()
      }
    });
  } else {
    req.open("POST", "/delete_album_from_media", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
      let parseinfo = JSON.parse(req.response);
      if (parseinfo.deleted) {
        alert("Альбом успешно удален")
        window.location.reload()
      }
    });
  }
  
  req.send(info);
}