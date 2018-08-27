/*
데이터를 추가하여 커스텀 할 수 있는 컴포넌트
*/

(function(){
  'use strict';
    
  joint.shapes.basic.Generic.define('dataGroup', {
      attrs: {
          rect: { 'width': 200 },
          '.uml-class-attrs-rect': { 'stroke': 'black', 'stroke-width': 2, 'fill': '#7c68fc' },
          '.uml-class-attrs-text': {
              'ref': '.uml-class-attrs-rect', 'ref-y': 5, 'ref-x': 5,
              'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
          },
          '.uml-class-attrs-text2': {
              'ref': '.uml-class-attrs-rect', 'ref-y': 5, 'ref-x': 25,
              'fill': 'black', 'font-size': 12, 'font-family': 'Times New Roman'
          },
      },
      attributes: [],
      attributes2: [],
  }, {
      markup: [
          '<g class="rotatable">',
          '<g class="scalable">',
          '<rect class="uml-class-attrs-rect"/>',
          '<text class="uml-class-attrs-text"/>',
          '<text class="uml-class-attrs-text2"/>',
          '</g>',
          '</g>'
      ].join(''),
      
      initialize: function() {

          this.on('change:name change:attributes change:methods', function() {
              this.updateRectangles();
              this.trigger('uml-update');
          }, this);

          this.updateRectangles();

          joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
      },

      getClassName: function() {
          return this.get('name');
      },

      updateRectangles: function() {

          var attrs = this.get('attrs');

          var rects = [
              { type: 'attrs', text: this.get('attributes') },
          ];
          
          var offsetY = 0;
          
          rects.forEach(function(rect) {

              var lines = Array.isArray(rect.text) ? rect.text : [rect.text];
              var rectHeight = lines.length * 20 + 20;
              
              attrs['.uml-class-' + rect.type + '-text'].text = lines.join('\n');
              attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
              attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

              offsetY += rectHeight;
          });
      }

  });


})();