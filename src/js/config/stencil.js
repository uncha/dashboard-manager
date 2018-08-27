var App = App || {};
App.config = App.config || {};

(function() {
  'use strict';

  App.config.stencil = {};
  App.config.stencil.groups = {
  	label: {label:'LABEL', index:1},
    resources: {label:'RESOURCE', index:2},
    data: {label:'DATA', index:4},
    chart: {label:'CHART', index:3}
  };

	App.config.stencil.shapes = {

    'label': [
			{
			  type: 'standard.Rectangle',
			  attrs: {
			    root: {
		        dataTooltip: 'Rectangle',
		        dataTooltipPosition: 'left',
		        dataTooltipPositionSelector: '.joint-stencil'
			    },
			    body: {
		        rx: 2,
		        ry: 2,
		        width: 50,
		        height: 30,
		        fill: '#ffffff',
		        stroke: '#7c68fc',
		        'stroke-width': 2,
			    },
			    label: {
		        text: 'rect',
		        fill: '#7c68fc',
		        'font-family': 'Arial',
		        'font-size': 11,
			    }
			  }
			},
			{
			  type: 'standard.Ellipse',
			  attrs: {
			    root: {
		        dataTooltip: 'Ellipse',
		        dataTooltipPosition: 'left',
		        dataTooltipPositionSelector: '.joint-stencil'
			    },
			    body: {
		        width: 50,
		        height: 30,
		        fill: '#ffffff',
		        stroke: '#7c68fc',
		        'stroke-width': 2,
			    },
			    label: {
		        text: 'ellipse',
		        fill: '#7c68fc',
		        'font-family': 'Arial',
		        'font-size': 12,
			    }
			  }
			},
	  ],

	  'resources': [
	  	// smart meter
      {
        type:'shape.resource',
        attrs: {
          label:{
            text:'Smart meter',
            textVerticalAnchor:'top',
            textAnchor:'middle'
          },
          image: {
            xlinkHref: './src/assets/resource01.svg',
            refWidth: '100%',
            refHeight: '100%'
          },
          chartButton: {
            xlinkHref: './src/assets/resource_chart01.svg',
            refX:'100%',
          }
        }
      },

      {
        type:'shape.resource',
        attrs: {
          label:{
            text:'Solar',
            textVerticalAnchor:'top',
            textAnchor:'middle'
          },
          image: {
            xlinkHref: './src/assets/resource02.svg',
            refWidth: '100%',
            refHeight: '100%'
          },
          chartButton: {
            xlinkHref: './src/assets/resource_chart01.svg',
            refX:'100%',
          }
        }
      },

      {
        type:'shape.resource',
        attrs: {
          label:{
            text:'Electric vehicle',
            textVerticalAnchor:'top',
            textAnchor:'middle'
          },
          image: {
            xlinkHref: './src/assets/resource03.svg',
            refWidth: '100%',
            refHeight: '100%'
          },
          chartButton: {
            xlinkHref: './src/assets/resource_chart01.svg',
            refX:'100%',
          }
        }
      },

      {
        type:'shape.resource',
        attrs: {
          label:{
            text:'Home',
            textVerticalAnchor:'top',
            textAnchor:'middle'
          },
          image: {
            xlinkHref: './src/assets/resource04.svg',
            refWidth: '100%',
            refHeight: '100%'
          },
          chartButton: {
            xlinkHref: './src/assets/resource_chart01.svg',
            refX:'100%',
          }
        }
      },
	  ],

    'data': [
      {
        type:'shape.data',
        attrs: {
          data1Label: {
            text: 'CBL',
            refX:0,
          },
          data1Value: {
            text: '0',
            refX: '80%',
          },
          data1Unit: {
            text: 'kW',
            refX: '100%'
          },
          data2Label: {
            text: '사용량',
            refX:0,
            refY:20,
          },
          data2Value: {
            text: '0',
            refX: '80%',
            refY:20,
          },
          data2Unit: {
            text: 'kW',
            refX: '100%',
            refY:20,
          },
          data3Label: {
            text: '감축목표',
            refX:0,
            refY:40,
          },
          data3Value: {
            text: '0',
            refX: '80%',
            refY:40,
          },
          data3Unit: {
            text: 'kW',
            refX: '100%',
            refY:40,
          },
          data4Label: {
            text: '감축',
            refX:0,
            refY:60,
          },
          data4Value: {
            text: '0',
            refX: '80%',
            refY:60,
          },
          data4Unit: {
            text: 'kW',
            refX: '100%',
            refY:60,
          }
        }
      }
    ],

    'chart': [
      new joint.shapes.chart.Knob({
        size: { width: 150, height: 150 },
        value: 100,
        min: 0, 
        max: 100,
        fill: '#2c97de',
        attrs: { 
          '.legend-slice text': { fill: '#000', 'font-size': 11 }
        }
      })
    ]
  };
})();









