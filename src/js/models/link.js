(function(){
	'use strict';
	
  joint.shapes.standard.Link.define('viewer.Link', {
    router: {
      name: 'normal'
    },
    connector: {
      name: 'rounded'
    },
    labels: [],
    attrs: {
      line: {
        stroke: '#8f8f8f',
        strokeDasharray: '5.5',
        strokeDashoffset: 7.5,
        strokeWidth: 2,
        fill: 'none',
        sourceMarker: {
          type: 'path',
          d: 'M 0 0 0 0',
          stroke: 'none'
        },
        targetMarker: {
          type: 'path',
          d: 'M 0 0 0 0',
          stroke: 'none'
        }
      }
    }
  }, {
    defaultLabel: {
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          refWidth: 10,
          refHeight: 10,
          refX: -5,
          refY: -5
        }
      }
    },
    getMarkerWidth: function(type) {
      var d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
      return this.getDataWidth(d);
    },
    getDataWidth: _.memoize(function(d) {
      return (new g.Path(d)).bbox().width;
    })
  }, {
    connectionPoint: function(line, view, magnet, opt, type, linkView) {
      var markerWidth = linkView.model.getMarkerWidth(type);
      opt = { offset: markerWidth, stroke: true };
      // connection point for UML shapes lies on the root group containg all the shapes components
      if (view.model.get('type').indexOf('uml') === 0) opt.selector = 'root';
      return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
    }
  });

	joint.shapes.standard.Link.define('editor.Link', {
    router: {
      name: 'normal'
    },
    connector: {
      name: 'rounded'
    },
    labels: [],
    attrs: {
      line: {
        stroke: '#8f8f8f',
        strokeDasharray: '5.5',
        strokeDashoffset: 7.5,
        strokeWidth: 2,
        fill: 'none',
        sourceMarker: {
          type: 'path',
          d: 'M 0 0 0 0',
          stroke: 'none'
        },
        targetMarker: {
          type: 'path',
          d: 'M 0 0 0 0',
          stroke: 'none'
        }
      }
    }
  }, {
    defaultLabel: {
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          refWidth: 10,
          refHeight: 10,
          refX: -5,
          refY: -5
        }
      }
    },
    getMarkerWidth: function(type) {
      var d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
      return this.getDataWidth(d);
    },
    getDataWidth: _.memoize(function(d) {
      return (new g.Path(d)).bbox().width;
    })
  }, {
    connectionPoint: function(line, view, magnet, opt, type, linkView) {
      var markerWidth = linkView.model.getMarkerWidth(type);
      opt = { offset: markerWidth, stroke: true };
      // connection point for UML shapes lies on the root group containg all the shapes components
      if (view.model.get('type').indexOf('uml') === 0) opt.selector = 'root';
      return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
    }
  });

})();