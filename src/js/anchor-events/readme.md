# Anchor Events

A component that looks for ids within selectors and fires events if a link to those ids is executed either via click on an in page anchor or on new page load

## Use case

We have accordions on our pages which initialize in a closed state. We may want to link directly to the contents of one of these accordions from another page or with an in page anchor link. Clicking on this link will scroll the page to the desired location already but this module adds the ability for the accordion to automatically open as the user arrives at it.

## Example

```
<cagov-anchor-events
  data-selector="cagov-accordion"
  data-event="click"
  data-event-target-selector="button.card-header.accordion-alpha"
  data-cancel-selector="open"
/>
```

Example above shows the custom element passing in the default values for all data set attributes. These attributes are optional and if the above default values are preferred that data attribute can be skipped:

```
<cagov-anchor-events />
```

## Attributes

Arguments are passed in as data attributes

- selector: a query selector to identify element which may contain ids where we want to watch inbound anchor links
- eventType: The event to fire on the element matching the selector containing the id of the anchor clicked
- eventTargetSelector: query selector used to identify element inside selector that should receive the event
- cancelSelector: a selector to look for inside the element identified by selector that will abort firing the event

## Conditions

This will only fire the event if the user clicked a link or loaded a page with an anchor hash targeting an id inside the selector

