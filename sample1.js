window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 1000; 
    const height = 500; 

    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas")
    }); 
    renderer.setSize(width, height); 
    renderer.setClearColor(0xff00ff); 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 0, 50); 
 
    // 初回実行 
    renderer.render(scene, camera); 
} 