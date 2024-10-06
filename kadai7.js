window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = 500;
  const height = 500;
  let rot = 30;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  renderer.setSize(width, height); /* ウィンドウサイズの設定 */
  renderer.setClearColor(0x000000); /* 背景色の設定 */

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(30, width / height, 1.0, 1500);
  camera.position.set(0, 20, -40);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 平面を作成
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  scene.add(box);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -5, 0);
  plane.rotateX(-Math.PI / 2, 0, 0);

  scene.add(plane);

  // 幾何変換
  const radian = rot * Math.PI / 180;

  // アニメーション処理
  function animate() {
    let requestId = requestAnimationFrame(animate);
    box.rotation.y += 0.1;
    box.position.y += 1;
    render();
  }

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);

  // シーンに追加
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 初回実行
  let render = function () { renderer.render(scene, camera); };
  render();

  // アニメーション開始
  animate();
}
