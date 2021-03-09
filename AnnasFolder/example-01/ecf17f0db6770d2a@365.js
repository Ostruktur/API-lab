// https://observablehq.com/@d3/donut-chart@365
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["population-by-age.csv",new URL("./files/bee673b386dd058ab8d2cf353acbedc6aa01ebd1e6f63e2a9ab1b4273c7e6efd1eeea526345e4be7f0012d5db3ec743ef39ad9e6a043c196670bf9658cb02e79",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","d3","data"], function(md,d3,data){return(
md`# Donut Chart

This chart shows the estimated population by age in the United States as of 2015. The total estimated population is ${d3.sum(data, d => d.value).toLocaleString()}. Compare to a [pie chart](/@d3/pie-chart). Data: [U.S. Census](https://www.census.gov/data.html)`
)});
  main.variable(observer("chart")).define("chart", ["pie","data","d3","width","height","color","arc"], function(pie,data,d3,width,height,color,arc)
{
  const arcs = pie(data);

  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  svg.selectAll("path")
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => d.data.value.toLocaleString()));

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("population-by-age.csv").text(), d3.autoType)
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
Math.min(width, 500)
)});
  main.variable(observer("arc")).define("arc", ["width","height","d3"], function(width,height,d3)
{
  const radius = Math.min(width, height) / 2;
  return d3.arc().innerRadius(radius * 0.67).outerRadius(radius - 1);
}
);
  main.variable(observer("pie")).define("pie", ["d3"], function(d3){return(
d3.pie()
    .padAngle(0.005)
    .sort(null)
    .value(d => d.value)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
