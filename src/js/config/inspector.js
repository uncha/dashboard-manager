var App = App || {};
App.config = App.config || {};

(function() {
  'use strict';
  
  var colorPaletteOptions = [
    { content: '#ffffff' }, { content: '#7c68fc' }, { content: '#61549C' }, { content: '#feb663' }, { content: '#00ff00' },
    { content: '#222138' }, { content: '#31D0C6' }, { content: '#FE854F' }, { content: '#33334e' }, { content: '#4B4A67' },
    { content: '#4B4A67' }, { content: '#3c4260' }, { content: '#6a6c8a' }, { content: '#ff0000' }, { content: '#00a23a' }
  ];
  
  App.config.inspector = {};
  App.config.inspector.data = {
    'standard.Ellipse': {
      inputs: {
        attrs: {
          body: {
            fill: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'presentation', label: 'fill', index: 1
            },
            stroke: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'presentation', label: 'outline', index: 2
            },
            'stroke-width': {
              type: 'range', min: 0, max: 50, unit: 'px',
              group: 'presentation', label: 'outline width', index: 3
            }
          },
          label: {
            text: { type: 'textarea', group: 'text', label: 'Text', index: 1 },
            'font-size': { type: 'range', min: 5, max: 30, group: 'text', label: 'Font size', index: 2 },
            'font-family': {
              type: 'select',
              options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Garamond', 'Tahoma', 'Lucida Console', 'Comic Sans MS'],
              label: 'Font family', group: 'text', index: 3
            },
            fill: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'text', label: 'color', index: 4
            }
          }
        }
      },
      groups: {
        presentation: { label: 'Presentation', index: 1 },
        text: { label: 'Text', index: 2 }
      }
    },
    'standard.Rectangle': {
      inputs: {
        attrs: {
          body: {
            fill: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'presentation', label: 'fill', index: 1
            },
            stroke: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'presentation', label: 'outline', index: 2
            },
            'stroke-width': {
              type: 'range', min: 0, max: 50, unit: 'px',
              group: 'presentation', label: 'outline width', index: 3
            }
          },
          label: {
            text: { type: 'textarea', group: 'text', label: 'Text', index: 1 },
            'font-size': { type: 'range', min: 5, max: 30, group: 'text', label: 'Font size', index: 2 },
            'font-family': {
              type: 'select',
              options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Garamond', 'Tahoma', 'Lucida Console', 'Comic Sans MS'],
              label: 'Font family', group: 'text', index: 3
            },
            fill: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'text', label: 'color', index: 4
            }
          }
        }
      },
      groups: {
        presentation: { label: 'Presentation', index: 1 },
        text: { label: 'Text', index: 2 }
      }
    },
    'shape.resource': {
      inputs: {
        attrs: {
          body: {
            
          },
          label: {
            text: { type: 'textarea', group: 'text', label: 'Text', index: 1 },
            'font-size': { type: 'range', min: 5, max: 30, group: 'text', label: 'Font size', index: 2 },
            'font-family': {
              type: 'select',
              options: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Garamond', 'Tahoma', 'Lucida Console', 'Comic Sans MS'],
              label: 'Font family', group: 'text', index: 3
            },
            fill: {
              type: 'color-palette', options: colorPaletteOptions,
              group: 'text', label: 'color', index: 4
            }
          }
        }
      },
      groups: {
        presentation: { label: 'Presentation', index: 1 },
        text: { label: 'Text', index: 2 }
      }
    },
    'shape.data': {
      inputs: {
        attrs: {
          apiAddress: {
            text: { type: 'text', group: 'label', label: 'API Address', index: 1 },
          },
        },
      },
      groups: {
        label: { label: 'DATA', index: 1 },
      }
    },
    'chart.Knob': {
      inputs: {
        attrs: {
          apiAddress: {
            text: { type: 'text', group: 'label', label: 'API Address', index: 1 },
          },
        },
      },
      groups: {
        label: { label: 'DATA', index: 1 },
      }
    },
    'editor.Link': {
      inputs: {
        attrs: {
          apiAddress: {
            text: { type: 'text', group: 'label', label: 'API Address', index: 1 },
          },
        },
      },
      groups: {
        label: { label: 'DATA', index: 1 },
      }
    },
  };
  
})();