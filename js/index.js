/* Variables */
const langsList = document.querySelector("#_langsList");
const langMd = document.querySelector("#_langMarkdown");

const markdownContents = {};
const available = [
    {
        name: "danois",
        emoji: "🇩🇰"
    }
];

/* Functions */
function getMarkdowns(){
    return new Promise(async (res, rej) => {
        for (const markdown of available){
            const request = await (await fetch(`/dokyLangues/markdown/${markdown.name}.md`)).text();
            const name = markdown.name;

            markdownContents[name] = request;
        }
        return res();
    });
}

function getTwitterFlagFromEmoji(emoji){
    const emojiFirst = emoji.codePointAt(0).toString(16);
    const emojiSecond = emoji.codePointAt(2).toString(16);
    return `https://abs-0.twimg.com/emoji/v2/svg/${emojiFirst}-${emojiSecond}.svg`;
}

function displayMarkdown(lang){
    const markdown = markdownContents[lang];
    console.log(markdown);
}

async function displayLanguages(){
    await getMarkdowns();
    
    for (const lang of available){
        const li = document.createElement("li");
        const langName = lang.name.charAt(0).toUpperCase() + lang.name.substring(1);

        li.innerHTML = `<img class="flags" src="${getTwitterFlagFromEmoji(lang.emoji)}"> ${langName}`;
        li.addEventListener("click", () => displayMarkdown(lang.name));

        langsList.append(li);
    }
}

/* Main async function */
(async () => {
    displayLanguages();
    console.log(markdownContents);
})();