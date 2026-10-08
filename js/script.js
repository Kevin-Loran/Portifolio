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


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `nav a[href="#${entry.target.id}"]`
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}, {
    threshold: 0.5
});

sections.forEach((section) => {
    observer.observe(section);
});

if (texto) {
    digitar();
}