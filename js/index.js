/* Variables */
const langsList = document.querySelector("#_langsList");
const langMd = document.querySelector("#_langMarkdown");

const markdownContents = {};
const available = [
    "🇩🇰.danois.md"
];

/* Functions */
function saveMarkdownData(){ window.localStorage.setItem("markdowns", markdownContents); }
function retrieveMarkdownData(){ return window.localStorage.getItem("markdowns"); }

function getMarkdowns(){
    return new Promise(async (res, rej) => {
        for (const markdown of available){
            const request = await fetch(`/markdown/${markdown}`);
            const name = markdown.split(".")[1];
    
            if (!retrieveMarkdownData()[name] || retrieveMarkdownData() == null) markdownContents[name] = request;
        }
    
        saveMarkdownData();
        return res();
    });
}

async function displayLanguages(){
    const get = await getMarkdowns();
    console.log(markdownContents);
}

/* Main async function */
(async () => {
    if (markdownContents == null) saveMarkdownData();
    displayLanguages();
})();