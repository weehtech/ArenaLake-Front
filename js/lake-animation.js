document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') return;

    // AUMENTO DE DENSIDADE
    const SEPARATION = 12;
    const AMOUNTX = 380;
    const AMOUNTY = 380;

    let camera, scene, renderer, particles, lines, materialParticles, materialLines, count = 0;
    let colorsDark, colorsLight;

    /**
     * Calibra materiais, névoa e paleta de cores das ondas do mar para cada tema
     */
    function applyThemeToLake(isDark) {
        if (!scene) return;

        // 1. Névoa do horizonte
        if (scene.fog) {
            scene.fog.color.setHex(isDark ? 0x121620 : 0xf8fafc);
            scene.fog.density = isDark ? 0.00075 : 0.00045;
        }

        // 2. Buffer de cores das partículas (atualização in-place de alta performance)
        if (particles && particles.geometry && particles.geometry.attributes.color && colorsDark && colorsLight) {
            const activeColors = isDark ? colorsDark : colorsLight;
            particles.geometry.attributes.color.array.set(activeColors);
            particles.geometry.attributes.color.needsUpdate = true;
        }

        // 3. Material das partículas (Bolinhas)
        if (materialParticles) {
            if (isDark) {
                materialParticles.blending = THREE.AdditiveBlending;
                materialParticles.opacity = 0.22;
                materialParticles.size = 5.5;
            } else {
                // No modo claro: NormalBlending suave, discreto e elegante
                materialParticles.blending = THREE.NormalBlending;
                materialParticles.opacity = 0.38;
                materialParticles.size = 5.0;
            }
            materialParticles.needsUpdate = true;
        }

        // 4. Material das linhas de conexão
        if (materialLines) {
            if (isDark) {
                materialLines.color.setHex(0x00d2ff);
                materialLines.opacity = 0.08;
            } else {
                // No modo claro: linhas de rede oceânicas sutis e refinadas
                materialLines.color.setHex(0x0284c7);
                materialLines.opacity = 0.14;
            }
            materialLines.needsUpdate = true;
        }
    }

    function init() {
        camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 400;
        camera.position.z = 1500;
        camera.rotation.x = -0.40;

        scene = new THREE.Scene();

        const isInitialDark = document.documentElement.classList.contains('dark');
        scene.fog = new THREE.FogExp2(isInitialDark ? 0x121620 : 0xf8fafc, isInitialDark ? 0.00075 : 0.00045);

        const numParticles = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(numParticles * 3);
        colorsDark = new Float32Array(numParticles * 3);
        colorsLight = new Float32Array(numParticles * 3);

        // Paleta Dark (Brilhante com AdditiveBlending no fundo escuro)
        const darkCiano = new THREE.Color(0x00d2ff);
        const darkLaranja = new THREE.Color(0xf39200);
        const darkAzulBase = new THREE.Color(0x0a1529);

        // Paleta Light (Tons oceânicos de alto contraste no fundo claro #F8FAFC)
        const lightAzulBase = new THREE.Color(0x1e3a8a); // Azul marinho profundo
        const lightCiano = new THREE.Color(0x0284c7);    // Azul oceano vibrante
        const lightLaranja = new THREE.Color(0xd97706);  // Âmbar corporativo

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                positions[i + 1] = -250;
                positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);

                const rand = Math.random();
                let cDark, cLight;
                if (rand > 0.985) {
                    cDark = darkLaranja;
                    cLight = lightLaranja;
                } else if (rand > 0.82) {
                    cDark = darkCiano;
                    cLight = lightCiano;
                } else {
                    cDark = darkAzulBase;
                    cLight = lightAzulBase;
                }

                colorsDark[i] = cDark.r;
                colorsDark[i + 1] = cDark.g;
                colorsDark[i + 2] = cDark.b;

                colorsLight[i] = cLight.r;
                colorsLight[i + 1] = cLight.g;
                colorsLight[i + 2] = cLight.b;

                i += 3;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(isInitialDark ? colorsDark : colorsLight), 3));

        materialParticles = new THREE.PointsMaterial({
            vertexColors: true,
            size: isInitialDark ? 5.5 : 5.0,
            transparent: true,
            opacity: isInitialDark ? 0.22 : 0.38,
            blending: isInitialDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, materialParticles);
        scene.add(particles);

        // Linhas de rede distribuída
        const numLines = (AMOUNTX - 1) * (AMOUNTY - 1) * 2;
        const indicesLine = new Int32Array(numLines * 2);
        let lineIdx = 0;

        for (let ix = 0; ix < AMOUNTX - 1; ix++) {
            for (let iy = 0; iy < AMOUNTY - 1; iy++) {
                if (Math.random() > 0.85) {
                    indicesLine[lineIdx * 2] = ix * AMOUNTY + iy;
                    indicesLine[lineIdx * 2 + 1] = (ix + 1) * AMOUNTY + iy;
                    lineIdx++;
                }
                if (Math.random() > 0.85) {
                    indicesLine[lineIdx * 2] = ix * AMOUNTY + iy;
                    indicesLine[lineIdx * 2 + 1] = ix * AMOUNTY + (iy + 1);
                    lineIdx++;
                }
            }
        }

        const geometryLine = new THREE.BufferGeometry();
        geometryLine.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometryLine.setIndex(new THREE.BufferAttribute(indicesLine, 1));

        materialLines = new THREE.LineBasicMaterial({
            color: isInitialDark ? 0x00d2ff : 0x0284c7,
            transparent: true,
            opacity: isInitialDark ? 0.08 : 0.14
        });

        lines = new THREE.LineSegments(geometryLine, materialLines);
        scene.add(lines);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize);

        // Sincronização em tempo real quando o tema for alternado
        window.addEventListener('arenaThemeChanged', (e) => {
            const isDark = e.detail && e.detail.theme === 'dark';
            applyThemeToLake(isDark);
        });

        // Observer do elemento HTML para alterações de classe de tema instantâneas
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                const isDark = document.documentElement.classList.contains('dark');
                applyThemeToLake(isDark);
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        const positions = particles.geometry.attributes.position.array;
        let i = 1; // Eixo Y

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Ondas orgânicas do lago de dados
                const wave1 = Math.sin((ix + count) * 0.18) * 20;
                const wave2 = Math.cos((iy + count) * 0.12) * 15;
                const grandSwell = Math.sin((ix + iy + count * 0.4) * 0.04) * 35;

                const yPosition = -250 + wave1 + wave2 + grandSwell;

                positions[i] = yPosition;
                i += 3;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);

        count += 0.035;
    }

    init();
    animate();
});