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

    // size
    const modelViewer = document.getElementById('modelViewer');
      const scaleSlider = document.getElementById('model-scale');
      scaleSlider.addEventListener('input', () => {
        const scale = scaleSlider.value;
        modelViewer.scale = `${scale} ${scale} ${scale}`;
      });
});