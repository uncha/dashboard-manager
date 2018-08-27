(function() {
  'use strict';
	
  // resource
  joint.dia.Element.define('shape.resource', {
    attrs: {
      image: {

      },
      chartButton: {
      	width:0,
      	height:0,
      	cursor: 'pointer',
        refX: -70
      },
      label: {
      	fontSize: 12,
        fill:'#7c68fc',
        textVerticalAnchor: 'top',
        textAnchor: 'middle',
        refX: '50%',
        refY: '105%',
      }
    }
  }, {
    markup: [
      {
        tagName: 'image',
        selector: 'image'
      },
      {
        tagName: 'image',
        selector: 'chartButton'
      },
      {
      	tagName: 'text',
      	selector: 'label'
      }
    ]
  });

  // data
  joint.dia.Element.define('shape.data', {
    size: { width: 120, height: 80 },
    attrs: {
      apiAddress: {
        text: ''
      },
      data1Label: {
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#7c68fc'
      },
      data1Value: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#222138'
      },
      data1Unit: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#ff0000'
      },
      data2Label: {
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#7c68fc'
      },
      data2Value: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#222138'
      },
      data2Unit: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#ff0000'
      },
      data3Label: {
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#7c68fc'
      },
      data3Value: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#222138'
      },
      data3Unit: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#ff0000'
      },
      data4Label: {
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#7c68fc'
      },
      data4Value: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#222138'
      },
      data4Unit: {
        textAnchor: 'end',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill:'#ff0000'
      },
    }
	}, {
    markup: [{
      tagName: 'text',
      selector: 'data1Label'
    }, {
      tagName: 'text',
      selector: 'data1Value'
    }, {
      tagName: 'text',
      selector: 'data1Unit'
    }, {
      tagName: 'text',
      selector: 'data2Label'
    }, {
      tagName: 'text',
      selector: 'data2Value'
    }, {
      tagName: 'text',
      selector: 'data2Unit'
    }, {
      tagName: 'text',
      selector: 'data3Label'
    }, {
      tagName: 'text',
      selector: 'data3Value'
    }, {
      tagName: 'text',
      selector: 'data3Unit'
    }, {
      tagName: 'text',
      selector: 'data4Label'
    }, {
      tagName: 'text',
      selector: 'data4Value'
    }, {
      tagName: 'text',
      selector: 'data4Unit'
    }]
	});

})();














