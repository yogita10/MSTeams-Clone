const ScreenShare = () => {

    const socket = io('/');
    const videoGrid=document.getElementById('video-grid')
    const myVideo = document.createElement('video')
    myVideo.muted = true;
    const peers={} 
    
    
    const peer = new Peer(undefined, {
      path: '/peerjs',
      host: '/',
      port: '443'
    });
    
    
    let myVideoStream;
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio:true
      }).then(stream => {
        myVideoStream = stream;
        // addVideoStream(myVideo, stream)
    
        peer.on('call', call => {
          call.answer(stream)
          const video = document.createElement('video')
          call.on('stream', userVideoStream => {
             //addVideoStream(video, userVideoStream)
          })
        })
    
        socket.on('user-connected', (userId) => {
          setTimeout(connectToNewUser,1000,userId,stream)
      })
    })
    
       
    socket.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close() 
      videoGrid.close();
    
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
    
    
    // stream.onended = () => {
    //   console.info("ScreenShare has ended");
    // };
    
    
    // stream.onremovetrack = function(stream) {
    //   let trackList = document.getElementById("video-grid");
      // let label = document.createElement("li");
    
      // label.textContent = `Removed: ${event.track.kind}: ${event.track.label}`;
    //   trackList.remove();
    // };
    
    
    // const video = document.querySelector('video-grid');
    
    // videoGrid.onended = (event) => {
    //   console.log('Video stopped either because 1) it was over, ' +
    //       'or 2) no further data is available.');
    // };
    
    
    // function releaseCapturing() {
      // getting desktop-media-id from local-storage
    //   chrome.desktopCapture.cancelChooseDesktopMedia(parseInt(localStorage['desktop-media-request-id']));
    // }
    
    // function captureDesktop() {
    //   var desktop_id = chrome.desktopCapture.chooseDesktopMedia(
    //       ["screen", "window"], onAccessApproved);
    
      // storing desktop-media-id in the local-storage
    //   localStorage.setItem('desktop-media-request-id', desktop_id);
    // }
    
    
    // var tracks = this.stream.getTracks();
    //     for( var i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
    
    
    // stream.getVideoTracks()[0].addEventListener('ended', () => {
    //   videoGrid.close();
    // });
    
    
    }
    