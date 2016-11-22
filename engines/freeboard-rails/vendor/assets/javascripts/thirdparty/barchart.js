  (function (){

  freeboard.loadWidgetPlugin({
    "type_name"   : "bar_chart",
    "display_name": "Bar Chart",
        "description" : "Some sort of description <strong>with optional html!</strong>",
        "external_scripts": [
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js"
    ],
    "fill_size" : false,
    "settings"    : [
      {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated",
                multi_input: "true"
            },
            {
                name: "label",
                display_name: "Labels",
                type: "array",
                settings: [
          {
            name: "name",
            display_name: "Name",
            type: "text"
          }
        ]
            }
    ],
    newInstance   : function(settings, newInstanceCallback)
    {
      newInstanceCallback(new barchartPlugin(settings));
    }
  });

  var barchartID = 0;
  freeboard.addStyle('.bar-widget-wrapper', "width: 100%;text-align: center;");
  freeboard.addStyle('.bar-widget', "width:300px;height:300px;display:inline-block;");

  var barchartPlugin = function(settings){

    var self = this;
    var currentSettings = settings;
    var myTextElement = $("<span></span>");
    var thisbarChartID = "bar-" + barchartID++;
    var barChartElement = $('<div class="bar-widget" id="' + thisbarChartID + '"></div>');
    var myBarChart;
    var rendered = false;
    function createBarChart(newValue)
    {
        if (!rendered){
            return;
        }
        barChartElement.empty();
        barChartElement.append('<canvas id="myChart-' + barchartID + '" width="400" height="400"></canvas>');

        var ctx = document.getElementById("myChart-"+ barchartID);
        myBarChart = new Chart(ctx, {
            "type": "bar",
            "data":{
                "labels":["words"],
               "datasets":[{
                  "fillcolor":"rgba(220,220,220,0.5)",
                  "data": [newValue],
                  "backgroundColor": ['rgba(181, 70, 70, 1)'
            ]
               }],
            "options":{
               "legend":{
                  "display": false
               },
               tooltips:{
                "enabled": false
               }
            }
            }
       });
    }

    self.render = function(containerElement)
    {
      rendered = true;
      $(containerElement).append(myTextElement).append($('<div class="bar-widget-wrapper"></div>').append(barChartElement));;
    }

    self.onCalculatedValueChanged = function(settingName, newValue)
    {
      debugger
        createBarChart(newValue[0]);
    }

    self.getHeight = function () {
        return 5;
    }

  };

}());
