# County search

This is a search form that autocompletes county names. 

## Features

This component contains 
- a11y compliant hidden label
- text input form field
- submit button
- initially hidden error lable
- initially hidden suggestion list

The list of counties is retrieved from a hardcoded json location. When two or more characters are entered autocomplete suggestions are displayed. When one is chosen events are fired. If no autocomplete option is selected and the button is pressed the field value is compared against the list of counties and if there is a match the county selected event is fired, if no match an error message is displayed under the field.

This component does not include any of its own CSS. It does use bootstrap classnames in its HTML in the ```tempalte.js``` file. If we wanted to make this component usable off the covid19.ca.gov site it should come with some basic formatting styles.

## Events

When a county is chosen a custom event is emitted. External elements which are interested in this event can subscribe to it.

Event structure:
```
  const event = new window.CustomEvent('county-selected', {
    detail: {
      county: this.state.county,
      statewide: this.state.statewide,
      reset: this.state.statewide
      how: reason
    }
  });
```

The event is dispatched from this custom element so external code can subscribe to it like:

```
  document.querySelector('cagov-county-search').addEventListener('county-selected', function (e) {
    console.log(e.detail)
  })
```

## Usage

- Import the ```index.js``` file in your js bundle
- Place the ```cagov-county-search``` custom element in your HTML

## Dependencies

The autocomplete feature relies on <a href="https://projects.verou.me/awesomplete/">Awesomplete</a> via the ```awesomplete-es6``` npm module. This is a lightweight, extensible, accessible, feature rich library that the covid19.ca.gov site uses in several locations.