import "../src/index.js";

export default {
  title: "Example/Anchor Events",
  argTypes: {
    selector: { control: "string" },
  },
};

const Template = ({ title }) => {
  return html`
    <cagov-anchor-events data-selector="${selector}"></cagov-anchor-events>
  `;
};

export const MyElement = (args) => Template(args);
MyElement.args = {
  selector: "cagov-accordion",
};