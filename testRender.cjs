const fs = require('fs');
const babel = require('@babel/core');
const React = require('react');
const { renderToString } = require('react-dom/server');

// Mock Lucide React
const lucideMock = new Proxy({}, {
  get: function(target, name) {
    return () => React.createElement('div', { 'data-mock-icon': name });
  }
});
require('module').prototype.require = new Proxy(require('module').prototype.require, {
  apply(target, thisArg, argumentsList) {
    if (argumentsList[0] === 'lucide-react') return lucideMock;
    return Reflect.apply(target, thisArg, argumentsList);
  }
});

require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [/node_modules/],
  extensions: ['.jsx', '.js']
});

const Curriculos = require('./src/components/screens/Curriculos.jsx').default;

try {
  const colors = require('./src/data/constants.jsx').defaultColors;
  const element = React.createElement(Curriculos, {
    colors,
    activeCurriculosTab: 0,
    setActiveCurriculosTab: () => {},
    expandedItem: null,
    setExpandedItem: () => {},
    navigateTo: () => {}
  });
  renderToString(element);
  console.log("RENDER_SUCCESS");
} catch (e) {
  console.error("RENDER_ERROR:");
  console.error(e.message);
  console.error(e.stack);
}
