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
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 20, -40); 
    camera.lookAt(new THREE.Vector3(0,0,0));


    const boxGeometry = new THREE.BoxGeometry(10,10,10);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    }); 
    const box = new THREE.Mesh(boxGeometry, boxMaterial); 

    scene.add(box); 

    const planeGeometry = new THREE.PlaneGeometry(50,50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa
    }); 
    const plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.position.set(0,-5,0);
    plane.rotateX(-Math.PI/2,0,0);

    scene.add(plane);

    //光源設定

    // スポット光源 
    const spotLight = new THREE.SpotLight(0xffffff,1,100,THREE.Math.degToRad(30),0,2); 
    spotLight.position.set(0, 20, 0); 
    scene.add(spotLight);
    
    //環境光
    const ambientLight = THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambientLight);

    // 初回実行 
    renderer.render(scene, camera); 
} 