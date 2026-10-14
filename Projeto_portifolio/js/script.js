const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");
const texto = document.querySelector("#texto-digitado");

const cargos = [
    "Desenvolvedor Backend",
    "Desenvolvedor FullStack",
    "Engenheiro de Software"
];

let indiceCargo = 0;
let apagando = false;

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");

    if(window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

function digitar() {
    const cargoAtual = cargos[indiceCargo];
    const textoAtual = texto.textContent;

    if (!apagando) {
        // Adiciona uma letra
        texto.textContent = cargoAtual.substring(0, textoAtual.length + 1);

        if (texto.textContent === cargoAtual) {
            apagando = true;
            setTimeout(digitar, 1500);
            return;
        }

        setTimeout(digitar, 100);
    } else {
        // Remove uma letra
        texto.textContent = textoAtual.substring(0, textoAtual.length - 1);

        if (texto.textContent.length === 0) {
            apagando = false;
            indiceCargo = (indiceCargo + 1) % cargos.length;
            setTimeout(digitar, 300);
            return;
        }

        setTimeout(digitar, 50);
    }
}

function atualizarNavegacao() {
    const header = document.querySelector("header");
    const pontoAtivacao = window.scrollY + header.offsetHeight + 80;

    let secaoAtual = sections[0];

    sections.forEach((section) => {
        if (section.offsetTop <= pontoAtivacao) {
            secaoAtual = section;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
    });

    if (secaoAtual) {
        const linkAtivo = document.querySelector(
            `nav a[href="#${secaoAtual.id}"]`
        );

        if (linkAtivo) {
            linkAtivo.classList.add("active");
            linkAtivo.setAttribute("aria-current", "true");
        }
    }
}

window.addEventListener("scroll", atualizarNavegacao);
window.addEventListener("resize", atualizarNavegacao);

atualizarNavegacao();

// Menu mobile (visível apenas em telas estreitas; o CSS decide quando aparece)
const cabecalho = document.querySelector("header");
const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector("#menu-principal");
const telaLarga = window.matchMedia("(min-width: 768px)");

function definirMenu(aberto) {
    cabecalho.classList.toggle("menu-aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}

if (cabecalho && botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", () => {
        definirMenu(!cabecalho.classList.contains("menu-aberto"));
    });

    // Fecha o menu depois de escolher uma seção.
    navLinks.forEach((link) => {
        link.addEventListener("click", () => definirMenu(false));
    });

    // Esc fecha o menu e devolve o foco ao botão.
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && cabecalho.classList.contains("menu-aberto")) {
            definirMenu(false);
            botaoMenu.focus();
        }
    });

    // Clique/toque fora do cabeçalho fecha o menu.
    document.addEventListener("click", (evento) => {
        if (cabecalho.classList.contains("menu-aberto") && !cabecalho.contains(evento.target)) {
            definirMenu(false);
        }
    });

    // Se o foco sair do cabeçalho (Tab), o menu fecha.
    cabecalho.addEventListener("focusout", (evento) => {
        if (evento.relatedTarget && !cabecalho.contains(evento.relatedTarget)) {
            definirMenu(false);
        }
    });

    // Ao voltar para a navegação horizontal, garante o estado "fechado".
    telaLarga.addEventListener("change", (evento) => {
        if (evento.matches) {
            definirMenu(false);
        }
    });
}

if (texto) {
    digitar();
}

const carrossel = document.querySelector(".projetos-carrossel");
const trilho = document.querySelector(".projetos-trilho");
const botaoAnterior = document.querySelector(".projetos-seta-anterior");
const botaoProximo = document.querySelector(".projetos-seta-proximo");

if (carrossel && trilho && botaoAnterior && botaoProximo) {
    const cartoes = trilho.querySelectorAll(".projeto-card");
    let indiceAtual = 0;

    function atualizarCarrossel() {
        if (cartoes.length === 0) return;

        const larguraVisivel = carrossel.clientWidth;
        const estiloTrilho = getComputedStyle(trilho);
        const espacamento = parseFloat(estiloTrilho.gap) || 0;

        // Posição real do card selecionado dentro do trilho.
        const posicaoCard = cartoes[indiceAtual].offsetLeft;
        const larguraCard = cartoes[indiceAtual].offsetWidth;

        // Calcula o deslocamento necessário para centralizar o card.
        const centroCard = posicaoCard + larguraCard / 2;
        const centroCarrossel = larguraVisivel / 2;
        const deslocamento = centroCard - centroCarrossel;

        // Atualiza a posição do trilho.
        trilho.style.transform = `translateX(${-deslocamento}px)`;

        // Destaca apenas o card selecionado.
        cartoes.forEach((card, indice) => {
            card.classList.toggle(
                "card-destaque",
                indice === indiceAtual
            );
        });

        botaoAnterior.disabled = indiceAtual === 0;
        botaoProximo.disabled = indiceAtual === cartoes.length - 1;
    }

    botaoAnterior.addEventListener("click", () => {
        if (indiceAtual > 0) {
            indiceAtual--;
            atualizarCarrossel();
        }
    });

    botaoProximo.addEventListener("click", () => {
        if (indiceAtual < cartoes.length - 1) {
            indiceAtual++;
            atualizarCarrossel();
        }
    });

    // Swipe horizontal em telas sensíveis ao toque.
    let toqueInicialX = 0;
    let toqueInicialY = 0;

    carrossel.addEventListener("touchstart", (evento) => {
        toqueInicialX = evento.changedTouches[0].clientX;
        toqueInicialY = evento.changedTouches[0].clientY;
    }, { passive: true });

    carrossel.addEventListener("touchend", (evento) => {
        const deltaX = evento.changedTouches[0].clientX - toqueInicialX;
        const deltaY = evento.changedTouches[0].clientY - toqueInicialY;

        // Só conta como swipe se for claramente horizontal.
        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;

        if (deltaX < 0 && indiceAtual < cartoes.length - 1) {
            indiceAtual++;
        } else if (deltaX > 0 && indiceAtual > 0) {
            indiceAtual--;
        } else {
            return;
        }

        atualizarCarrossel();
    }, { passive: true });

    // Navegação por teclado: ao focar um link de um card fora da área visível,
    // o carrossel centraliza esse card (e não deixa o navegador rolar o contêiner).
    cartoes.forEach((card, indice) => {
        card.addEventListener("focusin", () => {
            carrossel.scrollLeft = 0;

            if (indice !== indiceAtual) {
                indiceAtual = indice;
                atualizarCarrossel();
            }
        });
    });

    window.addEventListener("resize", atualizarCarrossel);

    atualizarCarrossel();
}