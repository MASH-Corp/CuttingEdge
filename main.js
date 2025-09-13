document.addEventListener('DOMContentLoaded', () => {
// Camera Access
    const video = document.getElementById('camera');

    // Ask for camera access
    navigator.mediaDevices.getUserMedia(
        { video: { facingMode: { exact: "environment" } },
         audio: false 
        })
      .then(stream => {
        // Set the video srcObject to the camera stream
        video.srcObject = stream;
      })
      .catch(error => {
        console.error("Error accessing camera:", error);
      });
    
// Info Icon Alert
const infoBox = document.getElementById('info');
const infoModal = document.getElementById('info-modal');
const closeBtn = document.getElementById('close-btn');

infoBox.addEventListener('click', () => {
  infoModal.style.display = 'flex';
    
});

closeBtn.addEventListener('click', () => {
  infoModal.style.display = 'none';
});


const box = document.getElementById("model-box");
let initialDistance = 0;
let currentScale = 1;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

box.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches);
  }
});

box.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    e.preventDefault(); // stop page scroll/zoom
    let newDistance = getDistance(e.touches);
    let scaleChange = newDistance / initialDistance;
    let newScale = currentScale * scaleChange;

    // Limit scaling between 0.5x and 3x
    newScale = Math.min(Math.max(newScale, 0.5), 3);

    box.style.transform = `scale(${newScale})`;
  }
});

box.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    // Save the scale after gesture ends
    let transform = window.getComputedStyle(box).transform;
    if (transform !== "none") {
      let values = transform.match(/matrix\(([^)]+)\)/)[1].split(",");
      currentScale = parseFloat(values[0]);
    }
  }
});

});