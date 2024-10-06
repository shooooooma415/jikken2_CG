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
    camera.position.set(0, 0, -70);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa
    });
    const highlight = new THREE.MeshStandardMaterial({
        color: 0x4444ff
    });


    const head = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 16), bodyMat);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), highlight);
    eye1.position.set(5, 3, -8);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), highlight);
    eye2.position.set(-5, 3, -8);

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 3), highlight);
    mouse.position.set(0, -3, -8);
    mouse.rotation.set(Math.PI / 2, Math.PI, 0);
    scene.add(mouse);

    const ear_right = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 16), bodyMat);
    ear_right.position.set(10, 8, 0); 
    ear_right.rotation.set(0, 0, Math.PI / 2);
    scene.add(ear_right);

    const ear_left = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 16), bodyMat);
    ear_left.position.set(-10, 8, 0); 
    ear_left.rotation.set(0, 0, Math.PI / 2); 
    scene.add(ear_left);

    const group = new THREE.Group();
    group.add(head,eye1,eye2,mouse,ear_right,ear_left)
    scene.add(group);


    //光源設定

    // 平行光源 
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    // シーンに追加 
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 初回実行 
    renderer.render(scene, camera);
} 