/* Variables */
const langsList = document.querySelector("#_langsList");
const langMd = document.querySelector("#_langMarkdown");
const contentTable = document.querySelector("#_contentTable");
const loadingScreen = document.querySelector("#_loadingScreen");
const buttons = document.querySelectorAll("button.tel");

const markdownContents = [];
const available = [
    {
        name: "accueil",
        emoji: "🇫🇷"
    },
    {
        name: "danois",
        emoji: "🇩🇰"
    },
    {
        name: "russe",
        emoji: "🇷🇺"
    },
    {
        name: "allemand",
        emoji: "🇩🇪"
    },
    {
        name: "turc",
        emoji: "🇹🇷"
    }
];

const converter = new showdown.Converter({
    tables: true
});


/* Fonction */
/**
 * [MOBILE] Permet d'ouvrir le aside contenant la liste des langages sur téléphone
 * @param {HTMLElement} aside Élement html du aside
 */
 function openAside(aside){
    // Cache la section contenant le markdown
    langMd.style.setProperty("width", "0", "important");
    langMd.style.setProperty("padding", "0", "important");

    // Montre le aside (Et ajoute un event pour fermer le aside lors d'un clique sur un li)
    aside.style.setProperty("width", "100vw", "important");
    aside.querySelectorAll("li").forEach(e => e.addEventListener("click", () => closeAside(aside)));
}


/**
 * [MOBILE] Permet de fermer le aside contenant la liste des langages sur téléphone
 * @param {HTMLElement} aside Élement html du aside
 */
function closeAside(aside){
    // Montre la section contenant le markdown
    langMd.style.setProperty("width", "100vw", "important");
    langMd.style.setProperty("padding", "3vh 6vw", "important");

    // Cache le aside
    aside.style.setProperty("width", "0", "important");
}


/**
 * Récupère le contenu de tous les fichiers markdowns enregistrés à partir de la variable "available"
 * @returns Retourne un promise pour indiquer que tous les fichiers markdowns sont enregistrés
 */
function getMarkdowns(){
    return new Promise(async (res, rej) => {
        // Parcours les markdowns à partir de la variable "available"
        for (const markdown of available){
            const name = markdown.name; // Nom du markdown

            // Récupère chacun des fichiers markdown
            const request = await (await fetch(`/duolongo/markdown/${name}.md`)).text();
            
            // API github => Permet de récupérer le dernier commit fait sur le fichier afin d'afficher la dernière fois qui a été mit à jour
            const commits = await (await fetch(`https://api.github.com/repos/cozax/duolongo/commits?path=markdown/${name}.md&page=1&per_page=1`)).json();
            const lastDate = commits[0].commit.author.date; // Date du commit

            // Ajoute toutes les infos dans un objet
            const markdownObject = {
                name: name,
                data: request,
                lastUpdate: lastDate
            }

            // Le push dans une variable contenant tous les markdowns
            markdownContents.push(markdownObject);
        }
        return res();
    });
}


/**
 * Permet de scroll directement sur un élément défini par son ID
 * @param {string} id Id de l'élément sur lequel on veut scroll
 */
function scrollToElement(id){
    id.toLowerCase().replace(/[^\w\s]+/gi, '');

    const element = document.getElementById(id.replace(/ +/g, "")); // Récupère l'élément par son id
    const topPos = element.offsetTop; // Calcule sa position Y
    langMd.scroll(0, topPos - 50); // Scroll sur celui-ci
}


/**
 * Permet de récupérer l'url twitter des emojis drapeau
 * @param {string} emoji Emoji son forme de string
 * @returns L'url de l'émoji twitter associé au drapeau
 */
function getTwitterFlagFromEmoji(emoji){
    // Récupère les codes des caractères de l'émoji drapeau "emoji" pour trouver son url twitter
    const emojiFirst = emoji.codePointAt(0).toString(16);
    const emojiSecond = emoji.codePointAt(2).toString(16);
    return `https://abs-0.twimg.com/emoji/v2/svg/${emojiFirst}-${emojiSecond}.svg`;
}


/**
 * Calcule le nombre de jours entre deux dates
 * @param {Date} date1 Date initiale
 * @param {Date} date2 Date de fin
 */
function numberOfDays(date1, date2){
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // Retourne la différence en jours (Arrondi)
    return Math.floor(diffInDays);
}


