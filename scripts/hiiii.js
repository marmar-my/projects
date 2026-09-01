const CORRECT_CODE = "0713";
let currentCode = "";
const codeInputField = document.getElementById("codeInput");
const errorContainer = document.getElementById("errorContainer");
const passcodeScreen = document.getElementById("passcodeScreen");
const mainDashboard = document.getElementById("mainDashboard");
let isProcessing = false;

const messagePage = document.getElementById("messagePage");
const musicPage = document.getElementById("musicPage");
const galleryPage = document.getElementById("galleryPage");
const gamePage = document.getElementById("gamePage");
let currentAudio = null;
let currentlyPlayingIndex = null;

// Game variables
let gameYesSize = 20;
let gameNoClicked = false;
let gameCompleted = false;

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentlyPlayingIndex = null;
}

function updateCodeDisplay() {
  let displayValue = currentCode.padEnd(4, " ").slice(0, 4);
  codeInputField.value = displayValue;
}

function showWrongError() {
  if (isProcessing) return;
  isProcessing = true;
  errorContainer.classList.remove("hidden-element");
  const displayDiv = document.querySelector(".code-display");
  displayDiv.style.animation = "shakeAnim 0.4s ease";
  setTimeout(() => { displayDiv.style.animation = ""; }, 400);
  setTimeout(() => {
    errorContainer.classList.add("hidden-element");
    isProcessing = false;
  }, 1800);
  currentCode = "";
  updateCodeDisplay();
}

function autoSubmitIfComplete() {
  if (currentCode.length === 4 && !isProcessing) {
    if (currentCode === CORRECT_CODE) {
      passcodeScreen.classList.add("hidden");
      mainDashboard.classList.add("hidden");
      gamePage.classList.remove("hidden");
      errorContainer.classList.add("hidden-element");
      isProcessing = false;
      currentCode = "";
      messagePage.classList.add("hidden");
      musicPage.classList.add("hidden");
      galleryPage.classList.add("hidden");

      // Start the game automatically
      setTimeout(() => {
        gameCompleted = false;
        initializeGame();
        enableInteractiveHearts();
        enableMusicPlayer();
      }, 500);
    } else {
      showWrongError();
    }
  }
}

function addDigit(digit) {
  if (currentCode.length < 4 && !isProcessing) {
    currentCode += digit;
    updateCodeDisplay();
    autoSubmitIfComplete();
  }
}

function deleteDigit() {
  if (!isProcessing && currentCode.length > 0) {
    currentCode = currentCode.slice(0, -1);
    updateCodeDisplay();
    errorContainer.classList.add("hidden-element");
  }
}

// MUSIC DATA
const playlist = [
  { title: "Perfect", artist: "Ed Sheeran", emoji: "🎸", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Can't Help Falling in Love", artist: "Elvis Presley", emoji: "🎤", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "All of Me", artist: "John Legend", emoji: "🎹", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

function playSong(index) {
  stopAudio();
  const song = playlist[index];
  const audio = new Audio(song.src);
  currentAudio = audio;
  currentlyPlayingIndex = index;
  audio.play().catch(e => console.log("Autoplay blocked"));
  renderMusicPageContent();
}

function renderMusicPageContent() {
  const container = document.getElementById("musicPageContent");
  if (!container) return;
  let musicHtml = `<div class="music-section"><h3>🎶 Our Favorite Melodies 🎶</h3><div class="song-list">`;
  playlist.forEach((song, idx) => {
    const isPlaying = (currentlyPlayingIndex === idx && currentAudio && !currentAudio.paused);
    musicHtml += `
                <div class="song-card">
                    <div class="song-emoji">${song.emoji}</div>
                    <div class="song-details">
                        <div class="song-title">${song.title} ${isPlaying ? ' ▶️' : ''}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <div class="play-btn" data-play="${idx}">${isPlaying ? '⏸ Pause' : '🎵 Play'}</div>
                </div>`;
  });
  musicHtml += `</div><p style="font-size:0.7rem; text-align:center; margin-top:22px;">💖 These songs remind me of us 💖</p></div>`;
  container.innerHTML = musicHtml;

  document.querySelectorAll('#musicPageContent .play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-play'));
      if (currentAudio && currentlyPlayingIndex === idx && !currentAudio.paused) {
        currentAudio.pause();
        renderMusicPageContent();
      } else {
        playSong(idx);
      }
    });
  });
}

