var App = App || {};
App.config = App.config || {};

(function() {
  'use strict';
  
  App.config.toolbar = {};
  App.config.toolbar.tools = [
	{
	  type: 'label',
	  name: 'zoom-slider-label',
	  group: 'zoom',
	  text: 'Zoom:'
	},
	{
	  type: 'zoom-slider',
	  name: 'zoom-slider',
	  group: 'zoom'
	},
	{
	  type: 'zoom-out',
	  name: 'zoom-out',
	  group: 'zoom',
	  attrs: {
	    button: {
	      'data-tooltip': 'Zoom Out',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	{
	  type: 'zoom-in',
	  name: 'zoom-in',
	  group: 'zoom',
	  attrs: {
	    button: {
	      'data-tooltip': 'Zoom In',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
  {
	  type: 'undo',
	  name: 'undo',
	  group: 'undo-redo',
	  attrs: {
	    button: {
	      'data-tooltip': 'Undo',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	{
	  type: 'redo',
	  name: 'redo',
	  group: 'undo-redo',
	  attrs: {
	    button: {
	      'data-tooltip': 'Redo',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	{
	  type: 'button',
	  name: 'to-front',
	  group: 'order',
	  text: 'Send To Front',
	  attrs: {
	    button: {
	      id: 'btn-to-front',
	      'data-tooltip': 'Bring Object to Front',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	{
	  type: 'button',
	  name: 'to-back',
	  group: 'order',
	  text: 'Send To Back',
	  attrs: {
	    button: {
	      id: 'btn-to-back',
	      'data-tooltip': 'Send Object to Back',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	{
	  type: 'button',
	  name: 'delete',
	  group: 'edit',
	  text: 'Delete',
	  attrs: {
	    button: {
	      id: 'btn-to-back',
	      'data-tooltip': 'Send Object to Back',
	      'data-tooltip-position': 'top',
	      'data-tooltip-position-selector': '.toolbar-container'
	    }
	  }
	},
	]
})();