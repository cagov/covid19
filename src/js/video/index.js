/**
 *
 *
 * This all code from a vendor named trilogy
 *
 *
 *
 *
 * Video namespace
 */

/**
 * Fired by YouTube when the API is ready.
 */
window.onYouTubeIframeAPIReady = function () {
  video.youtubeStatus = "loaded";
};

window.addEventListener
  ? window.addEventListener("load", videoStuff, false)
  : window.attachEvent && window.attachEvent("onload", videoStuff);

function videoStuff() {
  window.video = {
    modal: document.getElementById("video-modal"), // The modal window container
    openers: document.getElementsByClassName("video-modal-open"), // Elements that will open the modal
    closers: document.getElementsByClassName("video-modal-close"), // Elements that will close the modal
    players: {}, // Cache each player's data in case the user closes and reopens it
    youtubeId: null, // The data-video attribute of the opener that was clicked
    youtubeStatus: "notLoaded", // One of: "notLoaded", "loading", "loaded"
  };

  /**
   * Closes the modal and pauses the video. Videos will resume where they left off if the user opens the modal again.
   */
  video.closeModal = function () {
    var player = video.players[video.youtubeId];

    if (player && typeof player.pauseVideo === "function") {
      player.pauseVideo();
    }

    document.getElementsByTagName("HTML")[0].classList.remove("popup_visible");
    if (document.getElementById("video-" + video.youtubeId)) {
      document.getElementById("video-" + video.youtubeId).style.display =
        "none";
    }
    if (video.modal) {
      video.modal.style.display = "none";
    }
    video.youtubeId = null;
  };

  /**
   * Initialize the YouTube API if it's not loaded, and wait.
   */
  video.initYouTube = function () {
    if (video.youtubeStatus === "notLoaded") {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      video.youtubeStatus = "loading";
      video.waitForYouTube();
    }
  };

  function vidInterval() {
    if (video.youtubeStatus === "loaded") {
      clearInterval(video.interval);
      video.play();
    }
  }
  /**
   * The user requested a video. Send them here to wait until YouTube tells us it has loaded.
   */
  video.waitForYouTube = function () {
    if(video.interval) {
      clearInterval(video.interval);
    }
    video.interval = setInterval(vidInterval, 100);
  };

  /**
   * If the player exists, show it and play. Otherwise create a container and data structure for it and play.
   */
  video.play = function () {
    var playerId = "video-" + video.youtubeId;
    var player = document.getElementById(playerId);
    var container = document.getElementById("video-container");

    if (player) {
      player.style.display = "block";
    } else {
      container.innerHTML += `<div id="${playerId}"></div>`;
      video.modal.style.display = "block";
    }

    if (!video.players[video.youtubeId]) {
      video.players[video.youtubeId] = new YT.Player(playerId, {
        host: "https://www.youtube.com",
        height: "390",
        width: "640",
        videoId: video.youtubeId,
        events: {
          onReady: video.playerReady,
        },
      });
    } else {
      if (player && video.players[video.youtubeId]) {
        player.style.display = "block";
        video.players[video.youtubeId].playVideo();
      }
    }
  };

  /**
   * Play the video once it's ready
   */
  video.playerReady = function (e) {
    e.target.playVideo();
  };

  /**
   * Clicking outside the modal will close it.
   */
  window.onclick = function (e) {
    if (e.target == video.modal) {
      video.closeModal();
    }
  };

  /**
   * The escape key will close the video modal.
   */
  window.onkeydown = function (e) {
    switch (e.keyCode) {
      case 27: // Escape key
        if (
          document
            .getElementsByTagName("HTML")[0]
            .classList.contains("popup_visible")
        ) {
          video.closeModal();
        }
        break;
    }
  };

  /**
   * Any element with a .open-video-modal will open the modal.
   */
  for (let i = 0; i < video.openers.length; i++) {
    video.openers[i].onclick = function (e) {
      if (e.target.dataset && e.target.dataset.video) {
        video.youtubeId = e.target.dataset.video;
      } else {
        video.youtubeId = e.target.closest("[data-video]").dataset.video;
      }
      if (video.youtubeId) {
        switch (video.youtubeStatus) {
          case "notLoaded":
            video.initYouTube();
            break;

          case "loading":
            video.waitForYouTube();
            break;

          case "loaded":
            video.play();
        }

        document.getElementsByTagName("HTML")[0].classList.add("popup_visible");
        if (video.modal) {
          video.modal.style.display = "block";
        }
      }
    };
  }

  /**
   * Any element with a .video-close will close the modal.
   */
  for (let i = 0; i < video.closers.length; i++) {
    video.closers[i].onclick = video.closeModal;
  }
}
