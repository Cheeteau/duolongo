/* Variables */
const langsList = document.querySelector("#_langsList");
const langMd = document.querySelector("#_langMarkdown");

const markdownContents = {};
const available = [
    {
        name: "danois",
        emote: "🇩🇰"
    }
];

/* Functions */
function getMarkdowns(){
    return new Promise(async (res, rej) => {
        for (const markdown of available){
            const request = await fetch(`/dokyLangues/markdown/${markdown.name}.md`);
            const name = markdown.name;

            markdownContents[name] = await request.json();
        }

        return res();
    });
}

async function displayLanguages(){
    await getMarkdowns();
    console.log(markdownContents);
}

/* Main async function */
(async () => {
    displayLanguages();
})();