# County buttons

Toggle buttons that display the currently selected county, allow switch back to statewide. This component is dependent on the ```cagov-county-search``` element. It subscribe to custom events emitted by ```cagov-county-search``` and dispatches the same event structure when clicked.

## Features

When a county selection event occurs this component will display itself, show the currently selected county as the active button and a toggle option to go back to statewide as inactive. 

If the inactive button is clicked a custom event is sent to the county search element and the active state of this button is switched.

## Events

Event structure:
```
  new window.CustomEvent('county-selected', {
    detail: {
      county: clickedCounty,
      statewide: false,
      reset: false,
      how: reason
    }
  });
```

This component listens for events:

```
  document.querySelector('cagov-county-search').addEventListener('county-selected', function (e) {
    console.log("County-selected event: " , e.detail);
  }.bind(this), false);
```


## Dependencies

This does not directly import and is not imported by any other components but it is designed to work with the <a href="../search/">cagov-county-search</a> component because it subscribes to events from and dispatches events to that component.