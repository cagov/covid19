# covid19.ca.gov

## NOTE: As of 5-28-2024 This project is not actively maintained by ODI and this repo is being converted to Archive (read-only) status.

<img src="https://calenterprise.vsrm.visualstudio.com/_apis/public/Release/badge/520e8f21-6c5d-44c8-b523-979e428a7123/1/4">

The <b>covid19.ca.gov</b> website is designed to answer the questions Californians have about COVID-19 and the public health measures taken across the state to control it. It presents real-time public health information that is accurate, easy to read, and actionable. It provides a single source of truth about the state’s COVID-19 response and a central location for simplified policy guidance. It is intended to be easy to understand while offering links to related info on other state websites. 

The site began as a simple explainer for a single executive order to stay home. It evolved to include a data-driven map of COVID-19 statistics by county, a responsive display of restrictions based on local conditions, and data dashboards giving updates on cases, tests, hospitalizations, deaths, health equity, and vaccinations. As part of the reopening work, the site features “What’s open” search, which tells the open/closed status by county of more than 100 kinds of businesses or activities.

View our Wiki: https://github.com/cagov/covid19/wiki

Covid19.ca.gov was designed and developed by the State of California’s <a href="https://digital.ca.gov/">Office of Digital Innovation</a> (ODI).

## Content principles 
We are in a public health emergency. All communication from the State of California must create clarity in order to lead Californians through this crisis.

The website speaks directly to all Californians — not just journalists, experts, or government employees. There are a number of web-specific best practices that must be implemented for all content. The <b>covid19.ca.gov</b> team revises and formats all content on the website to make it:

### Accessible
This is a legal, moral, and practical consideration. This includes accessibility for users with physical disabilities, cognitive impairment, assistive technologies, various devices, and all levels of education/literacy (our standard is 6th grade level tested in Hemingway).

### Clear 
Because navigating this crisis requires public compliance with frequently-changing public health guidance, confusion is dangerous. If users can’t understand what to do, they won’t do it. The site must also be concise: based on analytics data, we have ~1.5 minutes to get each user the most important information.

### Trustworthy 
Content on the site must be true, complete, and current. This means that the web team must be able to update the content rapidly to fit changing circumstances, and approval must be iterative so that the site is never out-of-date. To maintain trust, it’s crucial that the site come across as an apolitical authority, not as a vehicle for political messaging.

### Inclusive
We strive to consider the context in which Californians come to our site and how it may enable or prevent them from getting what they need, this includes language limitations. Our site is translated daily in 7 languages in addition to English: Spanish, Traditional Chinese, Simplified Chinese, Vietnamese, Korean, Tagalog, and Arabic. See the <a href="https://docs.google.com/document/d/10Nz7sFJBlcOXNPhaw6ujjSFvv99xvid3kwBp58Up9Eo/edit#">full list for inclusivity considerations and common issues</a>.

## Content style guide 
Read the <a href="https://handbook.digital.ca.gov/">California Design Handbook</a>, which evolved from Alpha with the work done on <b>covid19.ca.gov</b>.

## Contact
We are growing our team! Visit <a href="http://digital.ca.gov">digital.ca.gov</a> to see if there is an open opportunity that sparks your interest.

For content requests or questions, email: <a href="mailto:covid19@alpha.ca.gov">covid19@alpha.ca.gov</a>. 

***

## Technical architecture

This website receives hundreds of thousands of daily visitors when big announcements are made. We need to quickly and reliably respond to visitors on any device with any accessibility constraint.

### Speed

We measure our site page speeds using Lighthouse audits. We perform these when we develop new content and run regular checks that report any score changes into our Slack channels. Lighthouse is an important tool because it analyzes all aspects of performance, from server response time to all the aspects of the front-end bottleneck. 

Lack of attention to web performance has an extreme negative effect on the user experience of people using low-end mobile devices. We optimize our performance scores on a MotoG4 with a 3G connection, and have the Cricket Icon device on hand to review the experience on cheaper hardware ourselves.

### a11y

We audit all deliverables for accessibility, running initial SiteImprove and Lighthouse audits, then supplementing these with manual tests using screen readers and keyboard navigation. Our efforts are guided by the expert advice of the <a href="https://www.dor.ca.gov/">CA Department of Rehabilitation</a>. We consider any accessibility failure a high priority bug.

### Uptime

We create static final deliverable using content pregeneration powered by <a href="https://www.11ty.dev/">11ty</a> which reduces resource requirements in our production environment and lets us smoothly scale to handle traffic spikes.

We need to balance pre-generating a lean site with ease of authoring. We do this by using WordPress internally as an authoring tool and integrating changes into the pregen pipeline via the WordPress API. Most of the content on pages is authored in a separate WordPress environment so we can take advantage of the mature writing interface. Any change to this content triggers a custom serverless function which syncs changes directly to this Github repository. Code changes trigger 11ty rebuilds via Github actions, which then trigger deployments to our staging or production environments.

### Simplified web app architecture diagram

<img src="src/img/webAppReferenceArchitecture.png">

# Development	

The ```staging``` branch deploys to <a href="https://staging.covid19.ca.gov/">https://staging.covid19.ca.gov/</a> and can be administered via <a hrev="https://portal.azure.com/#@digitalca.onmicrosoft.com/resource/subscriptions/9bdb8e29-156f-4fc9-a1fe-1bb6a915a4f0/resourceGroups/RG-GO-COVID19-D-001/providers/Microsoft.Web/staticSites/SWA-GO-COVID-D-002/environments">static web app service 002</a>.

## Css purging

This project imports bootstrap styles some of which are unnecessary. There is a purge step in the build process which reviews local files and tosses unused CSS.
## Testing

Github action workflow triggers ```npm test``` end to end tests on pull request to production branch.
