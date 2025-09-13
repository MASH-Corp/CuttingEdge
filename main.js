<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AR Chair with WebXR</title>
<style>
  body { margin: 0; overflow: hidden; font-family: sans-serif; }
  video { display: none; }
  #info-modal {
    display: none; position: fixed; top:0; left:0; width:100%; height:100%;
    background: rgba(0,0,0,0.7); justify-content: center; align-items: center;
  }
  #info-modal div {
    background: #fff; padding: 20px; border-radius: 8px; text-align: center;
  }
  #model-scale {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  }
</style>
</head>
<body>

<video autoplay playsinline id="camera"></video>

<!-- Info -->
<div id="info" style="position: fixed; top: 20px; right: 20px; cursor: pointer; background: #007bff; color: white; padding: 10px; border-radius: 50%;">i</div>
<div id="info-modal">
  <div>
    <p>Tap and hold to place the chair in AR. Use the slider to scale.</p>
    <button id="close-btn">Close</button>
  </div>
</div>

<!-- Model Scale Slider -->
<input type="range" id="model-scale" min="0.1" max="2" step="0.01" value="0.5">

<script type="module">
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.1/build/three.module.js';
  import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.1/examples/jsm/loaders/GLTFLoader.js';
  import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.161.1/examples/jsm/webxr/ARButton.js';

  document.addEventListener('DOMContentLoaded', () => {
    // Camera Access
    const video = document.getElementById('camera');
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    })
    .then(stream => { video.srcObject = stream; })
    .catch(error => { console.error("Error accessing camera:", error); });

    // Info Modal
    const infoBox = document.getElementById('info');
    const infoModal = document.getElementById('info-modal');
    const closeBtn = document.getElementById('close-btn');

    infoBox.addEventListener('click', () => { infoModal.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { infoModal.style.display = 'none'; });

    // Three.js + AR Setup
    let camera, scene, renderer, model;
    init();

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 20);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      document.body.appendChild(renderer.domElement);

      document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load('office_chair.glb', (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5); // initial scale
      });

      // AR Hit Test (place model on tap)
      const controller = renderer.xr.getController(0);
      controller.addEventListener('select', (event) => {
        if(model) {
          const clone = model.clone();
          clone.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld);
          clone.quaternion.setFromRotationMatrix(controller.matrixWorld);
          scene.add(clone);
        }
      });
      scene.add(controller);

      // Slider for scaling all models in scene
      const scaleSlider = document.getElementById('model-scale');
      scaleSlider.addEventListener('input', () => {
        const scale = parseFloat(scaleSlider.value);
        scene.traverse((child) => {
          if(child.isMesh) child.scale.set(scale, scale, scale);
        });
      });

      renderer.setAnimationLoop(() => { renderer.render(scene, camera); });
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  });
</script>
</body>
</html>
