//selecting SVG element
var visual = d3.select("#svg_donut");
//saving as a variable
var arc = d3.svg
  .arc()
  //adding 4 parameters
  .innerRadius(50)
  .outerRadius(100)
  .startAngle(0)
  .endAngle(1.5 * Math.PI);
//create path
visual
  .append("path")
  //append path to SVG element
  .attr("d", arc)
  //moving arc from default left corner to centre
  .attr("transform", "translate(300,200)");
