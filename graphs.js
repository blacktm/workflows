var GRAPH = GRAPH || {};

GRAPH.define = function (name) {
  var parts = name.split('.'),
      parent = GRAPH,
      i;

  // strip redundant leading global
  if (parts[0] === 'GRAPH') {
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i++) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }
  return parent;
};

////////////////////////////////////////////////////////////

GRAPH.define('GRAPH.Core');

GRAPH.Core = function () {

  ///////////////
  // dependencies

  /////////////
  // properties

  //////////
  // methods
  
  //////////////////
  // init procedures
  
  /////////////////
  // public methods
  return {
  };

}();

////////////////////////////////////////////////////////////

GRAPH.define('GRAPH.Graph');

GRAPH.Graph = function () {

  ///////////////
  // dependencies

  /////////////
  // properties
  var graph = {
        unconnected: {}
      },
      nodeID = 0;

  //////////
  // methods
  var addNode = function (node) {
    graph.unconnected[nodeID] = {
      name: node.name,
      ref: node.ref,
      inlets: node.inlet,
      outlets: node.outlet
    };
    
    console.log(graph);
    nodeID++;
  };
  
  var connectNodes = function (args) {
  };
  
  //////////////////
  // init procedures
  
  /////////////////
  // public methods
  return {
    addNode: addNode
  };

}();

////////////////////////////////////////////////////////////

GRAPH.define('GRAPH.UI.Canvas');

GRAPH.UI.Canvas = function () {

  ///////////////
  // dependencies
  var graph = GRAPH.Graph,
      GRAPHConsole = GRAPH.UI.Console;

  /////////////
  // properties
  var canvasWidth = $("#canvas").width(),
      canvasHeight = $("#canvas").height(),
      canvas = Raphael("canvas", canvasWidth, canvasHeight),
      mouseX = 0,
      mouseY = 0,
      nodeWidth = 80,
      nodeHeight = 50,
      nodeRadius = 5,
      nodeFill = "#fff",
      nodeFillOpacity = 0.3,
      nodeStroke = "#fff",
      nodeStrokeWidth = 3,
      nodeOpacity = 0.7;
  
  //////////
  // methods
  var mouseXEvent = function (e) {
    mouseX = e.pageX - $("#canvas").position().left - parseInt($("#canvas").css("border-left-width"), 10);
    return mouseX;
  };
  
  var mouseYEvent = function (e) {
    mouseY = e.pageY - $("#canvas").position().top - parseInt($("#canvas").css("border-top-width"), 10);
    return mouseY;
  };
  
  var addDrag = function (node) {
    
    var inletCoord = { ox: null, oy: null };
    var outletCoord = { ox: null, oy: null };
    
    var start = function () {
      this.ox = this.attr("x");
      this.oy = this.attr("y");
      
      inletCoord.ox = node.inlet.attr("cx");
      inletCoord.oy = node.inlet.attr("cy");
      
      outletCoord.ox = node.outlet.attr("cx");
      outletCoord.oy = node.outlet.attr("cy");
    };
    var move = function (dx, dy) {
      // TODO: Prevent node from being dragged outside canvas bounds
      this.attr({x: this.ox + dx, y: this.oy + dy});
      
      node.inlet.attr({cx: inletCoord.ox + dx, cy: inletCoord.oy + dy});
      node.outlet.attr({cx: outletCoord.ox + dx, cy: outletCoord.oy + dy});
    };
    var up = function () {};
    
    node.ref.drag(move, start, up);
  };
  
  var addNode = function (name) {
    var x = mouseX;
    var y = mouseY;
    
    // Make sure node is dropped over the canvas
    if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
      GRAPHConsole.write("Node not over canvas!", "warning");
      return;
    }
    
    $('#panel #info').html("x: " + x + "\ty: " + y + "<br>(Final Position)");
    GRAPHConsole.write(name + " dragged to canvas.");
    
    var w = nodeWidth;
    var h = nodeHeight;
    var r = nodeRadius;
    
    // x, y, w, h, r
    var rect = canvas.rect(x - w/2, y - h/2, w, h, r).attr({
      fill: nodeFill,
      "fill-opacity": nodeFillOpacity,
      stroke: nodeStroke,
      "stroke-width": nodeStrokeWidth,
      opacity: nodeOpacity,
      title: name
    });
    
    // cx, cy, r
    var inlet = canvas.circle(x - 20, y, 5).attr({
      fill: nodeFill,
      "fill-opacity": nodeFillOpacity,
      stroke: nodeStroke,
      "stroke-width": nodeStrokeWidth,
      opacity: nodeOpacity
    });

    var outlet = canvas.circle(x + 20, y, 5).attr({
      fill: nodeFill,
      "fill-opacity": nodeFillOpacity,
      stroke: nodeStroke,
      "stroke-width": nodeStrokeWidth,
      opacity: nodeOpacity
    });
    
    var node = {
      name: name,
      ref: rect,
      inlet: inlet,
      outlet: outlet
    };
    
    addDrag(node);
    
    graph.addNode(node);
  };
  
  //////////////////
  // init procedures
  $('#canvas').on('dragover', function (e) {
    e.originalEvent.preventDefault();
  });
  
  /////////////////
  // public methods
  return {
    mouseXEvent: mouseXEvent,
    mouseYEvent: mouseYEvent,
    addNode: addNode
  };

}();

////////////////////////////////////////////////////////////


// var c3 = GRAPH.UI.Canvas.getCanvas().circle(100, 300, 20);
// c3.attr({
//   fill: "#fff",
//   "fill-opacity": 0.3,
//   stroke: "#fff",
//   "stroke-width": 3,
//   opacity: 0.7
// });
// 
// var c4 = GRAPH.UI.Canvas.getCanvas().circle(300, 300, 20);
// c4.attr({
//   fill: "#fff",
//   "fill-opacity": 0.3,
//   stroke: "#fff",
//   "stroke-width": 3,
//   opacity: 0.7
// });
// 
// // var path = canvas.path("M10 10L90 90");
// var path = GRAPH.UI.Canvas.getCanvas().path("M" + c1.attr("cx") + " " + c1.attr("cy") + "L" + c1.attr("cx") + " " + c1.attr("cy"));
// path.attr({
//   stroke: "#fff",
//   "stroke-width": 3,
//   opacity: 0.7
// });
// var pathArray = path.attr("path");
// 
// var mouseX = 0;
// var mouseY = 0;
// 
// c1.mousedown(function () {
//   $(document).mousemove(function(e){
//     var x = GRAPH.UI.Canvas.mouseXEvent(e);
//     var y = GRAPH.UI.Canvas.mouseYEvent(e);
//     
//     $('#info').html("mouseX: " + x + "<br>mouseY: " + y);
//         
//     pathArray[1][1] = x;
//     pathArray[1][2] = y;
//     path.attr({path: pathArray});
//   });
// });
// 
// $(document).mouseup(function(e){
//   $(document).unbind("mousemove");
//   
//   pathArray[1][1] = c1.attr("cx");
//   pathArray[1][2] = c1.attr("cy");
//   path.attr({path: pathArray});
// });
// 
// c2.hover(function () {
//   pathArray[1][1] = c2.attr("cx");
//   pathArray[1][2] = c2.attr("cy");
//   path.attr({path: pathArray});
// });

// GRAPH.init();
// 
// myGRAPH = {
//   "a": {
//     "b": {
//       "c": null
//     }
//   }
// }
// 
// GRAPH.load(myGRAPH);


