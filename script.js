// Fetch the CSV data
d3.csv("boston_311_2023_by_reason.csv").then(function(data) {
  // Process the data
  data.forEach(function(d) {
    d.Count = +d.Count; // Convert Count to a number
  });

  // Sort the data by Count in descending order
  data.sort(function(a, b) {
    return b.Count - a.Count;
  });

  // Take the top 10 reasons
  var topReasons = data.slice(0, 10);

  // Set up the dimensions for the chart
  var margin = { top: 70, right: 50, bottom: 50, left: 200 };
  var width = 800 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Create SVG element
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create x and y scales
  var x = d3.scaleLinear()
    .domain([0, d3.max(topReasons, function(d) { return d.Count; })])
    .range([0, width]);

  var y = d3.scaleBand()
    .domain(topReasons.map(function(d) { return d.reason; }))
    .range([0, height])
    .padding(0.1);

  // Create x and y axes
  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  // Append x and y axes to the SVG with gridlines
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll('text')
    .style("font-family", "Roboto")
    .style("font-size", "1.2em");

  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .selectAll('text')
    .style("font-family", "Roboto")
    .style("font-size", "1.2em");

  // Add horizontal gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height).tickFormat(""))
    .selectAll("line")
    .attr("stroke", "#ddd"); // Lighten the horizontal gridlines color

  // Add vertical gridlines
  svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .selectAll("line")
    .attr("stroke", "#ddd"); // Lighten the vertical gridlines color

  // Create bars
  svg.selectAll(".bar")
    .data(topReasons)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("y", function(d) { return y(d.reason); })
    .attr("width", function(d) { return x(d.Count); })
    .attr("height", y.bandwidth())
    .attr("fill", "#34D1BF");

  // Add labels on bars
  svg.selectAll(".label")
    .data(topReasons)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", function(d) { return x(d.Count); })
    .attr("y", function(d) { return y(d.reason) + y.bandwidth() / 2; })
    .attr("dx", "3") // padding-right
    .attr("dy", ".35em") // vertical-align: middle
    .style("font-family", "Roboto")
    .style("font-size", "0.8em")
    .text(function(d) { return d.Count; });

  // Headline
  svg.append("text")
    .attr("x", 0)
    .attr("y", -40)
    .style("font-family", "Roboto")
    .style("font-size", "2em")
    .style("font-weight", "bold")
    .style("fill", "#D1345B")
    .text("What are Bostonians calling 311 for?");

  // Subheadline
  svg.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .style("font-family", "Roboto")
    .style("font-size", "1em")
    .style("fill", "#777")
    .text("Top 10 reasons for 311 calls in the past year");

  svg.append("text")
    .attr("x", 0)
    .attr("y", height + margin.top - 10)
    .style("font-family", "Roboto")
    .style("font-size", "0.8em")
    .style("fill", "#777")
    .text("Source: Analyze Boston (https://data.boston.gov/dataset/311-service-requests)");
});