

// The Dataset consists of:
// year,player,appearance,goals,goals_per_game, assists,assists_per_game  

// If you click on the year, it will zoom in.

// Basic Options
var margin = 100,
diameter = 960;

var color = d3.scale.category20c();
var pack = d3.layout.pack().padding(2).size([diameter - margin, diameter - margin]).value(function(d) {
return d.assists;
});

var svg = d3.select("#chart").append("svg").attr("width", diameter).attr("height", diameter).append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


//Here i will try to find an online plantbase API to tie into or try creating a more limited dataset on my own.
d3.csv("Monstera.csv", function(error, data) {
    console.log(data)
_.each(data, function(element, index, list) {
    element.pop = +element.pop;
});


// THE FUNCTION to turn your data from CSV into
// nested data object (this does the work for you)

function genJSON(csvData, groups) {

    var genGroups = function(data) {
        return _.map(data, function(element, index) {
            return {
                name : index,
                children : element
            };
        });
    };

    var nest = function(node, curIndex) {
        if (curIndex === 0) {
            node.children = genGroups(_.groupBy(csvData, groups[0]));
            _.each(node.children, function(child) {
                nest(child, curIndex + 1);
            });
        } else {
            if (curIndex < groups.length) {
                node.children = genGroups(_.groupBy(node.children, groups[curIndex]));
                _.each(node.children, function(child) {
                    nest(child, curIndex + 1);
                });
            }
        }
        return node;
    };
    return nest({}, 0);
}


// CALL FUNCTION WITH ARRAY OF GROUPS

// Unlike before, this controls the circles.
// You don't change any other options.
// This i will try to change to suit our concepts needs, plantbased database or writing my own
var preppedData = genJSON(data, ['Genus', 'Authorship', 'Taxonomic status in TPL']);



// YOUR DATA VISUALIZATION CODE HERE

var focus = preppedData,
    nodes = pack.nodes(preppedData),
    view;

console.log(nodes);



var circle = svg.selectAll("circle").data(nodes).enter().append("circle").attr("class", function(d) {
    return d.parent ? d.children ? "node" : "node node--leaf" : "node node--preppedData";
}).style("fill", function(d) {
    return d.children ? color(d.depth) : null;
}).on("click", function(d) {
    if (focus !== d)
        zoom(d), d3.event.stopPropagation();
});

 var text = svg.selectAll("text").data(nodes).enter().append("text").attr("class", "label").style("fill-opacity", function(d) {
    return d.parent === preppedData ? 1 : 0.15;
}).style("display", function(d) {
    return d.parent === preppedData ? "inline" : "inline";
}).style("font-size", function(d) {
    return d.parent === preppedData ? "24px" : "6px";
}).text(function(d) {
    if (typeof d.genus != 'undefined'){
        var textName = d.name;
    }else{
    var textName = d.name; 
    }
    return textName;
});

var node = svg.selectAll("circle,text");

d3.select("body").style("background", color(-1)).on("click", function() {
    zoom(preppedData);
});

zoomTo([preppedData.x, preppedData.y, preppedData.r * 2 + margin]);

function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition().duration(d3.event.altKey ? 7500 : 750).tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) {
            zoomTo(i(t));
        };
    });

    transition.selectAll("text").filter(function(d) {
        return d.parent === focus || this.style.display === "inline";
    }).style("fill-opacity", function(d) {
        return d.parent === focus ? 1 : 0.15;
    }).style("font-size", function(d) {
    return d.parent === focus ? "24px" : "6px";
}).each("start", function(d) {
        if (d.parent === focus)
            this.style.display = "inline";
    }).each("end", function(d) {
        if (d.parent !== focus)
            this.style.display = "inline";
    });
}


function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function(d) {
        return d.r * k;
    });
}

});

d3.select(self.frameElement).style("height", diameter + "px");