// GALLERY
const galleryImages = [
  { url: "./images/pic%201.jpeg", caption: "Our Beautiful Moment 💕" },
  { url: "./images/pic%202.jpeg", caption: "Love & Laughter 😊" },
  { url: "./images/pic%203.jpeg", caption: "Very Pretty🌹" },
  { url: "./images/pic%204.jpeg", caption: "My CutiePie HAHAHA 💑" },
  { url: "./images/pic%205.jpeg", caption: "First Pic Together Yieee" },
  { url: "./images/pic%206.jpeg", caption: "cute" },
  { url: "./images/pic%207.jpeg", caption: "Happy sila hahaha" },
];

function openLightbox(imgSrc, caption) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10000';
  overlay.style.cursor = 'pointer';
  const imgElem = document.createElement('img');
  imgElem.src = imgSrc;
  imgElem.style.maxWidth = '90%';
  imgElem.style.maxHeight = '80%';
  imgElem.style.borderRadius = '28px';
  imgElem.style.boxShadow = '0 0 0 4px #ffb7c5, 0 20px 35px black';
  const cap = document.createElement('div');
  cap.innerText = caption;
  cap.style.color = 'white';
  cap.style.backgroundColor = '#c44569cc';
  cap.style.padding = '8px 20px';
  cap.style.borderRadius = '60px';
  cap.style.marginTop = '20px';
  overlay.appendChild(imgElem);
  overlay.appendChild(cap);
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

function renderGalleryPageContent() {
  const container = document.getElementById("galleryPageContent");
  if (!container) return;
  let galleryHtml = `<div class="gallery-section"><h3>📸 Our Beautiful Moments</h3><div class="gallery-grid">`;
  galleryImages.forEach((img, i) => {
    const escapedCaption = img.caption.replace(/"/g, '&quot;');
    galleryHtml += `
                <div class="gallery-card" data-img="${img.url}" data-caption="${escapedCaption}">
                    <img src="${img.url}" alt="moment ${i}" loading="lazy">
                    <div class="gallery-caption">${img.caption}</div>
                </div>`;
  });
  galleryHtml += `</div><p style="text-align:center; margin-top:20px; font-size:0.75rem;">✨ Tap any photo to see it bigger ✨</p></div>`;
  container.innerHTML = galleryHtml;

  document.querySelectorAll('#galleryPageContent .gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgUrl = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      if (imgUrl) openLightbox(imgUrl, caption);
    });
  });
}

function showPage(pageId) {
  mainDashboard.classList.add("hidden");
  messagePage.classList.add("hidden");
  musicPage.classList.add("hidden");
  galleryPage.classList.add("hidden");
  gamePage.classList.add("hidden");
  if (pageId !== 'musicPage') {
    stopAudio();
    currentlyPlayingIndex = null;
  }
  document.getElementById(pageId).classList.remove("hidden");

  if (pageId === 'musicPage') renderMusicPageContent();
  else if (pageId === 'galleryPage') renderGalleryPageContent();
  else if (pageId === 'gamePage') initializeGame();
}

function goBackToDashboard() {
  stopAudio();
  currentlyPlayingIndex = null;
  mainDashboard.classList.remove("hidden");
  messagePage.classList.add("hidden");
  musicPage.classList.add("hidden");
  galleryPage.classList.add("hidden");
  gamePage.classList.add("hidden");
}

document.querySelectorAll('.nav-btn-vertical').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.getAttribute('data-section');
    if (section === 'message') showPage('messagePage');
    else if (section === 'music') showPage('musicPage');
    else if (section === 'gallery') showPage('galleryPage');
    else if (section === 'game') showPage('gamePage');
  });
});

