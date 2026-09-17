document.addEventListener("DOMContentLoaded", () => {
    const dots = document.querySelectorAll(".dot");
    const slides = document.querySelectorAll(".carousel-slide");
    const nodes = document.querySelectorAll('.net-node.orbit');

    if (!dots.length || !slides.length) return;

    // --- VARIÁVEIS PARA O AUTOPLAY ---
    let currentIndex = 0;          
    const intervalTime = 2500;     // Tempo: 5000ms = 5 segundos
    let slideTimer;                

    // Sincroniza o brilho do nó no mapa com o slide atual
    function highlightNodeFromSlide(index) {
        // Apaga todos primeiro
        nodes.forEach(n => n.classList.remove('highlighted'));
        
        // Pega o ID do nó mapeado na bolinha atual
        const targetId = dots[index].getAttribute('data-target-node');
        
        if (targetId) {
            const targetNode = document.getElementById(targetId);
            if (targetNode) {
                targetNode.classList.add('highlighted'); // Acende o correto
            }
        }
    }

    // Muda o slide e atualiza as bolinhas
    function goToSlide(index) {
        currentIndex = index; 

        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        slides[index].classList.add("active");
        dots[index].classList.add("active");

        highlightNodeFromSlide(index);
    }

    // --- FUNÇÕES DE TEMPO ---
    
    // Avança para o próximo slide
    function nextSlide() {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Se chegar no fim, volta para o começo
        }
        goToSlide(currentIndex);
    }

    // Inicia o timer
    function startCarousel() {
        slideTimer = setInterval(nextSlide, intervalTime);
    }

    // Zera o timer se o usuário clicar manualmente
    function resetCarousel() {
        clearInterval(slideTimer);
        startCarousel();
    }

    // Evento de clique nas bolinhas
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetCarousel(); 
        });
    });

    // Inicia tudo no carregamento da página
    highlightNodeFromSlide(0);
    startCarousel();
});