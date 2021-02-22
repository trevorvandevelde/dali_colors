var width = window.innerWidth;
var height = window.innerHeight;

// append the svg object to the body of the page
var svg = d3.select("#dali_data")
    .append("svg")
    
    .attr("width", 2000)
    .attr("height", 2000)



    d3.json("/DALI_DATA.json", function(data){


        var Tooltip = d3.select("#dali_data")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

        var mouseover = function(d) {
            Tooltip
              .style("opacity", 1)
            return Tooltip.text(d.name)
          }
          var mousemove = function(d) {
            Tooltip
              
              
              .text(d.name + " " + d.year)
              .style("left", (d3.mouse(this)[0]+60) + "px")
              .style("top", (d3.mouse(this)[1]) + "px")
          }
          var mouseleave = function(d) {
            Tooltip
              .style("opacity", 0)
          }

        
    
    var node = svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        
        .append("circle")
        .attr("r", function(d){return 15000 * 1/(parseFloat(d.year.slice(1,3)))**2} )
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d) {
            
            return d.favoriteColor
        })
        
        .style("fill-opacity", .5)
        .attr("stroke", "Black")
        .style("stroke-width", 4)
        
         
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
         .on("start", dragstarted)
         .on("drag", dragged)
         .on("end", dragended));





        
        
         

// Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.05).radius(50).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
        .nodes(data)
        .on("tick", function(d){
        node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
        })
        
        

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
          function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
          }


    });