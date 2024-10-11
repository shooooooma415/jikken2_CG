window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = 1700;
    const height = 1000;

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
    camera.position.set(50, 70, -100); // カメラの位置を調整
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // カメラの注視点を設定

    const headMaterial = new THREE.MeshNormalMaterial({ color: 0xff0000 });
    const eyesMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff46 });
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const swordMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // 頭の作成
    const head = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 16), headMaterial);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), eyesMaterial);
    eye1.position.set(5, 3, -8);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), eyesMaterial);
    eye2.position.set(-5, 3, -8);

    const Head = new THREE.Group();
    Head.add(head, eye1, eye2);

    const body = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), bodyMaterial);
    body.position.set(0, -10, 0);

    const Body = new THREE.Group();
    Body.add(body);

    Head.position.set(0, 5, 0);

    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
    leftLeg.position.set(-6, -20, 0);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
    rightLeg.position.set(6, -20, 0);

    const Legs = new THREE.Group();
    Legs.add(leftLeg, rightLeg);

    const Arms = new THREE.Group();
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
    leftArm.position.set(-12, -5, 0);
    leftArm.rotation.z = Math.PI / 3;

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
    rightArm.position.set(12, -5, 0);
    rightArm.rotation.z = -Math.PI / 3;

    Arms.add(leftArm, rightArm);

    const Robot = new THREE.Group();
    Robot.add(Head, Body, Legs, Arms);
    Robot.position.y = 20;
    scene.add(Robot);

    // MediaPipe Hand Trackingの初期化
    const videoElement = document.createElement('video');
    videoElement.style.display = "block";
    videoElement.style.position = "absolute";
    videoElement.style.top = "10px";
    videoElement.style.right = "10px";
    videoElement.style.width = "320px";
    videoElement.style.height = "240px";window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = 1700;
    const height = 1000;

    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas")
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    // シーンを作成 
    const scene = new THREE.Scene();

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(50, 70, -100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // マテリアルを定義
    const headMaterial = new THREE.MeshNormalMaterial({ color: 0xff0000 });
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    // ロボットの作成
    const head = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 16), headMaterial);
    const body = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), bodyMaterial);
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);

    // ロボットの配置
    const Head = new THREE.Group();
    Head.add(head);
    const Body = new THREE.Group();
    Body.add(body);
    const Legs = new THREE.Group();
    Legs.add(leftLeg, rightLeg);
    const Arms = new THREE.Group();
    Arms.add(leftArm, rightArm);
    const Robot = new THREE.Group();
    Robot.add(Head, Body, Legs, Arms);
    Robot.position.y = 20;
    scene.add(Robot);

    // MediaPipe Hand Trackingの初期化
    const videoElement = document.createElement('video');
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    cameraUtils.start();

    // 手の検出結果に応じて手を振る
    function onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];

            // 右腕を振る動作
            const wrist = handLandmarks[0];
            const middleFingerTip = handLandmarks[12];

            const handMovement = middleFingerTip.y - wrist.y;
            if (handMovement > 0.05) {
                rightArm.rotation.z = -Math.PI / 4;  // 手を振る
            } else {
                rightArm.rotation.z = -Math.PI / 3;  // 通常状態
            }
        } else {
            rightArm.rotation.z = -Math.PI / 3;  // 手が検出されていない場合は通常状態
        }

        renderer.render(scene, camera);
    }

    function render() {
        renderer.render(scene, camera);
    }

    // 光源設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 初回レンダリング 
    render();
}

    document.body.appendChild(videoElement);

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.01,
        minTrackingConfidence: 0.01
    });

    hands.onResults(onResults);

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });
    cameraUtils.start();

    // 右腕に連動して手を振る動作
    function onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            const wrist = handLandmarks[0];
            const middleFingerTip = handLandmarks[12];
            const handMovement = middleFingerTip.y - wrist.y;

            if (handMovement > 0.05) {
                rightArm.rotation.z = -Math.PI / 4;  // 手を振る動作
            } else {
                rightArm.rotation.z = -Math.PI / 3;  // 通常状態
            }
        }

        // シーンをレンダリング
        renderer.render(scene, camera);
    }

    function render() {
        renderer.render(scene, camera);
    }

    // 光源設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 初回レンダリング 
    render();
}
