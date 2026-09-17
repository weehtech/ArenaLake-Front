/* =========================================
   ARENALAKE — SOBRE
   JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    /*
    =====================================================================
    SISTEMA DE POSICIONAMENTO FÁCIL - SEÇÃO "02 — A IDEIA"
    =====================================================================
    
    COORDENADAS (escala 0-400):
    - Container: 400x400px
    - CORE central: (200, 200)
    - 1% = 4px em coordenadas SVG
    
    PARA POSICIONAR NÓS (HTML):
    - Nó w-10 h-10 = 40px
    - Centro do nó = posição + 20px em cada direção
    - Exemplo: top-[40px] left-[184px] → centro SVG = (204, 60)
    
    PARA ATUALIZAR LINHAS SVG:
    - x1, y1 = CORE (200, 200) - não mexa
    - x2, y2 = centro do nó correspondente (veja comentários no HTML)
    
    PARA ATUALIZAR BOLINHAS (JavaScript):
    - startX, startY = onde começa (CORE ou acima)
    - endX, endY = onde termina (mesmo valor de x2, y2 das linhas SVG)
    
    SEQUÊNCIA DE MUDANÇA:
    1. Mude posição do nó no HTML (top/left/right/bottom)
    2. Calcule centro: posição + 20px
    3. Atualize x2, y2 da linha SVG correspondente
    4. Atualize endX, endY da bolinha JavaScript correspondente
    =====================================================================
    */


    /* =========================================
       1. INTERACTIVE CORE
       ========================================= */

    const plataformaSection = document.getElementById('plataforma');
    const interactiveCore = document.getElementById('interactive-core');
    const coreNode = document.getElementById('core-node');
    const coreSvg = document.getElementById('core-svg');
    const lineHorizontal = document.getElementById('line-horizontal');
    const lineVertical = document.getElementById('line-vertical');
    const orbitCircle = document.getElementById('orbit-circle');

    if (plataformaSection && interactiveCore && coreNode && coreSvg) {

        plataformaSection.addEventListener('mousemove', (e) => {
            const rect = plataformaSection.getBoundingClientRect();
            const svgRect = coreSvg.getBoundingClientRect();

            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const offsetX = mouseX - centerX;
            const offsetY = mouseY - centerY;

            const limitedX = Math.max(-150, Math.min(150, offsetX));
            const limitedY = Math.max(-50, Math.min(50, offsetY));

            const scaleX = 600 / svgRect.width;
            const scaleY = 200 / svgRect.height;

            const svgX = (mouseX * scaleX);
            const svgY = (mouseY * scaleY);

            lineHorizontal.setAttribute('y1', svgY);
            lineHorizontal.setAttribute('y2', svgY);

            lineVertical.setAttribute('x1', svgX);
            lineVertical.setAttribute('x2', svgX);

            orbitCircle.setAttribute('cx', svgX);
            orbitCircle.setAttribute('cy', svgY);

            coreNode.style.position = 'absolute';
            coreNode.style.left = `${mouseX}px`;
            coreNode.style.top = `${mouseY}px`;
            coreNode.style.transform = 'translate(-50%, -50%)';
        });

        plataformaSection.addEventListener('mouseleave', () => {
            lineHorizontal.setAttribute('y1', 100);
            lineHorizontal.setAttribute('y2', 100);

            lineVertical.setAttribute('x1', 300);
            lineVertical.setAttribute('x2', 300);

            orbitCircle.setAttribute('cx', 300);
            orbitCircle.setAttribute('cy', 100);

            coreNode.style.position = 'relative';
            coreNode.style.left = 'auto';
            coreNode.style.top = 'auto';
            coreNode.style.transform = 'translate(0, 0)';
        });
    }


    /* =========================================
       2. PROBLEM ANIMATION
       ========================================= */

    const problemVisual = document.getElementById('problem-visual');
    const serverNodes = document.querySelectorAll('[data-server]');
    const connectionLines = document.querySelectorAll('.connection-line');
    const dataParticles = document.querySelectorAll('.data-particle');
    const dataBlocks = document.querySelectorAll('.data-block');
    let problemObserver = null;

    if (problemVisual && serverNodes.length > 0) {

        let animationStarted = false;

        problemObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !animationStarted) {
                        animationStarted = true;
                        setTimeout(startFragmentedAnimation, 1500);
                    }
                });
            },
            { threshold: 0.2 }
        );

        problemObserver.observe(problemVisual);

        function startFragmentedAnimation() {
            animateServerNodes();
            animateConnectionLines();
            animateDataBlocks();
            startChaoticParticleGeneration();
        }

        function animateServerNodes() {
            serverNodes.forEach((node, index) => {
                const indicator = node.querySelector('.status-indicator');
                const activity = node.getAttribute('data-activity');
                const overload = node.getAttribute('data-overload');

                if (indicator) {
                    let baseInterval = 2000;
                    let intensity = 0.4;

                    if (overload === 'true') {
                        baseInterval = 800;
                        intensity = 0.6;
                    } else if (activity === 'high') {
                        baseInterval = 1200;
                        intensity = 0.5;
                    } else if (activity === 'medium') {
                        baseInterval = 1800;
                        intensity = 0.45;
                    } else if (activity === 'low') {
                        baseInterval = 3000;
                        intensity = 0.3;
                    }

                    setInterval(() => {
                        const opacity = intensity + Math.random() * 0.3;
                        indicator.style.opacity = opacity;
                    }, baseInterval + index * 400);
                }
            });
        }

        function animateConnectionLines() {
            connectionLines.forEach((line, index) => {
                const baseOpacity = 0.2;
                setInterval(() => {
                    const opacity = baseOpacity + Math.random() * 0.15;
                    line.style.opacity = opacity;
                }, 2500 + index * 600);
            });
        }

        function animateDataBlocks() {
            dataBlocks.forEach((block, index) => {
                let baseSpeed = 1000;
                let amplitude = 3;

                if (index === 0) {
                    baseSpeed = 800;
                    amplitude = 5;
                } else if (index === 2) {
                    baseSpeed = 600;
                    amplitude = 4;
                }

                setInterval(() => {
                    const translateY = Math.sin(Date.now() / baseSpeed + index) * amplitude;
                    const translateX = Math.cos(Date.now() / (baseSpeed * 1.5) + index) * (amplitude * 0.5);
                    block.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';
                }, 50);
            });
        }

        function startChaoticParticleGeneration() {
            serverNodes.forEach((node, index) => {
                const container = node.querySelector('.particles-overflow');
                const activity = node.getAttribute('data-activity');
                const overload = node.getAttribute('data-overload');

                if (container) {
                    let particleCount = 0;
                    let maxParticles = 5;
                    let generationInterval = 800;

                    if (overload === 'true') {
                        maxParticles = 15;
                        generationInterval = 300;
                    } else if (activity === 'high') {
                        maxParticles = 10;
                        generationInterval = 500;
                    } else if (activity === 'medium') {
                        maxParticles = 7;
                        generationInterval = 700;
                    } else if (activity === 'low') {
                        maxParticles = 3;
                        generationInterval = 1500;
                    }

                    const interval = setInterval(() => {
                        if (particleCount >= maxParticles) {
                            clearInterval(interval);
                            return;
                        }

                        addChaoticParticle(container, activity, overload);
                        particleCount++;
                    }, generationInterval + Math.random() * 500);
                }
            });
        }

        function addChaoticParticle(container, activity, overload) {
            const particle = document.createElement('div');
            particle.className = 'chaotic-particle';

            const size = Math.random() * 3 + 1;
            const nodeWidth = container.parentElement.offsetWidth;
            const nodeHeight = container.parentElement.offsetHeight;

            const x = Math.random() * (nodeWidth - size);
            const y = Math.random() * (nodeHeight - size);

            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = '#58A6FF';
            particle.style.borderRadius = '50%';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.boxShadow = '0 0 3px rgba(88, 166, 255, 0.3)';
            particle.style.opacity = '0';
            particle.style.transition = 'opacity 0.3s ease-in';

            container.appendChild(particle);

            setTimeout(() => {
                particle.style.opacity = '0.7';
            }, 50);

            let chaosLevel = 1;
            if (overload === 'true') {
                chaosLevel = 3;
            } else if (activity === 'high') {
                chaosLevel = 2;
            } else if (activity === 'medium') {
                chaosLevel = 1.5;
            }

            animateChaoticParticle(particle, nodeWidth, nodeHeight, chaosLevel);
        }

        function animateChaoticParticle(particle, nodeWidth, nodeHeight, chaosLevel) {
            const duration = 2000 / chaosLevel;
            const startTime = Date.now();
            const startX = parseFloat(particle.style.left);
            const startY = parseFloat(particle.style.top);

            const randomDestX = Math.random() * (nodeWidth - 6);
            const randomDestY = Math.random() * (nodeHeight - 6);

            function updatePosition() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = 1 - Math.pow(1 - progress, 3);

                const currentX = startX + (randomDestX - startX) * easeProgress;
                const currentY = startY + (randomDestY - startY) * easeProgress;

                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';

                if (progress < 1) {
                    requestAnimationFrame(updatePosition);
                } else {
                    setTimeout(() => {
                        const newDestX = Math.random() * (nodeWidth - 6);
                        const newDestY = Math.random() * (nodeHeight - 6);
                        const currentX = parseFloat(particle.style.left);
                        const currentY = parseFloat(particle.style.top);

                        const newStartTime = Date.now();

                        function continueChaos() {
                            const newElapsed = Date.now() - newStartTime;
                            const newProgress = Math.min(newElapsed / duration, 1);

                            const newEaseProgress = 1 - Math.pow(1 - newProgress, 3);

                            particle.style.left = (currentX + (newDestX - currentX) * newEaseProgress) + 'px';
                            particle.style.top = (currentY + (newDestY - currentY) * newEaseProgress) + 'px';

                            if (newProgress < 1) {
                                requestAnimationFrame(continueChaos);
                            } else {
                                setTimeout(() => {
                                    animateChaoticParticle(particle, nodeWidth, nodeHeight, chaosLevel);
                                }, Math.random() * 500);
                            }
                        }

                        continueChaos();
                    }, Math.random() * 300);
                }
            }

            requestAnimationFrame(updatePosition);
        }

        function animateSVGParticles() {
            const svg = document.getElementById('fragmented-network');
            if (svg) {
                dataParticles.forEach((particle, index) => {
                    animateParticleAlongLine(particle, index);
                });
            }
        }

        function animateParticleAlongLine(particle, index) {
            const lines = [
                { x1: 80, y1: 100, x2: 200, y2: 250 },
                { x2: 420, y1: 80, x2: 300, y2: 200 }
            ];

            if (lines[index]) {
                const line = lines[index];
                let progress = 0;
                const duration = 4000 + index * 1000;
                const startTime = Date.now();

                function updateParticlePosition() {
                    const elapsed = Date.now() - startTime;
                    progress = (elapsed % duration) / duration;

                    const currentX = line.x1 + (line.x2 - line.x1) * progress;
                    const currentY = line.y1 + (line.y2 - line.y1) * progress;

                    particle.setAttribute('cx', currentX);
                    particle.setAttribute('cy', currentY);

                    requestAnimationFrame(updateParticlePosition);
                }

                updateParticlePosition();
            }
        }

        setTimeout(animateSVGParticles, 2000);
    }


    /* =========================================
       3. IDEA ANIMATION
       ========================================= */

    const ideaVisual = document.getElementById('idea-visual');
    const ideaNodes = document.querySelectorAll('[data-idea-node]');
    const meshLines = document.querySelectorAll('.mesh-line');
    const ideaSvg = document.getElementById('idea-connections');
    const abstractionCore = document.getElementById('abstraction-core');
    let ideaObserver = null;

    if (ideaVisual && ideaNodes.length > 0) {

        let ideaAnimationStarted = false;
        let animationLoops = [];

        ideaObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !ideaAnimationStarted) {
                        ideaAnimationStarted = true;
                        startIdeaAnimation();
                    }
                });
            },
            { threshold: 0.3 }
        );

        ideaObserver.observe(ideaVisual);

        function startIdeaAnimation() {
            setTimeout(() => {
                animateNodesAppearance();
            }, 500);
        }

        function animateNodesAppearance() {
            ideaNodes.forEach((node, index) => {
                node.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
                node.style.opacity = '0';
                node.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    node.style.opacity = '1';
                    node.style.transform = 'scale(1)';
                }, index * 150);
            });

            setTimeout(() => {
                animateMeshConnections();
            }, ideaNodes.length * 150 + 200);
        }

        function animateMeshConnections() {
            meshLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.transition = 'opacity 1.2s ease-in-out';
                    line.style.opacity = '0.3';

                    startConnectionPulse(line, index);
                }, index * 150);
            });

            setTimeout(() => {
                showAbstractionCore();
            }, meshLines.length * 150 + 300);

            setTimeout(() => {
                startDataFlow();
            }, meshLines.length * 150 + 600);
        }

        function startConnectionPulse(line, index) {
            const baseOpacity = 0.3;
            const pulseInterval = 3000 + index * 400;

            const pulseLoop = setInterval(() => {
                line.style.transition = 'opacity 0.9s ease-in-out';
                line.style.opacity = baseOpacity + 0.25;

                setTimeout(() => {
                    line.style.opacity = baseOpacity;
                }, 450);
            }, pulseInterval);

            animationLoops.push(pulseLoop);
        }

        function showAbstractionCore() {
            if (abstractionCore) {
                abstractionCore.style.transition = 'opacity 1.5s ease-in-out';
                abstractionCore.style.opacity = '0.4';

                startCorePulse();
            }
        }

        function startCorePulse() {
            if (!abstractionCore) return;

            const pulseLoop = setInterval(() => {
                abstractionCore.style.transition = 'opacity 1.2s ease-in-out';
                abstractionCore.style.opacity = '0.5';

                setTimeout(() => {
                    abstractionCore.style.opacity = '0.35';
                }, 600);
            }, 3000);

            animationLoops.push(pulseLoop);
        }

        function getRelativeCenter(element, container) {
            const el = element.getBoundingClientRect();
            const box = container.getBoundingClientRect();
            return {
                x: el.left + el.width / 2 - box.left,
                y: el.top + el.height / 2 - box.top
            };
        }

        function startDataFlow() {
            const htmlParticles = document.querySelectorAll('.data-particle-html');
            const plane = htmlParticles[0] && htmlParticles[0].parentElement;

            if (htmlParticles.length > 0 && plane && abstractionCore) {
                htmlParticles.forEach((particle, index) => {
                    particle.style.position = 'absolute';
                    particle.style.transform = 'translate(-50%, -50%)';
                    particle.style.pointerEvents = 'none';
                    particle.style.transition = 'none';

                    setTimeout(() => {
                        animateHtmlParticle(particle, plane, index);
                    }, index * 280);
                });
            }

            startNodePulses();
        }

        function animateHtmlParticle(particle, plane, index) {
            const node = ideaNodes[index];
            if (!particle || !plane || !node || !abstractionCore) {
                return;
            }

            const start = getRelativeCenter(abstractionCore, plane);
            const target = getRelativeCenter(node.querySelector('span') || node, plane);
            const dx = target.x - start.x;
            const dy = target.y - start.y;
            const dist = Math.hypot(dx, dy) || 1;
            const ux = dx / dist;
            const uy = dy / dist;

            const startX = start.x + ux * 10;
            const startY = start.y + uy * 10;
            const endX = target.x - ux * 4;
            const endY = target.y - uy * 4;

            const duration = 2000 + index * 160;
            let startTime = null;
            let arrived = false;
            let leftCore = false;

            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.opacity = '0';

            function updatePosition(now) {
                if (startTime === null) {
                    startTime = now;
                }

                const t = Math.min((now - startTime) / duration, 1);
                const currentX = startX + (endX - startX) * t;
                const currentY = startY + (endY - startY) * t;

                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';

                if (t < 0.08) {
                    particle.style.opacity = String((t / 0.08) * 0.95);
                } else if (t > 0.88) {
                    particle.style.opacity = String(((1 - t) / 0.12) * 0.95);
                } else {
                    particle.style.opacity = '0.95';
                }

                if (t < 0.12 && !leftCore) {
                    leftCore = true;
                    triggerCoreReaction();
                }

                if (t > 0.9 && !arrived) {
                    arrived = true;
                    triggerNodeReaction(index);
                }

                if (t < 1) {
                    requestAnimationFrame(updatePosition);
                } else {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        animateHtmlParticle(particle, plane, index);
                    }, 180 + Math.random() * 320);
                }
            }

            requestAnimationFrame(updatePosition);
        }

        function triggerNodeReaction(nodeIndex) {
            const node = ideaNodes[nodeIndex];
            if (!node) return;

            const innerDot = node.querySelector('span');
            if (innerDot) {
                innerDot.style.transition = 'all 0.4s ease-in-out';
                innerDot.style.transform = 'scale(1.4)';
                innerDot.style.boxShadow = '0 0 15px rgba(88, 166, 255, 0.7)';

                setTimeout(() => {
                    innerDot.style.transform = 'scale(1)';
                    innerDot.style.boxShadow = '0 0 8px rgba(88, 166, 255, 0.3)';
                }, 400);
            }
        }

        function triggerCoreReaction() {
            if (!abstractionCore) return;

            abstractionCore.style.transition = 'all 0.3s ease-in-out';
            abstractionCore.style.opacity = '0.6';
            abstractionCore.style.transform = 'translate(-50%, -50%) scale(1.05)';

            setTimeout(() => {
                abstractionCore.style.opacity = '0.4';
                abstractionCore.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        }



        function animateParticleAlongPath(particle, path, index) {
            let progress = 0;
            const duration = 3500 + Math.random() * 1000;
            const startTime = Date.now();

            particle.style.transition = 'opacity 0.5s ease-in-out';
            particle.style.opacity = '0.8';

            function updatePosition() {
                const elapsed = Date.now() - startTime;
                progress = (elapsed % duration) / duration;

                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const currentX = path.x1 + (path.x2 - path.x1) * easeProgress;
                const currentY = path.y1 + (path.y2 - path.y1) * easeProgress;

                particle.setAttribute('cx', currentX);
                particle.setAttribute('cy', currentY);

                if (progress < 1) {
                    requestAnimationFrame(updatePosition);
                } else {
                    setTimeout(() => {
                        animateParticleAlongPath(particle, path, index);
                    }, Math.random() * 500);
                }
            }

            requestAnimationFrame(updatePosition);
        }

        function startNodePulses() {
            ideaNodes.forEach((node, index) => {
                const innerDot = node.querySelector('span');
                if (innerDot) {
                    const pulseLoop = setInterval(() => {
                        innerDot.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
                        innerDot.style.opacity = '0.9';
                        innerDot.style.transform = 'scale(1.2)';

                        setTimeout(() => {
                            innerDot.style.opacity = '0.6';
                            innerDot.style.transform = 'scale(1)';
                        }, 300);
                    }, 2000 + index * 300);

                    animationLoops.push(pulseLoop);
                }
            });

            // Add hover interactions
            ideaNodes.forEach((node, index) => {
                node.addEventListener('mouseenter', () => {
                    highlightNode(index);
                });

                node.addEventListener('mouseleave', () => {
                    resetHighlight();
                });
            });
        }

        function highlightNode(nodeIndex) {
            // Dim other nodes
            ideaNodes.forEach((node, index) => {
                if (index !== nodeIndex) {
                    node.style.opacity = '0.4';
                    node.style.transform = 'scale(0.95)';
                }
            });

            // Highlight connected lines
            meshLines.forEach((line, index) => {
                line.style.transition = 'opacity 0.3s ease-in-out';
                line.style.opacity = '0.6';
            });

            // Highlight inner dot
            const activeNode = ideaNodes[nodeIndex];
            const innerDot = activeNode.querySelector('span');
            if (innerDot) {
                innerDot.style.transition = 'all 0.3s ease-in-out';
                innerDot.style.transform = 'scale(1.3)';
                innerDot.style.boxShadow = '0 0 12px rgba(88, 166, 255, 0.6)';
            }

            // Highlight core
            if (abstractionCore) {
                abstractionCore.style.transition = 'all 0.3s ease-in-out';
                abstractionCore.style.opacity = '0.6';
                abstractionCore.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        }

        function resetHighlight() {
            // Reset all nodes
            ideaNodes.forEach((node) => {
                node.style.opacity = '1';
                node.style.transform = 'scale(1)';
            });

            // Reset lines
            meshLines.forEach((line) => {
                line.style.opacity = '0.3';
            });

            // Reset inner dots
            ideaNodes.forEach((node) => {
                const innerDot = node.querySelector('span');
                if (innerDot) {
                    innerDot.style.transform = 'scale(1)';
                    innerDot.style.boxShadow = '0 0 8px rgba(88, 166, 255, 0.3)';
                }
            });

            // Reset core
            if (abstractionCore) {
                abstractionCore.style.opacity = '0.4';
                abstractionCore.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    }


    /* =========================================
       4. SCROLL REVEAL
       ========================================= */

    const revealOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
    };


    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        'is-visible'
                    );

                }

            });

        },
        revealOptions
    );


    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-fade, #pipeline-container'
    );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });



    /* =========================================
       5. ARCHITECTURE STACK
       ========================================= */

    const stackContainer =
        document.getElementById('iso-stack');


    const layerTriggers =
        document.querySelectorAll('[data-layer]');


    if (
        stackContainer &&
        layerTriggers.length > 0
    ) {


        /* =========================================
           2.1 STACK OBSERVER
           ========================================= */

        const stackObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            stackContainer.classList.add(
                                'is-visible'
                            );

                        }

                    });

                },
                {
                    threshold: 0.1
                }
            );


        stackObserver.observe(stackContainer);



        /* =========================================
           2.2 HOVER INTERACTION
           ========================================= */

        layerTriggers.forEach((trigger) => {


            trigger.addEventListener(
                'mouseenter',
                () => {

                    const layerId =
                        trigger.getAttribute(
                            'data-layer'
                        );


                    const targetLayer =
                        stackContainer.querySelector(
                            `.iso-layer-${layerId}`
                        );


                    if (!targetLayer) {
                        return;
                    }


                    /* Reduz opacidade das outras camadas */

                    stackContainer
                        .querySelectorAll('.iso-layer')
                        .forEach((layer) => {

                            layer.style.opacity = '0.3';

                        });


                    /* Destaca a camada */

                    targetLayer.style.opacity = '1';


                    targetLayer.style.transform =
                        `translateZ(${layerId * 50 + 10}px) scale(1.05)`;

                }
            );


            trigger.addEventListener(
                'mouseleave',
                () => {

                    /* Restaura opacidade */

                    stackContainer
                        .querySelectorAll('.iso-layer')
                        .forEach((layer) => {

                            layer.style.opacity = '1';

                        });


                    /* Restaura posição original */

                    const layers =
                        stackContainer.querySelectorAll(
                            '.iso-layer'
                        );


                    layers.forEach((layer, index) => {

                        const layerNumber =
                            index + 1;


                        const translateZ =
                            layerNumber === 1
                                ? 0
                                : layerNumber * 50;


                        layer.style.transform =
                            `translateZ(${translateZ}px)`;

                    });

                }
            );

        });

    }



    /* =========================================
       6. SMOOTH SCROLL
       ========================================= */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            'click',
            (event) => {

                const targetId =
                    link.getAttribute('href');


                if (
                    !targetId ||
                    targetId === '#'
                ) {
                    return;
                }


                const target =
                    document.querySelector(targetId);


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }
        );

    });



    /* =========================================
       7. NAVBAR ON SCROLL
       ========================================= */

    const navbar =
        document.querySelector('nav');


    if (navbar) {

        window.addEventListener(
            'scroll',
            () => {

                if (window.scrollY > 30) {

                    navbar.classList.add(
                        'navbar-scrolled'
                    );

                } else {

                    navbar.classList.remove(
                        'navbar-scrolled'
                    );

                }

            },
            {
                passive: true
            }
        );

    }



    /* =========================================
       8. TRANSIÇÃO SUAVE DE BACKGROUND POR SEÇÃO
       ========================================= */

    const dynamicSections = document.querySelectorAll('section[data-bg]');
    let bgObserver = null;
    let currentIntersectingSection = null;

    const applySectionBg = (section) => {
        if (!section) return;
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            const bg = section.getAttribute('data-bg');
            const glow = section.getAttribute('data-glow');
            if (bg) {
                document.documentElement.style.setProperty('--current-bg', bg);
                document.body.style.setProperty('--current-bg', bg);
            }
            if (glow) {
                document.documentElement.style.setProperty('--current-glow', glow);
            }
        } else {
            // No modo claro, remove as cores escuras inline para respeitar o design system do :root
            document.documentElement.style.removeProperty('--current-bg');
            document.body.style.removeProperty('--current-bg');
            document.documentElement.style.setProperty('--current-glow', 'rgba(29, 78, 216, 0.04)');
        }
    };

    if (dynamicSections.length > 0) {
        bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentIntersectingSection = entry.target;
                    applySectionBg(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        });

        dynamicSections.forEach(sec => bgObserver.observe(sec));

        // Reage à alternância de tema em tempo real
        window.addEventListener('arenaThemeChanged', () => {
            if (currentIntersectingSection) {
                applySectionBg(currentIntersectingSection);
            } else if (dynamicSections.length > 0) {
                applySectionBg(dynamicSections[0]);
            }
        });
    }



    /* =========================================
       9. CLEANUP OBSERVERS
       ========================================= */

    window.addEventListener(
        'beforeunload',
        () => {
            revealObserver.disconnect();

            if (problemObserver) {
                problemObserver.disconnect();
            }

            if (ideaObserver) {
                ideaObserver.disconnect();
            }

            if (bgObserver) {
                bgObserver.disconnect();
            }
        }
    );

});