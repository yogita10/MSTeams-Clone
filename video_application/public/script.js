const socket = io('/');
const videoGrid=document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers={} 

const user = prompt("Enter your name");

const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
});


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected', (userId) => {
  
      setTimeout(connectToNewUser,1000,userId,stream)
  })


  var username = user ;
  socket.on("createMessage", (message, userName) => {
    $("ul").append(`<li >
                  <span class="messageHeader"> 
                    <span class="messageSender">${userName === user ? "me" : userName}</span> 
                    <br/>
                    <span class="message">${message}</span>
                    ${new Date().toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </span>

                 </li>`);
      scrollToBottom()
    })
 
})

   
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})


peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id,user); 
});  


const connectToNewUser = (userId,stream)=> {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call 

}


const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })

    videoGrid.append(video)

}


let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});


const scrollToBottom = () => {
  let d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
  document.querySelector('.main__mute_button').innerHTML = html;
}


const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i><span>Play Video</span>`
  document.querySelector('.main__video_button').innerHTML = html;
} 


const exit = () => {
  window.location.href = "/exit";
  window.close()
};


const inviteButton = document.querySelector("#inviteButton");
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});





   // 3
   const shareScreen = () => {

    const socket = io('/')
    const videoGrid = document.getElementById('video-grid')
    const myVideo2 = document.createElement('video')
    myVideo2.muted = true;
    const peers = {}

    const myPeer = new Peer(undefined, {
      // path: '/peerjs',
      host: '/',
      port: '443'
    })
    
  
  
  let myVideoStream2
  navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream2 = stream;
    addVideoStream(myVideo2, stream)

    peer.on('call', call => {
      call.answer(stream)
      const video2 = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video2, userVideoStream)
      })
    })
  
    socket.on('user-connected', userId => {
      setTimeout(connectToNewUser,1000,userId,stream)
    })

  
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })
  
  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id,user)
  })


  const connectToNewUser = (userId, stream) => {
    
    const call = myPeer.call(userId, stream)
    const video2 = document.createElement('video')
    call.on('stream', userVideoStream => {
      
    })
    call.on('close', () => {
      video2.remove()
    })
  
    peers[userId] = call
  }
  
  const addVideoStream = (video2, stream) => {
    video2.srcObject = stream
    video2.addEventListener('loadedmetadata', () => {
      video2.play()
    })
    videoGrid.append(video2)
  }
  
  
};
  

