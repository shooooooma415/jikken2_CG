window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = 500;
    const height = 500;
    let rot = 30;
    let count_color = 1;
    let flag_rotation = 0;
    let count_rotation = 0;

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
        color: 0x0000ff
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

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event_k) {
        let keyCode = event_k.which;
        // q: ページを閉じる
        if (keyCode == 81) {
            window.close();
        }
        // r: y軸で30°づつ回転
        else if (keyCode == 82) {
            box.rotation.y += radian;
        }
        // c: 白→赤→緑→青→白
        else if (keyCode == 67) {
            if (count_color % 4 == 0) {
                box.material.color.set(0xffffff);
            }
            else if (count_color % 4 == 1) {
                box.material.color.set(0xff0000);
            }
            else if (count_color % 4 == 2) {
                box.material.color.set(0x00ff00);
            }
            else if (count_color % 4 == 3) {
                box.material.color.set(0x0000ff);
            }
            count_color++;
        }

        render();
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    function onDocumentMouseDown(event_m) {
        switch (event_m.button) {
            // 左クリック (button == 0)
            case 0:
                flag_rotation = 1; // 回転を開始
                animate();
                break;
            // 右クリック (button == 2)
            case 2:
                flag_rotation = 0; // 回転を停止
                break;
            default:
                break;
        }
    }

    function animate() {
        if (flag_rotation) {
            box.rotation.y += 1;
            render();
            requestAnimationFrame(animate);
        }
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
}