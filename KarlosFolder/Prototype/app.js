
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md
)});
  main.variable(observer("chart")).define("chart", ["DOM","width","height","data","d3","invalidation","color"], function(DOM,width,height,data,d3,invalidation,color)
{ 
  // Here, I addedvariables and changed width and height of canvas.
  var width = 1500;
  var height = 500;

  

  const context = DOM.context2d(width, height);
  const nodes = data.map(Object.create);

// in the next section I changed some force values, (how wide do circles spread around the pointer(token to be in the prototype), and the gap between the cirlces)
  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.008)) // the strength of the force in X axis
      .force("y", d3.forceY().strength(0.008)) // the strength of the force in Y axis
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3)) // it creates circle collision force
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -200 * 6 / 4)) // creates forces in many bodies
      .on("tick", ticked);



  d3.select(context.canvas) //selects an element from document
      .on("touchmove", event => event.preventDefault())
      .on("pointermove", pointed);

  // here I added one d3 function
  var pepo = d3.randomUniform(500, 500*50);

  invalidation.then(() => simulation.stop());
  // here I input on where the force should be placed according to the pointer
  function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - width / 2;
    nodes[0].fy = y - height / 2;
  }

  d3.pointer
  //ticked function joins the values to cirlcles and updates their position, this is where I have used "randomUniform"
  function ticked() {
    context.clearRect(500, 500, pepo, pepo);
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
  // here i changed values that define the size of circles
  // function "randomuniform" return a radnom number between "k" and "k*4"
  const k = width / 250;
  const r = d3.randomUniform(k, k * 4);
  return Array.from({length: 100}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
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
