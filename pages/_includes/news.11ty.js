class News {
  data() {
    return {
      layout: "page.njk",
      publishdate: "today",
    };
  }

  
  render(data) {
    const locales = "en-US";
    const timeZone = "America/Los_Angeles";
    return `${data.collections.covidGuidance
      .map((item) => {
        let pressdate = new Date(item.data.publishdate);
        return `<div class="card border-0 border-bottom rounded-0" lang="en-US">
        <div class="card-body pl-0" lang="en-US">
          <h2 class="card-title lead" lang="en-US">
            <a href="${item.data.url}" lang="en-US" hreflang="en-US" rel="external">${
          item.data.title
        }</a>
          </h2>
          <p class="card-text" lang="en-US"><small class="text-muted"><!--${
            item.fileSlug
          } -->${pressdate.toLocaleDateString(locales, {
          timeZone,
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</small></p>
          <div class="card-text" lang="en-US">${
            item.data.meta.length > 221
              ? item.data.meta.slice(0, 220) + "..."
              : item.data.meta
          }</div>
        </div>
      </div>`;
      })
      .join(" ")}`;
  }
}

module.exports = News;
