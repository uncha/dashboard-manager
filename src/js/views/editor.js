var App = App || {};

(function(){

  'use strict';

  App.MainView = {
    init: function() {
      // init graph
      this.graph = new joint.dia.Graph;
      // init paper
      this.paper = new joint.dia.Paper({
        width: 1000,
        height: 1500,
        gridSize: 10,
        model: this.graph,
        drawGrid: true,
        defaultLink: new joint.shapes.editor.Link(),
        background: {
          color: '#EFEFEF'
        }
      });

      // init data
      this.pages = [
        {
          enabled:true,
          name:'page-1',
          data:{"cells":[]}
        }
      ];
      this.activePage = 0;

      this.initStencil();
      this.initPaperScroller();
      this.initToolbar();
      this.initMenubar();
      this.initPaperEvent();
      this.initPage();
    },
    
    initStencil: function() {
      this.stencil = new joint.ui.Stencil({
        graph: this.graph,
        paper: this.paper,
        snaplines: new joint.ui.Snaplines({ paper: this.paper }),
        width: 300,
        layout: true,
        search: {
          '*': ['attrs/text/text'],
          'basic.Image': ['description'],
          'basic.Path': ['description']
        },
        groups: App.config.stencil.groups
      });
      $('#stencil').append(this.stencil.render().el);
      this.stencil.load(App.config.stencil.shapes);
    },

    initPaperScroller: function() {
      this.paperScroller = new joint.ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true
      });
      $('#paper').append(this.paperScroller.el);
      this.paperScroller.render().center();
    },

    initToolbar: function(){
      this.commandManager = new joint.dia.CommandManager({
        graph: this.graph
      });

      this.toolbar = new joint.ui.Toolbar({
        tools: App.config.toolbar.tools,
        references: {
          paperScroller: this.paperScroller,
          commandManager: this.commandManager
        },
      });

      this.toolbar.on({
          /*'png:pointerclick': _.bind(this.openAsPNG, this),
          'to-front:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toFront'),
          'to-back:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toBack'),
          'layout:pointerclick': _.bind(this.layoutDirectedGraph, this),
          'snapline:change': _.bind(this.changeSnapLines, this),
          'clear:pointerclick': _.bind(this.graph.clear, this.graph),
          'print:pointerclick': _.bind(this.paper.print, this.paper),
          'grid-size:change': _.bind(this.paper.setGridSize, this.paper)*/
      });
      $('#toolbar').append(this.toolbar.render().el);
    },

    initMenubar: function() {
      var self = this;

      $('#menubar-btn-save').on('click', function(){
        self.save();
      });

      $('#menubar-btn-load').on('click', function(){
        self.load();
      });

      $('#menubar-btn-export-svg').on('click', function(){
        self.openAsSVG();
      });

      $('#menubar-btn-export-png').on('click', function(){
        self.openAsPNG();
      });
    },

    initInjector: function(cell){
      return joint.ui.Inspector.create('#inspector', _.extend({
        cell: cell,
        live: true
      }, App.config.inspector.data[cell.attributes.type]));
    },

    initPaperEvent: function(){
      var selection = new joint.ui.Selection({ paper: this.paper });
      this.paper.on('blank:pointerdown', selection.startSelecting);
      this.paper.on('element:pointerup', function(elementView, evt) {
        if (evt.ctrlKey || evt.metaKey) {
          selection.collection.add(elementView.model);
        }
      });

      selection.on('selection-box:pointerdown', function(elementView, evt) {
        if (evt.ctrlKey || evt.metaKey) {
          selection.collection.remove(elementView.model);
        }
      });

      this.paper.on('cell:pointerdown', function(cellView) {
        App.MainView.initInjector(cellView.model);
      });

      this.paper.on('link:pointerup', function(linkView) {
        var ns = joint.linkTools;
        var toolsView = new joint.dia.ToolsView({
          name: 'link-pointerdown',
          tools: [
            new ns.Vertices(),
            new ns.SourceAnchor(),
            new ns.TargetAnchor(),
            new ns.SourceArrowhead(),
            new ns.TargetArrowhead(),
            new ns.Segments,
            new ns.Boundary({ padding: 15 }),
            new ns.Remove({ offset: -20, distance: 40 })
          ]
        });
        this.paper.removeTools();
        linkView.addTools(toolsView);
      }, this);

      this.paper.on('blank:pointerdown', function(evt, x, y) {
        this.paper.removeTools();
      }, this);

      this.paper.on('link:mouseenter', function(linkView) {
        // Open tool only if there is none yet
        if (linkView.hasTools()) return;

        var ns = joint.linkTools;
        
        var toolsView = new joint.dia.ToolsView({
          name: 'link-hover',
          tools: [
            new ns.Vertices({ vertexAdding: false }),
            new ns.SourceArrowhead(),
            new ns.TargetArrowhead()
          ]
        });

        linkView.addTools(toolsView);
      });

      this.paper.on('link:mouseleave', function(linkView) {
        // Remove only the hover tool, not the pointerdown tool
        if (linkView.hasTools('link-hover')) {
          linkView.removeTools();
        }
      });

      this.paper.on('element:pointerup', function(elementView) {
        if (elementView.model instanceof joint.dia.Link) return;

        var element = elementView.model;

        new joint.ui.FreeTransform({
          cellView: elementView,
          allowRotation: false,
          preserveAspectRatio: !!element.get('preserveAspectRatio'),
          allowOrthogonalResize: element.get('allowOrthogonalResize') !== false
        }).render();

        new joint.ui.Halo({
          cellView: elementView,
        }).render();

        this.paper.removeTools();        
      }, this);

    },

    initPage: function() {
      var self = this;
            
      $('#btn-add-page').on('click', function(e){
        e.preventDefault();
        self.newPage();
      });

      $('.nav-tabs').on('click', ' > li', function(e){
        e.preventDefault();
        self.changePage($(this).index());
      });

      $('.nav-tabs').on('click', ' > li .btn-close', function(e){
        e.preventDefault();
        e.stopPropagation();

        self.removePage($(this).closest('li').index());
      });

      $('.nav-tabs').on('dblclick', ' > li', function(e) {
        $('#page-modal').modal('show');
      });

      $('#page-modal').on('show.bs.modal', function(){
        $('#inputRename').val(self.pages[self.activePage].name);
        $('#checkEnabled').prop('checked', self.pages[self.activePage].enabled);
      });

      $('#btn-save-changes').on('click', function(){
        self.pages[self.activePage].name = $('#inputRename').val();
        self.pages[self.activePage].enabled = $('#checkEnabled').is(':checked');

        $('.nav-tabs > li.active .page-name').text(self.pages[self.activePage].name);

        $('#page-modal').modal('hide');
      });
    },

    createPage: function(){
      $('.nav-tabs > li').remove();

      for(var i=0; i<this.pages.length; i++){
        var pageName = this.pages[i].name;
        var html = '<li><a data-toggle="tab" href="#home"><button class="btn btn-close"><i class="fas fa-times"></i></button> <span class="page-name">' + pageName + '</span></a></li>';
        $('.nav-tabs .add-page').before(html);
      }

      $('.nav-tabs > li').eq(0).addClass('active');
    },

    openAsPNG: function() {
      this.paper.hideTools().toPNG(function(dataURL) {
        new joint.ui.Lightbox({
          image: dataURL,
          downloadable: true,
          fileName: 'Rappid'
        }).open();
        this.paper.showTools();
      }, {
        padding: 10,
        useComputedStyles: false,
        stylesheet: this.exportStylesheet
      });
    },

    openAsSVG: function (){
      this.paper.hideTools().toSVG(function(svg) {
        new joint.ui.Lightbox({
          image: 'data:image/svg+xml,' + encodeURIComponent(svg),
          downloadable: true,
          fileName: 'Rappid'
        }).open();
        this.paper.showTools();
      }, {
        preserveDimensions: true,
        convertImagesToDataUris: true,
        useComputedStyles: false,
        stylesheet: this.exportStylesheet
      });
    },

    newPage: function() {
      if(this.pages.length >= 5) {
        alert('다섯페이지 이상 추가하실 수 없습니다.');
        return;
      }

      this.pages[this.activePage].data = this.graph.toJSON();

      this.activePage = this.pages.length;

      $('.nav-tabs .active').removeClass('active');

      var pageName = 'page-' + (this.activePage + 1);
      var emptyData = {"cells":[]};
      var html = '<li class="active"><a data-toggle="tab" href="#home"><button class="btn btn-close"><i class="fas fa-times"></i></button> <span class="page-name">' + pageName + '</span></a></li>';
      $('.nav-tabs .add-page').before(html);

      this.pages.push({
        enabled:true,
        name:pageName,
        data:emptyData
      });

      this.graph.fromJSON(emptyData);
    },

    removePage: function(i) {
      if(this.pages.length <= 1) {
        alert('한페이지 이상 유지하셔야 합니다.');
        return;
      }

      $('.nav-tabs > li').eq(i).remove();
      this.pages.splice(i, 1);

      if(i == this.activePage){
        this.activePage = $('.nav-tabs > li').length - 1;
        $('.nav-tabs > li').eq(this.activePage).addClass('active');
        this.graph.fromJSON(this.pages[this.activePage].data);
      } else {
        this.activePage = $('.nav-tabs > li.active').index();
      }
    },
    
    changePage: function(i) {
      this.pages[this.activePage].data = this.graph.toJSON();

      this.activePage = i;

      this.graph.fromJSON(this.pages[i].data);
    },
    
    save: function() {
      //window.localStorage.setItem('save', JSON.stringify(this.graph.toJSON()));
      
      this.pages[this.activePage].data = this.graph.toJSON();
      window.localStorage.setItem('save', JSON.stringify(this.pages));
    },
    
    load: function() {
      var emergencyProcedure = '[{"enabled":true,"name":"POSCO ICT","data":{"cells":[{"type":"standard.Rectangle","position":{"x":405,"y":290.0000000000001},"size":{"width":210,"height":70},"angle":0,"id":"753cde1f-f2f2-4cf9-9783-af3c50421b51","z":1,"attrs":{"body":{"stroke":"#ffffff","fill":"#7c68fc","rx":2,"ry":2,"width":50,"height":30,"stroke-width":0},"label":{"fill":"#ffffff","text":"KPX","font-family":"Arial","font-size":30},"root":{"dataTooltip":"Rectangle","dataTooltipPosition":"left","dataTooltipPositionSelector":".joint-stencil"}}},{"type":"standard.Ellipse","position":{"x":440,"y":560},"size":{"width":140,"height":50},"angle":0,"id":"7a2dfb98-d383-487d-9138-2a5fc078f4ea","z":2,"attrs":{"body":{"stroke":"#7c68fc","fill":"#ffffff","width":50,"height":30,"stroke-width":2},"label":{"fill":"#7c68fc","text":"POSCO ICT","font-family":"Arial","font-size":18},"root":{"dataTooltip":"Ellipse","dataTooltipPosition":"left","dataTooltipPositionSelector":".joint-stencil"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"7a2dfb98-d383-487d-9138-2a5fc078f4ea"},"target":{"id":"753cde1f-f2f2-4cf9-9783-af3c50421b51"},"id":"992c8c4e-69bd-4606-b35f-cf5ad78f6b51","z":3,"attrs":{"apiAddress":{"text":"active1"}}},{"type":"shape.resource","position":{"x":-990.0000000000002,"y":952},"size":{"width":90.00000000000023,"height":90},"angle":0,"id":"df4b7468-2798-4623-b5a3-5b9117111229","z":8,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"고려용접봉","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":-183,"y":942},"size":{"width":90,"height":90},"angle":0,"id":"ac06134e-de15-4857-8f74-754e14bc40ab","z":9,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"나스테크","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":176.8749999999999,"y":952},"size":{"width":86.25000000000023,"height":90},"angle":0,"id":"8dd9b63c-85df-4802-ab74-9e839879d6d9","z":10,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"세하주식회사","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":545,"y":952},"size":{"width":90,"height":90},"angle":0,"id":"7961d38d-d5bc-48a7-96f4-a07651782a3b","z":11,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"세화기계","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":-760,"y":690},"size":{"width":110,"height":110},"angle":0,"id":"8a7ad1d4-bfc6-4795-bca2-2862fb30343b","z":12,"attrs":{"image":{"xlinkHref":"./src/assets/resource04.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"2018 비수도권","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":163.74999999999977,"y":680},"size":{"width":112.50000000000045,"height":110},"angle":0,"id":"42cf3f0c-02b4-4368-ace4-b98c51ce281c","z":13,"attrs":{"image":{"xlinkHref":"./src/assets/resource04.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"2018 수도권","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":1555,"y":680},"size":{"width":110,"height":110},"angle":0,"id":"22a9c2d1-0aad-49c3-b259-d30b83591bc6","z":15,"attrs":{"image":{"xlinkHref":"./src/assets/resource04.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"대기자원","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":-620.0000000000001,"y":942},"size":{"width":90.00000000000011,"height":90},"angle":0,"id":"e8a87600-00ab-4216-b9ea-3cd96ca99091","z":16,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"금동메탈","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":955,"y":705},"size":{"width":110,"height":100},"angle":0,"id":"e33f9c9b-06cf-498c-8b19-1637da3a9d63","z":18,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"세화정밀","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":1335,"y":928},"size":{"width":90,"height":94},"angle":0,"id":"c77d28c4-e0de-42f4-b648-be90e92d4301","z":19,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"용암금속","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":1567.5,"y":928},"size":{"width":85,"height":94},"angle":0,"id":"abdba132-0f73-4ce2-a22e-e5ef13b19d01","z":20,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"태상","font-size":14,"font-family":"Arial"}}},{"type":"shape.resource","position":{"x":1795,"y":928},"size":{"width":90,"height":94},"angle":0,"id":"fb16a155-dd1a-4070-9928-4db0af779a01","z":21,"attrs":{"image":{"xlinkHref":"./src/assets/resource01.svg","refWidth":"100%","refHeight":"100%"},"chartButton":{"refX":"100%","xlinkHref":"./src/assets/resource_chart01.svg"},"label":{"text":"한진철관","font-size":14,"font-family":"Arial"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"df4b7468-2798-4623-b5a3-5b9117111229"},"target":{"id":"8a7ad1d4-bfc6-4795-bca2-2862fb30343b"},"id":"a4306855-647e-4218-bf00-b564879ebe1e","z":22,"vertices":[{"x":-945,"y":754.85}],"attrs":{"apiAddress":{"text":"active2"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"e8a87600-00ab-4216-b9ea-3cd96ca99091"},"target":{"id":"8a7ad1d4-bfc6-4795-bca2-2862fb30343b"},"id":"245cef40-57f8-4acb-ae4f-06a0a72ac72e","z":23,"vertices":[{"x":-574.87,"y":754.85}],"attrs":{"apiAddress":{"text":"active1"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"ac06134e-de15-4857-8f74-754e14bc40ab"},"target":{"id":"42cf3f0c-02b4-4368-ace4-b98c51ce281c"},"id":"498c2a8d-bb71-43fb-baea-3db6e64a5d6e","z":24,"vertices":[{"x":-137.87,"y":744.85}],"attrs":{"apiAddress":{"text":"waiting"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"8dd9b63c-85df-4802-ab74-9e839879d6d9"},"target":{"id":"42cf3f0c-02b4-4368-ace4-b98c51ce281c"},"id":"7eac67f9-dc21-49c4-8b8a-8e6f1bcff54a","z":25,"attrs":{"apiAddress":{"text":"waiting"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"7961d38d-d5bc-48a7-96f4-a07651782a3b"},"target":{"id":"42cf3f0c-02b4-4368-ace4-b98c51ce281c"},"id":"286bce5b-ad63-4066-a640-d7ea19017cd6","z":26,"vertices":[{"x":590,"y":744.85}],"attrs":{"apiAddress":{"text":"optout"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"8a7ad1d4-bfc6-4795-bca2-2862fb30343b"},"target":{"id":"7a2dfb98-d383-487d-9138-2a5fc078f4ea"},"id":"f2cfdb86-3657-41c7-becb-9eeb0f7871e6","z":27,"vertices":[{"x":-705,"y":585}],"attrs":{"apiAddress":{"text":"active2"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"42cf3f0c-02b4-4368-ace4-b98c51ce281c"},"target":{"id":"7a2dfb98-d383-487d-9138-2a5fc078f4ea"},"id":"9f4b2e8b-4e34-4357-a7cc-07d18b7eade6","z":28,"vertices":[{"x":220,"y":585}],"attrs":{"apiAddress":{"text":"waiting"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"e33f9c9b-06cf-498c-8b19-1637da3a9d63"},"target":{"id":"7a2dfb98-d383-487d-9138-2a5fc078f4ea"},"id":"9903d06a-181e-40d2-846d-09b693503710","z":29,"vertices":[{"x":1010,"y":585}],"attrs":{"apiAddress":{"text":"active2"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"c77d28c4-e0de-42f4-b648-be90e92d4301"},"target":{"id":"22a9c2d1-0aad-49c3-b259-d30b83591bc6"},"id":"e1ab0783-4c0d-44ef-8f30-021f532471c5","z":31,"vertices":[{"x":1380.13,"y":744.85}],"attrs":{}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"abdba132-0f73-4ce2-a22e-e5ef13b19d01"},"target":{"id":"22a9c2d1-0aad-49c3-b259-d30b83591bc6"},"id":"feb6c4aa-8df3-400c-8fe4-a0c37bc16f8e","z":32,"attrs":{}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"fb16a155-dd1a-4070-9928-4db0af779a01"},"target":{"id":"22a9c2d1-0aad-49c3-b259-d30b83591bc6"},"id":"26fe6c0a-b006-4fde-a741-b13df86a7049","z":33,"vertices":[{"x":1840.13,"y":744.85}],"attrs":{}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":-900,"y":862},"angle":0,"id":"e0d6b3f7-534d-45a5-95ac-5fc6494c5aa0","z":34,"attrs":{"apiAddress":{"text":"active2"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":-760,"y":862},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"fbfc1cdf-427c-4fe7-8c5e-031ab34d4cb7","z":35,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"active2"}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":-410,"y":862},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"1a61e522-f90f-47c2-a17c-c622035f632f","z":36,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"active1"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":-545,"y":862},"angle":0,"id":"fc11b3b6-5085-4b4f-8f17-1c185388aec4","z":37,"attrs":{"apiAddress":{"text":"active1"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":-500,"y":664},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"254ba8e6-fa8c-475c-8da8-19b49c266bc7","z":38,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"active1"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":-635,"y":654},"angle":0,"id":"1a17431f-882c-49cc-a02b-2c72c1f391f3","z":39,"attrs":{"apiAddress":{"text":"active1"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":32,"y":870},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"6b7bbc16-44e2-4e21-ba42-c861505f0236","z":40,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"waiting"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":-108,"y":862},"angle":0,"id":"079e97f5-cdb1-4e8a-a007-63179f9a5e02","z":41,"attrs":{"apiAddress":{"text":"waiting"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":395,"y":860},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"178c5eac-8b9c-4c3e-8bf5-e3b9cd12fa94","z":42,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"waiting"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":250,"y":850},"angle":0,"id":"afaa9252-ccc5-46b2-ab52-ddbd993ea5ee","z":43,"attrs":{"apiAddress":{"text":"waiting"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":780,"y":860},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"fd6c6574-405c-4a6e-8e6c-c393ced7ddc0","z":44,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"optout"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":635,"y":850},"angle":0,"id":"e4d15b8e-9d8b-416c-ab4c-5a68148e9ad8","z":45,"attrs":{"apiAddress":{"text":"optout"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":1200,"y":630},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"31664dd1-77e5-4b34-a5a4-995a5e90d52e","z":46,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"active1"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":1050,"y":625},"angle":0,"id":"222c3af8-ed45-4ebb-9bd7-cd9aae177a71","z":47,"attrs":{"apiAddress":{"text":"active1"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":695,"y":480},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"0c34553a-d842-4be7-88a1-53d33804c4bb","z":48,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"active1"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":550,"y":470},"angle":0,"id":"645b476e-86b6-4ccc-8105-2a852842d6f5","z":49,"attrs":{"apiAddress":{"text":"active1"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}},{"type":"chart.Knob","sliceDefaults":{"legendLabel":"{value:.0f}","outer":{"offsetOnClick":0},"innerLabel":"{percentage:.0f}%","innerLabelMargin":6,"legendLabelLineHeight":6,"legendLabelMargin":14,"offset":0,"onClickEffect":{"type":"offset","offset":20},"onHoverEffect":null},"pieHole":0.7,"value":100,"size":{"width":60,"height":60},"serieDefaults":{"startAngle":0,"degree":360,"label":null,"showLegend":true,"labelLineHeight":6},"series":[{"degree":360,"data":[{"value":100,"fill":"#2c97de"}],"showLegend":true}],"position":{"x":435,"y":664},"angle":0,"min":0,"max":100,"fill":"#2c97de","id":"8c2dc54a-34de-48dc-88d9-f9f138597b4a","z":50,"attrs":{".legend-slice text":{"font-size":11,"fill":"#000"},"apiAddress":{"text":"waiting"}}},{"type":"shape.data","size":{"width":120,"height":80},"position":{"x":295,"y":644},"angle":0,"id":"f309b5bc-e32e-41d0-bd95-afb684d927d6","z":51,"attrs":{"apiAddress":{"text":"waiting"},"data1Label":{"text":"CBL","refX":0},"data1Value":{"text":"0","refX":"80%"},"data1Unit":{"text":"kW","refX":"100%"},"data2Label":{"text":"사용량","refX":0,"refY":20},"data2Value":{"text":"0","refX":"80%","refY":20},"data2Unit":{"text":"kW","refX":"100%","refY":20},"data3Label":{"text":"감축목표","refX":0,"refY":40},"data3Value":{"text":"0","refX":"80%","refY":40},"data3Unit":{"text":"kW","refX":"100%","refY":40},"data4Label":{"text":"감축","refX":0,"refY":60},"data4Value":{"text":"0","refX":"80%","refY":60},"data4Unit":{"text":"kW","refX":"100%","refY":60}}}]}},{"enabled":true,"name":"TEST","data":{"cells":[{"type":"standard.Rectangle","position":{"x":280,"y":610},"size":{"width":60,"height":60},"angle":0,"id":"c2fe3aa4-0280-4296-8dd4-695862c991dd","z":1,"attrs":{"body":{"stroke":"#7c68fc","fill":"#ffffff","rx":2,"ry":2,"width":50,"height":30,"stroke-width":2},"label":{"fill":"#7c68fc","text":"rect","font-family":"Arial","font-size":11},"root":{"dataTooltip":"Rectangle","dataTooltipPosition":"left","dataTooltipPositionSelector":".joint-stencil"}}},{"type":"standard.Ellipse","position":{"x":604,"y":610},"size":{"width":60,"height":60},"angle":0,"id":"1b16cf79-84ef-4b7a-8b29-1608a892b30a","z":2,"attrs":{"body":{"stroke":"#7c68fc","fill":"#ffffff","width":50,"height":30,"stroke-width":2},"label":{"fill":"#7c68fc","text":"ellipse","font-family":"Arial","font-size":12},"root":{"dataTooltip":"Ellipse","dataTooltipPosition":"left","dataTooltipPositionSelector":".joint-stencil"}}},{"type":"editor.Link","router":{"name":"normal"},"connector":{"name":"rounded"},"labels":[],"source":{"id":"c2fe3aa4-0280-4296-8dd4-695862c991dd"},"target":{"id":"1b16cf79-84ef-4b7a-8b29-1608a892b30a"},"id":"4eb9e85a-d12c-427f-a898-81552db6546f","z":3,"attrs":{"apiAddress":{"text":"active1"}}}]}},{"enabled":false,"name":"page-3","data":{"cells":[]}}]';
      //this.graph.fromJSON(JSON.parse(emergencyProcedure)[0].data); // 에러복구용
      this.graph.fromJSON(JSON.parse(window.localStorage.getItem('save'))[0].data);
      
      this.activePage = 0;
      this.pages = JSON.parse(window.localStorage.getItem('save'));
      this.createPage();
    },
  }

  App.MainView.init();
})();


