document.querySelectorAll('.back-button').forEach(btn => {
  btn.addEventListener('click', () => goBackToDashboard());
});

document.querySelectorAll('.key[data-digit]').forEach(key => {
  key.addEventListener('click', () => {
    const digit = key.getAttribute('data-digit');
    if (digit) addDigit(digit);
  });
});
const delBtn = document.querySelector('[data-action="delete"]');
if (delBtn) delBtn.addEventListener('click', () => deleteDigit());

document.addEventListener('keydown', (e) => {
  if (!passcodeScreen.classList.contains('hidden')) {
    if (e.key >= '0' && e.key <= '9') { addDigit(e.key); e.preventDefault(); }
    else if (e.key === 'Backspace') { deleteDigit(); e.preventDefault(); }
  }
});

// INTERACTIVE HEARTS - Enabled after password unlock
let heartsAreInteractive = false;

function enableInteractiveHearts() {
  heartsAreInteractive = true;
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach(heart => {
    heart.classList.add('interactive');
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      handleHeartClick(e);
    });
  });
}

function handleHeartClick(event) {
  const heart = event.currentTarget;
  const rect = heart.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Create burst effect
  createHeartBurst(x, y);

  // Add pulse animation
  heart.style.animation = 'none';
  setTimeout(() => {
    heart.style.animation = '';
  }, 10);
}

