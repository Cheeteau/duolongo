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
function saveMarkdownData(){ window.localStorage.setItem("markdowns", markdownContents); }
function retrieveMarkdownData(){ return window.localStorage.getItem("markdowns"); }

function getMarkdowns(){
    return new Promise(async (res, rej) => {
        for (const markdown of available){
            const request = await fetch(`/dokyLangues/markdown/${markdown.name}.md`);
            const name = markdown.name;

            if (!retrieveMarkdownData()[name]) markdownContents[name] = request;
        }
    
        saveMarkdownData();
        return res();
    });
}

async function displayLanguages(){
    await getMarkdowns();
    console.log(markdownContents);
}

/* Main async function */
(async () => {
    if (markdownContents == null) saveMarkdownData() && window.location.reload();
    displayLanguages();
})();