/**
 * Permet d'afficher le contenu du markdown en html à partir de l'argument langue
 * @param {string} lang Langue à afficher sur la section
 */
function displayMarkdown(lang){
    // Convertit le markdown de la langue séléctionnée en HTML
    const markdown = markdownContents.filter(markdown => markdown.name == lang)[0];
    const html = converter.makeHtml(markdown.data);

    // Vide la table de contenu et de la section contenant le markdown puis scroll tout en haut de celle-ci
    contentTable.innerHTML = "";
    langMd.innerHTML = "";
    langMd.scroll(0, 0);

    // Ajoute le bouton pour ouvrir le aside (Visible uniquement sur téléphone) et lui permet d'ouvrir le aside lors d'un clic sur celui-ci
    langMd.innerHTML += `<button class="tel" id="left"><i class="zmdi zmdi-chevron-left"></i></button>`;
    document.querySelector("#left").addEventListener("click", () => {
        const aside = document.querySelector("aside:not(#content)"); // Séléctionne le aside de gauche
        openAside(aside);
    });

    // Affiche la date de la dernière mise a jour du markdown
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const _date = new Date(markdown.lastUpdate);
    langMd.innerHTML += `<article id="lastUpdateInfos">Last updated: <b>${months[_date.getMonth()]}, ${_date.getDate()}. ${_date.getFullYear()}</b> [${numberOfDays(_date, new Date())} day(s) ago]</article>`

    // Ajoute le html
    langMd.innerHTML += html;

    // Créer un input type search pour rechercher un mot en particulier
    const langMaj = lang.charAt(0).toUpperCase() + lang.substring(1);
    const inputSearch = document.createElement("input");
    inputSearch.type = "text";
    inputSearch.placeholder = `Search for a word (Français/${langMaj})`;

    // Quand l'utilisateur tappe un mot
    inputSearch.addEventListener("keyup", () => {
        document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
        
        const value = inputSearch.value.replace(" ", "");
        if(value.length == 0) return langMd.scroll(0, 0);

        // Récupère un élément avec ce mot
        const valueWithMaj = value.charAt(0).toUpperCase() + value.substr(1);
        const elements = [...document.querySelectorAll("td")].filter(e => e.innerHTML.includes(valueWithMaj));
        const element = elements[0];

        // Si l'élément existe
        if (element != undefined){
            element.scrollIntoView();
            element.parentNode.classList.add("selected");
        }else{
            return langMd.scroll(0, 0);
        }
    });

    contentTable.append(inputSearch);

    // Va ajouter tous les headers à la table de contenu afin de permettre à l'utilisateur d'y accéder plus rapidement
    langMd.querySelectorAll("h1, h2, h3, h4, h5").forEach(element => {
        if (!element.id) return; // Si l'élément n'a pas d'id, on ignore

        // Créer un li pour chaque header
        const li = document.createElement("li");
        li.textContent = element.innerHTML.toUpperCase().replace(/[^\w\s]/gi, "");
        li.addEventListener("click", () => scrollToElement(li.textContent.toLowerCase())); // Scroll vers le header lors d'un clic sur le li lui correspondant

        contentTable.append(li); // Ajoute le li dans le ul de la table de contenu
    });
}


/**
 * Permet d'afficher la liste des langages dans le aside gauche
 */
async function displayLanguages(){
    await getMarkdowns(); // Récupère le contenu des markdowns
    
    // Affiche la liste des langues dans le aside en parcourant "available"
    for (const lang of available){
        const li = document.createElement("li");
        const langName = lang.name.charAt(0).toUpperCase() + lang.name.substring(1);

        li.innerHTML = `<img class="flags" src="${getTwitterFlagFromEmoji(lang.emoji)}"> ${langName}`; // Récupère l'émoji twitter à partir de l'émoji stocké dans "lang"
        li.addEventListener("click", () => displayMarkdown(lang.name)); // Affiche le contenu du markdown lors d'un clique sur le li

        langsList.append(li);
    }
    langsList.children[0].click(); // Clique le premier élément

    // Cache l'écran de chargement une fois le contenu des markdowns chargés et les langues ajoutées au aside
    loadingScreen.classList.add("loaded");
}


/* Fonction appelée lors du démarrage de la page */
displayLanguages();