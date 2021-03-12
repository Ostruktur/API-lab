function startSlide10() {
  //Define width/height
  var width = 520,
    height = 520;

  //color setting util
  var color = d3.scale.category20();

  //Define the force layout and physics
  var force = d3.layout
    .force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

  //Create the main svg
  var svg = d3
    .select("#slide10 .emptyDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var graph = miserables;

  //apply the data to the force layout and start
  force.nodes(graph.nodes).links(graph.links).start();

  //Draw the links
  var link = svg
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  //Draw the nodes
  var node = svg
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function (d) {
      return color(d.group);
    })
    .call(force.drag);
  node.append("title").text(function (d) {
    return d.name;
  });

  //Bind the 'tick' event
  force.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  });
}

Execute;