function createHeartBurst(x, y) {
  const burstCount = 8;
  for (let i = 0; i < burstCount; i++) {
    const angle = (i / burstCount) * Math.PI * 2;
    const burst = document.createElement('div');
    burst.innerHTML = '❤️';
    burst.style.position = 'fixed';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    burst.style.fontSize = '1.2rem';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '9999';
    burst.style.animation = `burst ${0.8}s ease-out forwards`;

    const distance = 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    burst.style.setProperty('--tx', tx + 'px');
    burst.style.setProperty('--ty', ty + 'px');

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
  }

  // Add sparkles
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '0.9rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = `burst ${1}s ease-out forwards`;

    const angle = (Math.random() * Math.PI * 2);
    const distance = 60 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// MUSIC PLAYER
let isMusicPlaying = false;
let backgroundAudio = null;

function enableMusicPlayer() {
  const musicBtn = document.getElementById('musicPlayerBtn');
  if (!musicBtn) return;

  musicBtn.classList.add('active');
  musicBtn.addEventListener('click', toggleBackgroundMusic);
}

function toggleBackgroundMusic() {
  const musicBtn = document.getElementById('musicPlayerBtn');
  if (!musicBtn) return;

  if (isMusicPlaying && backgroundAudio) {
    backgroundAudio.pause();
    isMusicPlaying = false;
    musicBtn.innerHTML = '🎵';
    musicBtn.style.opacity = '0.7';
  } else {
    if (!backgroundAudio) {
      // Use a romantic background music from local files
      backgroundAudio = new Audio('../music/Tchaikovsky - Romeo and Juliet (Fantasy Overture) [_Od7gx3Dc-U] (1).mp3');
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0.3;
    }
    backgroundAudio.play().catch(e => {
      console.log("Cannot autoplay music:", e);
      alert('Click anywhere on the page first, then try again!');
    });
    isMusicPlaying = true;
    musicBtn.innerHTML = '🎵♪';
    musicBtn.style.opacity = '1';
  }
}

// Add burst animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes burst {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx), var(--ty)) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

function init() {
  currentCode = "";
  isProcessing = false;
  updateCodeDisplay();
  errorContainer.classList.add("hidden-element");
  passcodeScreen.classList.remove("hidden");
  mainDashboard.classList.add("hidden");
  messagePage.classList.add("hidden");
  musicPage.classList.add("hidden");
  galleryPage.classList.add("hidden");
  gamePage.classList.add("hidden");
  if (currentAudio) stopAudio();
}

// Game Page Logic
function initializeGame() {
  // Prevent re-initialization if game is already completed
  if (gameCompleted) {
    return;
  }

  // Reset game state
  gameYesSize = 20;
  gameNoClicked = false;

  const yesBtn = document.getElementById('gameYesBtn');
  const noBtn = document.getElementById('gameNoBtn');
  const pageContainer = document.querySelector('#gamePage .page-container');

  // Reset page container animation
  if (pageContainer) {
    pageContainer.classList.remove('game-completed');
  }

  // Reset button styles
  yesBtn.style.fontSize = '18px';
  yesBtn.style.pointerEvents = 'auto';
  yesBtn.style.opacity = '1';
  noBtn.style.pointerEvents = 'auto';
  noBtn.style.opacity = '1';

  // Reset ragebait layer
  const ragebaitLayer = document.querySelector('.ragebait-layer');
  if (ragebaitLayer) {
    ragebaitLayer.classList.remove('active');
  }

  // Reset all hearts
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach(heart => {
    heart.textContent = '❤️';
    heart.style.animation = '';
    heart.style.opacity = '';
  });

  // Remove old listeners by cloning
  const newYesBtn = yesBtn.cloneNode(true);
  const newNoBtn = noBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
  noBtn.parentNode.replaceChild(newNoBtn, noBtn);

  const updatedYesBtn = document.getElementById('gameYesBtn');
  const updatedNoBtn = document.getElementById('gameNoBtn');

  // Add event listeners
  updatedNoBtn.addEventListener('click', handleGameNoClick);
  updatedYesBtn.addEventListener('click', handleGameYesClick);
}

function handleGameNoClick() {
  // Prevent action if game is completed
  if (gameCompleted) return;

  gameNoClicked = true;
  const yesBtn = document.getElementById('gameYesBtn');

  // Break all hearts
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach(heart => {
    heart.textContent = '💔';
    heart.style.animation = 'none';
    heart.style.opacity = '0.5';
  });

  // Increase yes button size
  gameYesSize += 15;
  yesBtn.style.fontSize = gameYesSize + 'px';

  // Move no button away
  const noBtn = document.getElementById('gameNoBtn');
  const randomX = Math.random() * 200 - 100;
  const randomY = Math.random() * 200 - 100;
  noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}


function handleGameYesClick() {
  const modalOverlay = document.getElementById('gameModalOverlay');
  const modalTitle = document.getElementById('gameModalTitle');
  const modalMessage = document.getElementById('gameModalMessage');
  const pageContainer = document.querySelector('#gamePage .page-container');
  const yesBtn = document.getElementById('gameYesBtn');
  const noBtn = document.getElementById('gameNoBtn');

  if (gameNoClicked) {
    modalTitle.textContent = '💔 Why though?';
    modalMessage.textContent = 'You broke my heart... but at least you said yes at some point!';
  } else {
    modalTitle.textContent = '❤️ Yay!';
    modalMessage.textContent = 'I love you so much! Thank you for being mine.';
  }

  // Mark game as completed
  gameCompleted = true;

  // Disable both buttons
  yesBtn.style.pointerEvents = 'none';
  yesBtn.style.opacity = '0.5';
  noBtn.style.pointerEvents = 'none';
  noBtn.style.opacity = '0.5';

  // Animate page container when game is completed
  if (pageContainer) {
    pageContainer.classList.add('game-completed');
  }

  modalOverlay.classList.add('active');

  // Auto-close modal after 3 seconds
  setTimeout(() => {
    closeGameModal();
  }, 3000);
}

function closeGameModal() {
  const modalOverlay = document.getElementById('gameModalOverlay');
  modalOverlay.classList.remove('active');
}

// Set up game modal close button
document.addEventListener('DOMContentLoaded', () => {
  const gameCloseBtn = document.getElementById('gameCloseBtn');
  if (gameCloseBtn) {
    gameCloseBtn.addEventListener('click', closeGameModal);
  }

  const gameModalOverlay = document.getElementById('gameModalOverlay');
  if (gameModalOverlay) {
    gameModalOverlay.addEventListener('click', (e) => {
      if (e.target === gameModalOverlay) {
        closeGameModal();
      }
    });
  }
});

init();