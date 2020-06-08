# Covid19

<img src="https://calenterprise.vsrm.visualstudio.com/_apis/public/Release/badge/520e8f21-6c5d-44c8-b523-979e428a7123/1/4">

The new website, COVID19.CA.gov, is designed to answer the questions people have and present information that is real time and actionable. It provides a single source of  truth for people looking for information about COVID-19 developments and response here in California. As well as a centralized location for simplified policy guidance. It is intended to be simple to understand while providing links back to department websites. 

As the situation develops, the website will be updated in real time with information as it becomes available.

> See our Wiki: https://github.com/cagov/covid19/wiki

## Content principles 
We are in a public health emergency. All communication from the State of California must create clarity in order to lead Californians through this crisis.

The website (covid19.ca.gov) speaks directly to all Californians — not just journalists, experts, or government employees. There are a number of web-specific best practices that must be implemented for all content. The web/covid19.ca.gov team will revise and format all content to make all content on covid19.ca.gov:

#### Accessible to all.
This is a legal, moral, and practical consideration. This includes accessibility for users with physical disabilities, cognitive impairment, assistive technologies, all devices, and all levels of education/literacy (6th grade level tested in Hemingway).

#### Clear. 
Because navigating this crisis requires public compliance with frequently-changing public health guidance, confusion is actually dangerous. If users can’t understand what to do, they won’t do it. The site must also be concise: based on analytics data, we have ~1.5 minutes to get each user the most important information.

#### Trustworthy. 
Content on the site must be true, complete, and current. This means that the web team must be able to update the content rapidly to fit changing circumstances, and approval must be iterative so that the site is never out-of-date. To maintain trust, it’s crucial that the site come across as an apolitical authority, not as a vehicle for political messaging.

#### Inclusive.

> See the <a href="https://docs.google.com/document/d/10Nz7sFJBlcOXNPhaw6ujjSFvv99xvid3kwBp58Up9Eo/edit#">full list for inclusivity considerations and common issues</a>

### Content style guide 

> <a href="https://docs.google.com/document/d/1txYjL0T2Qmi6Bn7UMtRyECNGbJpOzVQ5ALtqrVTOPOI/edit">Read the covid19.ca.gov content style guide</a>

For a more comprehensive style guide see:

> <a href="https://docs.google.com/document/d/1O5xf74pMzeGKIcMOx_dUooteSTVb2NwB9dze9D9T_fs/edit">Alpha content style guide</a>

### For content requests or questions email: covid19@alpha.ca.gov 

***

## Technical architecture

This website receives millions of daily visitors when big announcements are made. We need to quickly and reliably respond to visitors on any device with any accessibility constraint.

### Speed

We measure our site page speeds using lighthouse audits. We perform these when we develop new content and run regular checks that report any score changes into our slack channels. Lighthouse is an important tool because it analyzes all aspects of performance from server response time to all the aspects of the frontend bottleneck. 

Lack of attention to web performance has an extreme negative effect on the user experience of people using low end mobile devices. We try to optimize our performance scores on MotoG4 on 3G connection and have the cricket icon device on hand to review the experience on cheaper hardware ourselves.

### a11y

We audit all deliverables for accessibility, running initial siteimprove and lighthouse audits, then supplementing these with manual tests using screen readers and keyboard navigation. Our efforts are guided by the expert advice of the <a href="https://www.dor.ca.gov/">CA Department of Rehabilitation</a>. We consider any accessibility failure a high priority bug.

### Uptime

We create static final deliverable using content pregeneration powered by <a href="https://www.11ty.dev/">11ty</a> which reduces resource requirements in our production environment and lets us smoothly scale to handle traffic spikes.

We need to balance pregenerating a lean site with ease of authoring. We do this by using WordPress internally as an authoring tool and integrating changes into the pregen pipeline via the WordPress API. Most of the content on pages is authored in a separate WordPress environment so we can take advantage of the mature writing interface. Any change to this content triggers a custom serverless function which synchs changes directly to this github repository. Code changes trigger 11ty rebuilds via github actions which then trigger deploys to our staging or production environments.

### Simplified web app architecture diagram

<img src="src/img/webAppReferenceArchitecture.png">
