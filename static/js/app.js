d3.json("data/samples.json").then((data) => {
    console.log(data); 
}); 

function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    console.log(data.metadata);
    var metadata = data.metadata;
    var filterMetadata = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = filterMetadata[0];
    var panel = d3.select("#sample-metadata")
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`)
    })
  });
}

function buildCharts(sample) {
  d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var filterSamples = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterSamples[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;

    //Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Electric"
      }
    }
    
    var bubble_data = [trace1]
    //var bubbleData = [trace1];
    var layout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"Sample Values by OTU ID"},
      //margin: {t:30}
    };
    Plotly.newPlot('bubble', bubble_data, layout);

    //Bar Chart - top 10 OTU's
    
    var trace1 = {
      x: sample_values.slice(0,10),//.reverse(),
      //y: otu_ids.slice(0,10).map(otuID >= `OTU ${otuID}`).reverse(),
      y: otu_ids.slice(0,10),//.reverse(),
      text: otu_labels.slice(0,10),//.reverse(),
      //name: "Top10",
      type: "bar",
      orientation: "h"
    };
    
    var bar_data = [trace1]

    var layout = {
      title: "Top Ten Sample Values by OTU ID", 
      //margin: {l: 50, r: 50, t: 100, b:100}
    };
    
    Plotly.newPlot('bar', bar_data, layout);
    
  });
}

function init() {
  //populate drop down
  var selector = d3.select("#selDataset");
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  //Get new data when new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  
}
//Initialize dashboard
init();