//@ts-check
const { addPreviewModeDataElements, getPostJsonFromWordpress } = require("@cagov/11ty-serverless-preview-mode");

const wordPressSettings = {
    wordPressSite: "https://as-go-covid19-d-001.azurewebsites.net", //Wordpress endpoint
    //previewWordPressTagSlug: 'preview-mode' // optional filter for digest list of preview in Wordpress
}

class previewModePageClass {
    /**
     * First, mostly static.  Returns the frontmatter data.
     */
    async data() {
        return {
            layout: "page", //Or whatever layout the preview page should have
            tags: ["do-not-crawl"], //Or whatever tags the preview page should have,
            author: "State of California",
            addtositemap: true,
            ...addPreviewModeDataElements()
        };
    }

    /**
     * Last, after the frontmatter data is loaded.  Able to render the page.
     * @param {{ title: string; publishdate: string; meta: string; eleventy: { serverless: { query: { postid?: string; }; }; }; }} itemData
     */
    async render(itemData) {
        const jsonData = await getPostJsonFromWordpress(itemData, wordPressSettings);
        
        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.modified.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered.replace(/<p>/g,'').replace(/<\/p>/g,'');

        return jsonData.content.rendered;
    }
}

module.exports = previewModePageClass;