window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 500; 
    const height = 500;
    
    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas") 
    }); 
    renderer.setSize(width, height); /* ウィンドウサイズの設定 */ 
    renderer.setClearColor(0x000000); /* 背景色の設定 */ 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45.0, 1.0, 1.0, 1000);
    camera.position.set(0, 20, -40); 
    camera.lookAt(new THREE.Vector3(0,0,0));

    // 平面を作成 
    const boxGeometry = new THREE.BoxGeometry(10,10,10);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    }); 
    const box = new THREE.Mesh(boxGeometry, boxMaterial); 
    const rorateY = box.rotateY(THREE.Math.degToRad(70));
    const translateX = rorateY.translateX(10);
    scene.add(translateX); 

    const planeGeometry = new THREE.PlaneGeometry(50,50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa
    }); 
    const plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.position.set(0,-5,0);
    plane.rotateX(-Math.PI/2,0,0);

    scene.add(plane);

    // 平行光源 
    const directionalLight = new THREE.DirectionalLight(0xffffff,1); 
    directionalLight.position.set(1, 1, 1); 

    // シーンに追加 
    scene.add(directionalLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambientLight);
    // 初回実行 
    renderer.render(scene, camera); 
} 