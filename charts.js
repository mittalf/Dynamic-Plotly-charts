function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //console.log(result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  var allSamples = data.samples; 
  //console.log(allSamples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
  var matchingSampleArray = allSamples.filter(sampleObj => sampleObj.id == sample);
  //console.log(matchingSampleArray);
 
  //Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;
  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
 
 
  //  5. Create a variable that holds the first sample in the array.
  var resultSample = matchingSampleArray[0];  
  console.log(resultSample);

  //Create a variable that holds the first sample in the metadata array.
  var result = resultArray[0];
  //console.log(result)


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otu_ids = resultSample.otu_ids
  var otu_labels = resultSample.otu_labels;
  var sample_values = resultSample.sample_values;

   
  //Create a variable that holds the washing frequency.

  var washFreq = result.wfreq
  console.log('wash freq' + washFreq)

  // 7. Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 

  //var sortedOtu_ids = otu_ids.sort((a,b) => a - b).reverse();
  //console.log('sorted ids ' + sortedOtu_ids);
  var topTenOtu_ids = otu_ids.slice(0,10).reverse(); 
  console.log(topTenOtu_ids);

  var topTenlabels = otu_labels.slice(0,10).reverse(); 
  //console.log(topTenlabels);

  var topTenValues = sample_values.slice(0,10).reverse(); 
  //console.log(topTenValues);
  var text1 = "OTU ";

  var yticks= [];
  for (i =0;i < topTenOtu_ids.length; i++){
  //console.log(text1.concat(topTenOtu_ids[i]))
     yticks[i] = text1.concat(topTenOtu_ids[i])
    //  console.log(yticks[i])            
  }

  console.log(`yticks ${yticks}`)

  // // 8. Create the trace for the bar chart. 
  var barData = [{
      x: topTenValues,
      // Y: topTenOtu_ids,
      y: yticks,
      text: topTenlabels,
      type: "bar",
      orientation: 'h',
      label: topTenOtu_ids
    }];
    // 9. Create the layout for the bar chart. 
  var barLayout = {
       title: "Top 10 Bacteria Cultures Found",
       showticklabels: true
          
       
    };
    // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
  var desired_maximum_marker_size = 40;

  var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          //sizeref: .05,
          //sizemode: 'area',
          colorscale: 'Jet'
          // colorscale: [
          //   ['0.0', 'rgb(165,0,38)'],
          //   ['0.111111111111', 'rgb(215,48,39)'],
          //   ['0.222222222222', 'rgb(244,109,67)'],
          //   ['0.333333333333', 'rgb(253,174,97)'],
          //   ['0.444444444444', 'rgb(254,224,144)'],
          //   ['0.555555555556', 'rgb(224,243,248)'],
          //   ['0.666666666667', 'rgb(171,217,233)'],
          //   ['0.777777777778', 'rgb(116,173,209)'],
          //   ['0.888888888889', 'rgb(69,117,180)'],
          //   ['1.0', 'rgb(49,54,149)']]
        }
      }
    ];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample' , 
      showlegend: false,
      xaxis: { title: "OTU ID"},
      //height: 600,
      //width: 600
  
    };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

   
    // 4. Create the trace for the gauge chart.
  var gaugeData = [{
    domain: { x: [0, 1], y: [0, 1] },
		value: washFreq,
		title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week", font: { size: 20 }  },
		type: "indicator",
		mode: "gauge+number",
    gauge:{
      axis: {range:[null,10]},
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8, 10], color: "green" }
       ]
    }
  }];
    
    // 5. Create the layout for the gauge chart.
  var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot(gauge,gaugeData,gaugeLayout);

  });
}
