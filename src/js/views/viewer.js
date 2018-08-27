var App = App || {};

(function(){

  'use strict';

  App.MainView = {
    init: function() {
      var self = this;
      this.pages = JSON.parse(window.localStorage.getItem('save'));
      this.activePage = 0;
      this.intervals = [];

      // data load
      $.ajax({
        url:'src/sample/data.json',
        dataType:'JSON',
        type:'GET',
        success:function(data){
          self.data = data;

          // init graph
          self.graph = new joint.dia.Graph;

          // init paper
          self.paper = new joint.dia.Paper({
            width: 0,
            height: 100,
            model: self.graph,
            defaultLink: new joint.shapes.viewer.Link(),
          });

          self.cells = self.pages[self.activePage].data.cells || [];
          self.initPaperScroller();
          self.graph.fromJSON(self.pages[self.activePage].data);
          self.paperScroller.center();
          self.initCells();
          self.activeLink();
          self.initPage();
          self.initEvent();
        },
        error:function(xhr){
          console.log(xhr);
        }
      });
    },

    initPage: function(){
      var self = this;

      for(var i=0; i<this.pages.length; i++){
        var name = this.pages[i].name;

        if(this.pages[i].enabled){
          var html = '<li><a href="#">' + name + '</a></li>';
          $('#app-header .page-menu > ul').append(html);
        }
      }
      
      // page click, reset page
      $('#app-header .page-menu > ul > li').on('click', function(e){
        e.preventDefault();

        for(var i=0; i<self.intervals.length; i++){
          window.clearInterval(self.intervals[i]);
        }

        self.activePage = $(this).index();
        self.activeLinks = [];
        self.cells = self.pages[self.activePage].data.cells || [];
        self.graph.fromJSON(self.pages[self.activePage].data);
        self.paperScroller.center();
        self.initCells();
      });
    },

    initPaperScroller: function() {
      this.paperScroller = new joint.ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true
      });
      $('#paper').append(this.paperScroller.el);
      this.paperScroller.render();
    },

    initCells: function(){
    	var self = this;
      this.typeCells = {};

      for(var i=0; i<this.cells.length; i++){
        var cell = this.cells[i];

        this.typeCells[cell.type] = this.typeCells[cell.type] || [];
        this.typeCells[cell.type].push(cell);
      }

      var cnt = 0;
      this.intervals.push(setInterval(function(){
      	
      	// links
      	(function(){
      		self.activeLinks = [];

      		var links = self.typeCells['editor.Link'];
      		if(!links) return;

      		for(var i=0; i<links.length; i++){
      			var link = links[i];

      			if(link.attrs.apiAddress) {
	      			switch(link.attrs.apiAddress.text){
	      				case 'active1':
	      					var cell = self.graph.getCell(link.id);
	      					cell.attributes.attrs.line.targetMarker.d = 'M 10 -5 0 0 10 5 z';
	      					cell.attributes.attrs.line.sourceMarker.d = 'M 0 0 0 0';
	      					cell.attributes.attrs.line.strokeDasharray = 0;
	      					cell.attributes.attrs.line.strokeDashoffset = 0;
	      					self.activeLinks.push(link);
	      					break;
	      				case 'active2':
	      					var cell = self.graph.getCell(link.id);
	      					cell.attributes.attrs.line.targetMarker.d = 'M 10 -5 0 0 10 5 z';
	      					cell.attributes.attrs.line.sourceMarker.d = 'M 0 0 0 0';
	      					cell.attributes.attrs.line.strokeDasharray = 0;
	      					cell.attributes.attrs.line.strokeDashoffset = 0;
	      					self.activeLinks.push(link);
	      					break;
	      				case 'waiting':
	      					var cell = self.graph.getCell(link.id);
	      					cell.attributes.attrs.line.sourceMarker.d = 'M 10 -5 0 0 10 5 z';
	      					cell.attributes.attrs.line.targetMarker.d = 'M 0 0 0 0';
	      					break;
	      				case 'optout':
	      					var cell = self.graph.getCell(link.id);
	      					cell.removeLabel();
					        cell.appendLabel({
					          markup: [
					            {
					              tagName: 'circle',
					              selector: 'body'
					            }, {
					              tagName: 'text',
					              selector: 'label'
					            }
					          ],
					          attrs: {
					            label: {
					              text: 'OPT OUT',
					              fill: '#000000',
					              stroke: '#000000',
					              fontSize: 12,
					              textAnchor: 'middle',
					              yAlignment: 'middle',
					              pointerEvents: 'none'
					            },
					            body: {
					              ref: 'label',
					              fill: '#FFFFFF',
					              stroke: '#FFFFFF',
					              strokeWidth: 1,
					              refR: 1,
					              refCx: 0,
					              refCy: 0
					            }
					          },
					          position: {
					            distance: 0.5
					          }
					        });
	      					break;
	      			}
	      		}
      		}
      	})();

      	// charts
      	(function(){
      		var charts = self.typeCells['chart.Knob'];
      		if(!charts) return;

      		for(var i=0; i<charts.length; i++){
      			var chart = charts[i];

      			if(chart.attrs.apiAddress){
	      			switch(chart.attrs.apiAddress.text){
	      				case 'active1': ///////////
	      					var cell = self.graph.getCell(chart.id);
	    						var values = self.data['active1'][cnt];
	                cell.transition('value', values.performance, { duration: 1000, timingFunction: joint.util.timing.exponential });
	      					break;
	      				
	      				case 'active2': ////////////
	      					var cell = self.graph.getCell(chart.id);
									var values = self.data['active2'][cnt];
	                cell.transition('value', values.performance, { duration: 1000, timingFunction: joint.util.timing.exponential });
	      					break;
	      					
	      				case 'waiting':
	      					var cell = self.graph.getCell(chart.id);
									if(cell) cell.remove();
	      					break;
	      					
	      				case 'optout':
	      					var cell = self.graph.getCell(chart.id);
									if(cell) cell.remove();
	      					break;
	      			}
	      		}
      		}
      	})();

      	// data
      	(function(){
      		var datas = self.typeCells['shape.data'];
      		if(!datas) return;

      		for(var i=0; i<datas.length; i++){
      			var data = datas[i];

      			if(data.attrs.apiAddress){
	      			switch(data.attrs.apiAddress.text){
	      				case 'active1':
	      					var values = self.data['active1'][cnt];
	      					var cell = self.graph.getCell(data.id);

					        cell.attributes.attrs.data1Value.text = values.cbl;
					        cell.attributes.attrs.data2Value.text = values.usage;
					        cell.attributes.attrs.data3Value.text = values.goal;
					        cell.attributes.attrs.data4Value.text = values.reduction;
	      					break;

	      				case 'active2':
	      					var values = self.data['active2'][cnt];
	      					var cell = self.graph.getCell(data.id);

					        cell.attributes.attrs.data1Value.text = values.cbl;
					        cell.attributes.attrs.data2Value.text = values.usage;
					        cell.attributes.attrs.data3Value.text = values.goal;
					        cell.attributes.attrs.data4Value.text = values.reduction;
	      					break;

	      				case 'waiting':
	      					var cell = self.graph.getCell(data.id);

	      					cell.attributes.attrs.data1Value.text = values.cbl;
					        cell.attributes.attrs.data2Value.text = values.usage;

	      					cell.attributes.attrs.data3Label.display = 'none';
	      					cell.attributes.attrs.data3Value.display = 'none';
	      					cell.attributes.attrs.data3Unit.display = 'none';
	      					cell.attributes.attrs.data4Label.display = 'none';
	      					cell.attributes.attrs.data4Value.display = 'none';
	      					cell.attributes.attrs.data4Unit.display = 'none';
	      					break;
	      				
	      				case 'optout':
	      					var cell = self.graph.getCell(data.id);

	      					cell.attributes.attrs.data1Value.text = values.cbl;
					        cell.attributes.attrs.data2Value.text = values.usage;

	      					cell.attributes.attrs.data3Label.display = 'none';
	      					cell.attributes.attrs.data3Value.display = 'none';
	      					cell.attributes.attrs.data3Unit.display = 'none';
	      					cell.attributes.attrs.data4Label.display = 'none';
	      					cell.attributes.attrs.data4Value.display = 'none';
	      					cell.attributes.attrs.data4Unit.display = 'none';
	      					break;
	      			}
	      		}
      		}
      	})();

      	self.resetCells();

      	cnt++;
        if(cnt >= self.data.total - 1) cnt = 0;
      }, 1000));
    },

    resetCells: function(){
      var resetCells = [];
      for(var i=0; i<this.cells.length; i++){
        var cell = this.graph.getCell(this.cells[i].id);

        if(cell) resetCells.push(cell)
      }

      this.graph.resetCells(resetCells);
    },

    activeLink: function(){
      var self = this;
      var dis = 0;
      var dis2 = 0.5;
      
      setInterval(function(){
      	if(!self.activeLinks) return;

        for(var i=0; i<self.activeLinks.length; i++){
        	var link = self.activeLinks[i];
        	var cell = self.graph.getCell(link.id);

        	(function(link){
	        	link.removeLabel();
		        link.removeLabel();
		        link.appendLabel({
		          markup: [
		            {
		              tagName: 'circle',
		              selector: 'body'
		            }, {
		              tagName: 'text',
		              selector: 'label'
		            }
		          ],
		          attrs: {
		            label: {
		              text: '½',
		              fill: '#000000',
		              stroke: '#000000',
		              fontSize: 4,
		              textAnchor: 'middle',
		              yAlignment: 'middle',
		              pointerEvents: 'none'
		            },
		            body: {
		              ref: 'label',
		              fill: '#000000',
		              stroke: '#000000',
		              strokeWidth: 1,
		              refR: 1,
		              refCx: 0,
		              refCy: 0
		            }
		          },
		          position: {
		            distance: dis
		          }
		        });

		        link.appendLabel({
		          markup: [
		            {
		              tagName: 'circle',
		              selector: 'body'
		            }, {
		              tagName: 'text',
		              selector: 'label'
		            }
		          ],
		          attrs: {
		            label: {
		              text: '½',
		              fill: '#000000',
		              stroke: '#000000',
		              fontSize: 4,
		              textAnchor: 'middle',
		              yAlignment: 'middle',
		              pointerEvents: 'none'
		            },
		            body: {
		              ref: 'label',
		              fill: '#000000',
		              stroke: '#000000',
		              strokeWidth: 1,
		              refR: 1,
		              refCx: 0,
		              refCy: 0
		            }
		          },
		          position: {
		            distance: dis2
		          }
		        });

		        (dis >= 1) ? dis = 0.01 : dis += 0.005;
		        (dis2 >= 1) ? dis2 = 0.01 : dis2 += 0.005;
	        })(cell);
        }
      }, 100);
    },

    initEvent: function () {
    	this.paper.on('cell:pointerdown', function(cellView) {
        if(cellView.model.attributes.type == 'chart.Knob'){
        	$('#chart-modal').modal('show');

        	Highcharts.chart('piechart', {
				    chart: {
				        type: 'pie',
				        options3d: {
				            enabled: true,
				            alpha: 45,
				            beta: 0
				        }
				    },
				    title: {
				        text: 'Browser market shares at a specific website, 2014'
				    },
				    tooltip: {
				        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				    },
				    plotOptions: {
				        pie: {
				            allowPointSelect: true,
				            cursor: 'pointer',
				            depth: 35,
				            dataLabels: {
				                enabled: true,
				                format: '{point.name}'
				            }
				        }
				    },
				    series: [{
				        type: 'pie',
				        name: 'Browser share',
				        data: [
				            ['Firefox', 45.0],
				            ['IE', 26.8],
				            {
				                name: 'Chrome',
				                y: 12.8,
				                sliced: true,
				                selected: true
				            },
				            ['Safari', 8.5],
				            ['Opera', 6.2],
				            ['Others', 0.7]
				        ]
				    }]
				});
        }
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
  }

  App.MainView.init();
})();