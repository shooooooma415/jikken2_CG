window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = 1000;
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
    camera.position.set(30, 20, -70);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000
    });
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00
    });
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff
    });
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00
    });
    const highlight = new THREE.MeshStandardMaterial({
        color: 0x4444ff
    });

    // 頭の作成
    const head = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 16), headMaterial);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), highlight);
    eye1.position.set(5, 3, -8);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), highlight);
    eye2.position.set(-5, 3, -8);

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 3), highlight);
    mouse.position.set(0, -3, -8);
    mouse.rotation.set(Math.PI / 2, Math.PI, 0);

    const earRight = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 16), headMaterial);
    earRight.position.set(10, 8, 0);
    earRight.rotation.set(0, 0, Math.PI / 2);

    const earLeft = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 16), headMaterial);
    earLeft.position.set(-10, 8, 0);
    earLeft.rotation.set(0, 0, Math.PI / 2);

    const Head = new THREE.Group();
    Head.add(head, eye1, eye2, mouse, earLeft, earRight);

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
    scene.add(Robot);

    let isWalking = false;
    let isJumping = false;
    let legRotationDirection = 1;
    let maxLegRotation = Math.PI / 8;
    let currentLegRotation = 0;

    let velocityY = 0;
    const gravity = -0.05;
    const jumpStrength = 1.5;

    document.addEventListener("keydown", onDocumentKeyDown, false);

    function onDocumentKeyDown(event_k) {
        let keyCode = event_k.which;
        if (keyCode == 87) {
            isWalking = !isWalking;
            if (isWalking) {
                animateLegs();
            }
        }
        if (keyCode == 74 && !isJumping) {
            isJumping = true;
            velocityY = jumpStrength;
            animateJump();
        }
    }

    function animateLegs() {
        if (isWalking) {
            leftLeg.rotation.x += legRotationDirection * 0.05;
            rightLeg.rotation.x -= legRotationDirection * 0.05;

            currentLegRotation += 0.05;
            if (currentLegRotation >= maxLegRotation || currentLegRotation <= -maxLegRotation) {
                legRotationDirection *= -1;
                currentLegRotation = 0;
            }

            render();
            requestAnimationFrame(animateLegs);
        }
    }

    function animateJump() {
        velocityY += gravity;
        Robot.position.y += velocityY;

        if (Robot.position.y <= 0) {
            Robot.position.y = 0;
            velocityY = 0;
            isJumping = false;
        } else {
            requestAnimationFrame(animateJump);
        }
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    // 光源設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 初回レンダリング 
    render();
}
