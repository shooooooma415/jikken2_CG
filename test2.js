window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = 1500;
  const height = 800;

  // レンダラーを作成 
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  renderer.setSize(width, height); /* ウィンドウサイズの設定 */
  renderer.setClearColor(0x000000); /* 背景色の設定 */

  // シーンを作成 
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(60, width / height); // 画角を広げる
  camera.position.set(50, 70, -100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const headMaterial = new THREE.MeshNormalMaterial({
    color: 0xff0000
  });
  const eyesMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff46
  });
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff
  });
  const cannonMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
  });
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff
  });
  const armMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00
  });
  const bulletMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000
  });
  const swordMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });

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

  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 10, 32), cannonMaterial);
  cannon.position.set(0, -10, -6);
  cannon.rotation.set(Math.PI / 2, 0, 0);

  const Body = new THREE.Group();
  Body.add(body, cannon);

  Head.position.set(0, 5, 0);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
  leftLeg.position.set(-6, -20, 0);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
  rightLeg.position.set(6, -20, 0);

  const Legs = new THREE.Group();
  Legs.add(leftLeg, rightLeg);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
  leftArm.position.set(-12, -5, 0);
  leftArm.rotation.z = Math.PI / 3;

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
  rightArm.position.set(12, -5, 0);
  rightArm.rotation.z = -Math.PI / 3;

  const Arms = new THREE.Group();
  Arms.add(leftArm, rightArm);

  const Robot = new THREE.Group();
  Robot.add(Head, Body, Legs, Arms);
  Robot.position.y = 20;
  scene.add(Robot);

  let isWalking = false;
  let currentLegRotation = 0;
  let legRotationDirection = 1;
  let maxLegRotation = Math.PI / 8;
  let maxArmRotation = Math.PI / 2;

  let velocityY = 0;
  const gravity = -0.05;
  const jumpStrength = 1.5;
  let isJumping = false;  // ジャンプ状態のフラグ

  let bullets = [];
  let sword = null;
  let isSwordEquipped = false;
  let targetRotation = 0; // 手のX位置に基づく目標回転角度
  let speedFromHand = 0; // 手のY座標による移動速度

  // MediaPipe Hand Trackingの初期化
  const videoElement = document.createElement('video');
  videoElement.style.width = "320px";
  videoElement.style.height = "240px";
  videoElement.style.position = "absolute";
  videoElement.style.right = "0";
  videoElement.style.bottom = "0";
  videoElement.style.transform = "scaleX(-1)";  // 鏡のように反転
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

  // 手の動きに基づいてロボットの方向と移動を変える
  function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const handLandmarks = results.multiHandLandmarks[0];
      const handX = handLandmarks[0].x; // 手のX座標
      const handY = handLandmarks[0].y; // 手のY座標

      // 手のX座標を使って回転の方向を決定
      const rotationFromHand = (handX - 0.5) * Math.PI * 2; // X軸の動きを-πからπの範囲にマッピング
      targetRotation = rotationFromHand;

      // 手のY座標を使って速度を制御
      speedFromHand = 1 - handY; // Y軸の動きに基づいて速度を調整

      isWalking = true; // 手が認識されたら歩行
      animateLegsAndArms();
    } else {
      isWalking = false; // 手が検出されない場合は歩行を停止
    }
  }

  function animateLegsAndArms() {
    if (isWalking) {
      leftLeg.rotation.x += legRotationDirection * 0.05;
      rightLeg.rotation.x -= legRotationDirection * 0.05;
      currentLegRotation += 0.05;

      leftArm.rotation.x -= legRotationDirection * 0.05;
      rightArm.rotation.x += legRotationDirection * 0.05;

      if (currentLegRotation >= maxLegRotation || currentLegRotation <= -maxLegRotation) {
        legRotationDirection *= -1;
        currentLegRotation = 0;
      }

      // 手の動きによる回転制御
      Robot.rotation.y += (targetRotation - Robot.rotation.y) * 0.05;

      // ロボットの移動
      Robot.position.z -= Math.cos(Robot.rotation.y) * speedFromHand * 0.2; // 手のY座標に基づく速度
      Robot.position.x -= Math.sin(Robot.rotation.y) * speedFromHand * 0.2;

      render();
      requestAnimationFrame(animateLegsAndArms);
    }
  }

  document.addEventListener("keydown", onDocumentKeyDown, false);

  function onDocumentKeyDown(event_k) {
    let keyCode = event_k.which;

    if (keyCode == 82) { // 'R'キーが押された場合
      resetRobotPosition();
    }
    if (keyCode == 74 && !isJumping) { // 'J'キーでジャンプ
      isJumping = true;
      velocityY = jumpStrength;
      animateJump();
    }

    if (keyCode == 65) { // 'A'キーで弾を発射
      fireBullet();
    }

    if (keyCode === 83) { // 'S'キーで剣を装備
      equipSword();
    }

    if (keyCode === 32) { // スペースキーで剣を振る
      swingSword();
    }
  }

  function animateJump() {
    velocityY += gravity;
    Robot.position.y += velocityY;

    if (Robot.position.y <= 20) {
      Robot.position.y = 20;
      velocityY = 0;
      isJumping = false;
    } else {
      requestAnimationFrame(animateJump);
    }
    render();
  }

  function fireBullet() {
    const bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), bulletMaterial);
    const initialPosition = {
      x: Robot.position.x - Math.sin(Robot.rotation.y) * 6,
      y: Robot.position.y - 10,
      z: Robot.position.z - Math.cos(Robot.rotation.y) * 6,
    };

    const initialDirection = {
      x: -Math.sin(Robot.rotation.y),
      z: -Math.cos(Robot.rotation.y),
    };

    bullet.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    bullet.userData = { direction: initialDirection };
    bullets.push(bullet);
    scene.add(bullet);
  }

  function animateBullets() {
    bullets.forEach(bullet => {
      const direction = bullet.userData.direction;
      bullet.position.x += direction.x * 0.5;
      bullet.position.z += direction.z * 0.5;
    });

    bullets = bullets.filter(bullet => bullet.position.z < 100 && bullet.position.x < 100); // 画面外に出た弾を削除

    render();
    requestAnimationFrame(animateBullets);
  }

  function equipSword() {
    if (!isSwordEquipped) {
      const swordGeometry = new THREE.BoxGeometry(3, 30, 2);
      swordGeometry.translate(0, 15, 0);

      sword = new THREE.Mesh(swordGeometry, swordMaterial);
      sword.position.set(18, -2, 0);
      sword.rotation.z = -Math.PI / 4;
      Arms.add(sword);
      isSwordEquipped = true;
    } else {
      Arms.remove(sword);
      isSwordEquipped = false;
    }
  }

  function swingSword() {
    if (isSwordEquipped) {
      let swingAngle = Math.PI / 2;
      const swingSpeed = 0.1;

      function animateSwing() {
        if (swingAngle > 0) {
          sword.rotation.x -= swingSpeed;
          swingAngle -= swingSpeed;
          render();
          requestAnimationFrame(animateSwing);
        } else {
          sword.rotation.x = 0;
        }
      }
      animateSwing();
    }
  }

  function resetRobotPosition() {
    const initialPosition = { x: Robot.position.x, y: Robot.position.y, z: Robot.position.z };
    const targetPosition = { x: 0, y: 20, z: 0 };

    const duration = 1000; // 1秒でリセット
    let startTime = null;

    function animateReset(time) {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;

      if (progress < 1) {
        Robot.position.x = initialPosition.x + (targetPosition.x - initialPosition.x) * progress;
        Robot.position.y = initialPosition.y + (targetPosition.y - initialPosition.y) * progress;
        Robot.position.z = initialPosition.z + (targetPosition.z - initialPosition.z) * progress;
        requestAnimationFrame(animateReset);
      } else {
        Robot.position.set(0, 20, 0);
      }

      render();
    }

    requestAnimationFrame(animateReset);
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

  animateBullets();
  render();
}
