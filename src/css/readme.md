# CSS development

This site uses <a href="https://getbootstrap.com/">bootstrap</a>, all bootstrap styles are available.

## Purging

Since not all of bootstrap styles are in use though a purge process runs which strips out any css not in use on the site.

The purge process is skipped if the development flag is on during the build to allow for faster iteration during local development. You'll need to run the site in staging or production mode to get it to behave the way it will when those builds are run in those environments. The development command ```npm run dev``` sets ```NODE_ENV=development``` to bypass that run ```npm run start``` directly.

The purge process is controlled in the gulpfile, see ```purgecss``` for the list of glob patterns reviewed for style usage.

### Where did my style go?

If you have just added a new class somewhere and it is not showing up on the site in staging maybe it is being added to the site structure in a way that is not noticed by the purge process.

- Review where your HTML that references this new class is in the build, is it in a file that is included in the list of pattenrs the gulpfile looks for?
- If your HTML is not part of code in pages or the bundled js files it may be missed. You can add a template referecning your HTML to let the purge process know to preserve those classes. We had to do this for the accordion component which uses a unique classname but whose structure is created by code in the .eleventy.js file. In this case we created a template file in pages/_includes/accordion.html and added that to the list of files the purge process reviews.
