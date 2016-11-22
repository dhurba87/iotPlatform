(function() {
    var lineChartId = 0;
    freeboard.addStyle('.line-widget-wrapper', "width: 100%;text-align: center;");
    freeboard.addStyle('.line-widget', "width:400px;height:300px;display:inline-block;");
    var myWidgetPlugin = function(settings) {
        var self = this;
        var currentSettings = settings;
        var myTextElement = $("<span></span>");
        var thisLineChartID = "line-" + lineChartId++;
        var lineChartElement = $('<div class="line-widget" id="' + thisLineChartID + '"></div>');
        var myLineChart;
        var rendered = false;
        var value = [];
        function createLineChart(newValue, labels, colors, title, value_labels) {
        	$.each(newValue, function(i, v){
        		value[i] = [v];
        	});
            if (!rendered) {
                return;
            }
            var label_array = [];
            var dataset_array = [];
            $.each(labels, function(index, value) {
                if (labels[index].name != "") {
                    label_array.push(labels[index].name);
                }
            });
            $.each(value, function(i, v){
            	dataset_array.push({
	            	label: value_labels[i].name,
	            	borderColor: colors[i].name,
		            backgroundColor: colors[i].name,
		            fill: false,
		            data: value[i],
	            });
            });
            
            var lineChartData = {
                labels: label_array,
                datasets: dataset_array
            };
            lineChartElement.empty();
            lineChartElement.append('<canvas id="lineChart-' + lineChartId + '" width="400" height="400"></canvas>');
            var ctx = document.getElementById("lineChart-" + lineChartId);
            myLineChart = Chart.Line(ctx, {
                data: lineChartData,
	            options: {
	                responsive: true,
	                title:{
	                    display:true,
	                    text: title
	                },
	                tooltips: {
	                    mode: 'index',
	                    intersect: false,
	                },
	                hover: {
	                    mode: 'nearest',
	                    intersect: true
	                },
	                scales: {
	                    xAxes: [{
	                        display: true,
	                        scaleLabel: {
	                            display: true,
	                            labelString: 'Month'
	                        }
	                    }],
	                    yAxes: [{
	                        display: true,
	                        scaleLabel: {
	                            display: true,
	                            labelString: 'Value'
	                        }
	                    }]
	                }
	            }
            });
        }
        self.render = function(containerElement) {
            rendered = true;
            $(containerElement).append($('<div class="line-widget-wrapper"></div>').append(lineChartElement));
        }
        self.onSettingsChanged = function(newSettings) {
            currentSettings = newSettings;
            myTextElement.html(newSettings.title);
            createLineChart([], currentSettings.label, currentSettings.color, currentSettings.title, currentSettings.value_label);
        }
        self.onCalculatedValueChanged = function(settingName, newValue) {
        	if (!_.isUndefined(myLineChart)) {
        		$.each(newValue, function(i,v){
        			if(_.isUndefined(value[i])){
        				value[i] = [];
        				createLineChart(newValue, currentSettings.label, currentSettings.color, currentSettings.title, currentSettings.value_label);
        			}
					if(value[i].length >= currentSettings.label.length){
			     		value[i].shift();
			     	}else{
			     		value[i].push(newValue[i]);
			     	}
				    myLineChart.data.datasets[0].data[i] = newValue[i];
        		});
	        	myLineChart.update();

            } else {
                createLineChart(newValue, currentSettings.label, currentSettings.color, currentSettings.title, currentSettings.value_label);
            }
        }
        self.onDispose = function() {}
        self.getHeight = function() {
            return 7;
        }
        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        "type_name": "line_chart",
        "display_name": "Line Chart",
        "description": "Some sort of description <strong>with optional html!</strong>",
        "external_scripts": [
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js"
        ],
        "fill_size": false,
        "settings": [{
            name: "title",
            display_name: "Title",
            type: "text"
        }, {
            name: "value",
            display_name: "Value",
            type: "calculated",
            multi_input: "true"
        }, {
            name: "label",
            display_name: "X-axis Labels",
            type: "array",
            settings: [{
                name: "name",
                display_name: "Name",
                type: "text"
            }]
        }, {
            name: "value_label",
            display_name: "Value Labels",
            type: "array",
            settings: [{
                name: "name",
                display_name: "Name",
                type: "text"
            }]
        }, {
            name: "color",
            display_name: "Colors",
            type: "array",
            settings:[{
            	name: "name",
            	display_name: "Name",
            	type: "text",
            }]
        }, ],
        newInstance: function(settings, newInstanceCallback) {
            newInstanceCallback(new myWidgetPlugin(settings));
        }
    });

}());