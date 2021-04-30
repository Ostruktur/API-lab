
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md
)});
  main.variable(observer("chart")).define("chart", ["DOM","width","height","data","d3","invalidation","color"], function(DOM,width,height,data,d3,invalidation,color)
{ 
  var width = 400;
  var height = 200;

  const context = DOM.context2d(width, height);
  const nodes = data.map(Object.create);

  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.009))
      .force("y", d3.forceY().strength(0.009))
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 1.8 / 2))
      .on("tick", ticked);

  d3.select(context.canvas)
      .on("touchmove", event => event.preventDefault())
      .on("pointermove", pointed);

  invalidation.then(() => simulation.stop());
  
  function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - width / 2;
    nodes[0].fy = y - height / 2;
  }

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    for (const d of nodes) {
      context.beginPath();
      context.moveTo(d.x + d.r, d.y);
      context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
      context.fillStyle = color(d.group);
      context.fill();
    }
    context.restore();
  }

  return context.canvas;
}

);

  

  main.variable(observer("data")).define("data", ["width","d3","n"], function(width,d3,n)
{
  const k = width / 200;
  const r = d3.randomUniform(k, k * 4);
  return Array.from({length: 200}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
}
);
  main.variable(observer("n")).define("n", function(){return(
4
)});
  main.variable(observer("color")).define("color", ["d3","n"], function(d3,n){return(
d3.scaleOrdinal(d3.range(n), ["transparent"].concat(d3.schemeTableau10))
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
