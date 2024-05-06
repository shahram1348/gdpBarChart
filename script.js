// Bar Chart project for freecodecamp lessons. By Shahram Motaghiani
let dataset;
const w = 1000;
const h = 500;
const svg = d3
  .select("svg")
  .attr("width", w)
  .attr("height", h);
const padding = 60;

// Getting data as json file then convert it to array
  const req = new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);

  req.onload = () => {
    const json = JSON.parse(req.responseText);
    dataset = json.data;
  
// Draw canvas:
const barWidth = (w - 2 * padding) / dataset.length;


// Generate Scales:
const widthScale = d3
                .scaleLinear()
                .domain([0, dataset.length - 1])
                .range([padding, w - padding]);
    //hightScale 
const heightScale = d3
                .scaleLinear()
                .domain([0, d3.max(dataset, (d) => d[1])])
                .range([0 , h - 2*padding]);
// Scale x axis:
const datesArr = dataset.map( (d) =>  new Date(d[0]));

const xScale = d3.scaleTime()
                 .domain([d3.min(datesArr), d3.max(datesArr)])
                 .range([padding, w - padding])
const yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, (d) => d[1])])
                 .range([h - padding, padding]); 
// Generate axis:
const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale);
// Justify the x axis:
svg
  .append("g").call(xAxis).attr("id", "x-axis")
  .attr("transform", "translate(0," + (h - padding) + ")");
  
  

// Justify the bars at y axis:
svg
  .append("g")
  .attr("transform", "translate(" + padding + ", 0)")
  .call(yAxis)
  .attr("id", "y-axis")
 

// tooltip:
const tooltip = d3.select('body')
.append('div')
.attr('id', 'tooltip')
.style('visibility', 'hidden')
.style('width', 'auto')
.style('height', 'auto');

 // Generate bars:
  svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("width", barWidth)
   .attr("x", (d, i) => widthScale(i))
   .attr("y", (d) => h - heightScale(d[1]) - padding)
   .attr("height", (d) => heightScale(d[1]))
   .attr("fill", "navy")
   .attr("data-date", (d) => d[0])
   .attr("data-gdp", (d) => d[1])
   .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`Date:${d[0]}<br>GDP: ${d[1]} Billion`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
        document.querySelector("#tooltip").setAttribute("data-date", d[0]);
      })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });   

};
req.send();
