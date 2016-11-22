(function() {
    var pieChartId = 0;
    freeboard.addStyle('.pie-widget-wrapper', "width: 100%;text-align: center;");
    freeboard.addStyle('.pie-widget', "width:300px;height:300px;display:inline-block;");
    var myWidgetPlugin = function(settings) {
        var self = this;
        var currentSettings = settings;
        var myTextElement = $("<span></span>");
        var thisPieChartID = "pie-" + pieChartId++;
        var pieChartElement = $('<div class="pie-widget" id="' + thisPieChartID + '"></div>');
        var myPieChart;
        var rendered = false;

        function createPieChart(newValue, include_doughnut, labels, colors) {
            if (!rendered) {
                return;
            }
            var label_array = [];
            var color_array = [];
            $.each(labels, function(index, value) {
                if (labels[index].name != "") {
                    label_array.push(labels[index].name);
                }
            });
            $.each(colors, function(index, value) {
                if (colors[index].name != "") {
                    color_array.push(colors[index].name);
                }
            });
            pieChartElement.empty();
            pieChartElement.append('<canvas id="pieChart-' + pieChartId + '" width="400" height="400"></canvas>');
            var ctx = document.getElementById("pieChart-" + pieChartId);
            myPieChart = new Chart(ctx, {
                type: (include_doughnut) ? "doughnut" : "pie",
                data: {
                    labels: label_array,
                    datasets: [{
                        data: newValue,
                        backgroundColor: color_array,
                        hoverBackgroundColor: color_array
                    }]
                }
            });
        }
        self.render = function(containerElement) {
            rendered = true;
            $(containerElement).append(myTextElement).append($('<div class="pie-widget-wrapper"></div>').append(pieChartElement));;
        }
        self.onSettingsChanged = function(newSettings) {
            currentSettings = newSettings;
            myTextElement.html(newSettings.title);
            if (newSettings.include_doughnut || currentSettings.color.length > 0) {
                createPieChart(0, currentSettings.include_doughnut, currentSettings.label, currentSettings.color);
            } else {
                createPieChart(0, currentSettings.include_doughnut, currentSettings.label, currentSettings.color);
            }
        }
        self.onCalculatedValueChanged = function(settingName, newValue) {
            if (!_.isUndefined(myPieChart)) {
                if (myPieChart.data.datasets[0].data.length < newValue.length) {
                    createPieChart(newValue, currentSettings.include_doughnut, currentSettings.label, currentSettings.color);
                } else {
                    $.each(myPieChart.data.datasets[0].data, function(index, value) {
                        myPieChart.data.datasets[0].data[index] = newValue[index];
                    });
                    myPieChart.update();
                }
            } else {
                createPieChart(newValue, currentSettings.include_doughnut, currentSettings.label, currentSettings.color);
            }
        }
        self.onDispose = function() {}
        self.getHeight = function() {
            return 5;
        }
        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        "type_name": "pie_chart",
        "display_name": "Pie Chart",
        "description": "Some sort of description <strong>with optional html!</strong>",
        "external_scripts": [
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js"
        ],
        "fill_size": false,
        "settings": [{
            name: "include_doughnut",
            display_name: "Doughnut Chart",
            type: "boolean"
        }, {
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
            display_name: "Labels",
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
            settings: [{
                name: "name",
                display_name: "Name",
                type: "text"
            }]
        }, ],
        newInstance: function(settings, newInstanceCallback) {
            newInstanceCallback(new myWidgetPlugin(settings));
        }
    });
}());