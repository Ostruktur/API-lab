//Here i will update and change the "database" to suit our need of plants and events, thinking this could be used for 
//the interaction-timeline of the plant, showcasing different events and tags from the plants lifetime


var pubs =
{
    "name": "Monstera",
    "children": [
        {
            "name": "Incidents","children": [
                {"name": "Draugt","children": [
                    {"name": "Dried out"},
                    {"name": "Dried out"}
                ]},
                {"name": "Water sick","children": [
                    {"name": "Moldy"}
                ]},
                {"name": "Infections","children": [
                    {"name": "Mites"},
                    {"name": "Mites"}
                ]},
                {"name": "Replanted","children": [
                    {"name": "Change of soil"}
                ]}
            ]
        },
        {
            "name": "Memories","children": [
                {"name": "AUT-21"},
                {"name": "AUT-22"},
                {"name": "AUT-23"},
                {"name": "AUT-26"},
                {"name": "AUT-27"},
                {"name": "AUT-28","children":[
                    {"name": "AFF-281"},
                    {"name": "AFF-282"},
                    {"name": "AFF-285"},
                    {"name": "AFF-286"}
                ]}
            ]
        },
        {"name": "Growth"},
        {
            "name": "Height","children": [
                {"name": "25cm"},
                {"name": "AUT-42"},
                {"name": "AUT-43","children": [
                    {"name": "AFF-431"},
                    {"name": "AFF-434","children":[
                        {"name": "ADD-4341"},
                        {"name": "ADD-4342"},
                    ]}
                ]},
                {"name": "AUT-44"}
            ]
        },
        {
            "name": "Seedlings","children": [
                {"name": "M.Smith 5/11-1978","children":[
                    {"name": "J.Doe 12/4 1979"},
                    {"name": "H.Unter 25/5 1979"},
                    {"name": "A.Hunter 4/4 1980"},
                    {"name": "M.Thorn 17/8 1980"},
                    {"name": "E.West 19/11 1981"}
                ]},
                {"name": "H.Hunter 1/5 1982"},
                {"name": "J.Snark 12/4 1985"},
                {"name": "O.Issa 8/9 1989"},
                {"name": "S.Hama 19/2 1995","children":[
                    {"name": "E.Oliver 11/11 1996"},
                    {"name": "H.Nue 18/7 1998"},
                    {"name": "Iggy 24/10 1999"},
                    {"name": "J.Doe 12/4 2000"}
                ]},
               
            ]
        },
        {
            "name": "Events","children": [
              {"name": "AUT-61","children":[
                  {"name": "AFF-611"},
                  {"name": "AFF-614","children":[
                      {"name": "ADD-6141"},
                      {"name": "ADD-6142"},
                  ]}
              ]},
              {"name": "AUT-62"},
              {"name": "AUT-63"},
              {"name": "AUT-64"},
              {"name": "AUT-65"},
             
            ]
        }
    ]
};
//Usable space
let diameter = 1400;

let margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = diameter,
    height = diameter;
    
let i = 0,
    duration = 350,
    root;

let tree = d3.layout.tree()
    .size([270, diameter / 2 - 10])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 3) / a.depth; });

let diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

let svg = d3.select("body").append("svg")
    .attr("width", width )
    .attr("height", height )
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

root = pubs;
root.x0 = height / 2;
root.y0 = 5;

root.children.forEach(collapse); // start with all children collapsed
update(root);

d3.select(self.frameElement).style("height", "1400px");

function update(source) {

  // Calculate new tree layout.
  let nodes = tree.nodes(root),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 200; });

  // Updating nodes
  let node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  let nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", click);
    
  //Here im trying to play around with transitions, and colorchanges    
  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "#82c9ce" : "#733430"; })
      //Testing out a mouseover event, but not sure how i'll make it wok with nodes that have children
      .on("mouseover", function(){ 
        d3.select(this)
            .style("fill", "grey");
  })
   .on("mouseout", function(){ 
        d3.select(this)
            .style("fill", function(d) { return d._children ? "#82c9ce" : "#733430"; });
  });

      //Text alignment doesn't really work consistantly
  nodeEnter.append("text")
      .attr("x", "y")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);
      


    //Testing out hover over effect and onClick-event
    //Did not work out the way i thought it would


  // Transition nodes to their new position.
  let nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  //Transitions i'm not really sure about, will try some different stuff
  let nodeExit = node.exit().transition()
      .duration(duration)
      //.attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  let link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Save old positions 
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  
  update(d);
}

// Collapse nodes
function collapse(d) {
  if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}