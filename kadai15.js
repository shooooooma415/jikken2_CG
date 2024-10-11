window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = 1700;
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
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(50, 50, -100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const headMaterial = new THREE.MeshNormalMaterial({
        color: 0xff0000
    });
    const eyesMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff46
    });
    const mouseMaterial = new THREE.MeshStandardMaterial({
        color: 0x464646
    });
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff
    });
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff
    });
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00
    });
    const cannonMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555
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

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 3), mouseMaterial);
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

    // 大砲の作成
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

    let isWalking = false;
    let isJumping = false;
    let currentLegRotation = 0;
    let legRotationDirection = 1;
    let maxLegRotation = Math.PI / 8;
    let maxArmRotation = Math.PI / 2;

    let velocityY = 0;
    const gravity = -0.05;
    const jumpStrength = 1.5;

    let bullets = [];

    let sword = null;
    let isSwordEquipped = false;
    let isTalking = false;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("mousemove", onDocumentMouseMove, false);

    function onDocumentKeyDown(event_k) {
        let keyCode = event_k.which;
        if (keyCode == 87) {
            isWalking = !isWalking;
            if (isWalking) {
                animateLegsAndArms();
            }
        }
        if (keyCode == 74 && !isJumping) {
            isJumping = true;
            velocityY = jumpStrength;
            animateJump();
        }
        if (keyCode == 65) {
            fireBullet();
        }
        if (keyCode === 83) {
            equipSword();
            startTalking();
        }
        if (keyCode === 32) {
            swingSword(); // スペースキーで剣を振る
        }
    }

    function onDocumentMouseMove(event_m) {
        mouseX = (event_m.clientX / window.innerWidth) * 2 - 1;
        targetRotation = mouseX * Math.PI;
    }

    function animateLegsAndArms() {
        if (isWalking) {
            leftLeg.rotation.x += legRotationDirection * 0.05;
            rightLeg.rotation.x -= legRotationDirection * 0.05;
            currentLegRotation += 0.05;

            leftArm.rotation.x -= legRotationDirection * 0.05;
            rightArm.rotation.x += legRotationDirection * 0.05;

            if (leftArm.rotation.x > maxArmRotation) {
                leftArm.rotation.x = maxArmRotation;
            } else if (rightArm.rotation.x > maxArmRotation) {
                rightArm.rotation.x = maxArmRotation;
            }

            if (currentLegRotation >= maxLegRotation || currentLegRotation <= -maxLegRotation) {
                legRotationDirection *= -1;
                currentLegRotation = 0;
            }

            Robot.rotation.y += (targetRotation - Robot.rotation.y) * 0.05;

            Robot.position.z -= Math.cos(Robot.rotation.y) * 0.2;
            Robot.position.x -= Math.sin(Robot.rotation.y) * 0.2;

            render();
            requestAnimationFrame(animateLegsAndArms);
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
        }else{
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

    function render() {
        renderer.render(scene, camera);
    }

    // 光源設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 弾丸アニメーションを開始
    animateBullets();

    // 初回レンダリング 
    render();
}
