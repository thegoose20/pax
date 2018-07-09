// GENERAL DATA IMPORT PATTERN FOR D3 ("Convenience Methods")
// d3.request(url)
//         .row(function(d){*format row*})
//         .get(callback)

// d3.request(url,formatRow,callback);
// function formatRow(){return format(d);}
// function callback(error,rows){
//     if (error) throw error;
//     *do something with the data*
// }


callFunction();

d3.select(window).on("resize", callFunction);

function callFunction() {

function dragged() {
  d3.select(this).attr("transform","translate("+d3.event.x+","+d3.event.y+")"); // drags entire chart
}

var parseDate = d3.timeParse("%d/%m/%Y");
//var parseMonth = d3.timeParse("%m");
//var parseYear = d3.timeParse("%Y");
var parseDay = d3.timeParse("%j");

var formatDate = d3.timeFormat("%d %B %Y");
var formatMonth = d3.timeFormat("%m");
var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
var formatYear = d3.timeFormat("%Y");

d3.csv("PAX_with_additional_cleaning.csv")
    .row(function(d){ return {Year: d.Year,
                              Day: d.Day,
                              Month: d.Month,
                              Dat: parseDate(d.Dat),
                              AgtId:Number(d.AgtId),
                              Reg:d.Reg,
                              Con:d.Con,
                              Status:d.Status,
                              Agtp:d.Agtp,
                              Stage:d.Stage,
                              Agt:d.Agt }; }) //price.trim().slice(1) - remove spaces, trim 1st character ($)
    .get(function(error,data){

        var tooltip = d3.select("body").append("div")
            .style("opacity","0")
            .style("position","absolute");

        var svgtest = d3.select("body").select("svg");
        if (!svgtest.empty()) {
          svgtest.remove();
        }

        var margin = {top: 20, right: 50, bottom: 20, left: 10} //read clockwise from top
          , width = parseInt(d3.select("body").style("width"), 10) //960 - margin.left - margin.right,
          , width = width - margin.left - margin.right
          , height = 500 - margin.top - margin.bottom; //defines w & h as inner dimensions of chart area

        var yr_count_nest = d3.nest()
             .key(function(d) {return d.Year;}).sortKeys(d3.ascending)
             .rollup(function(leaves) {return leaves.length;})
             //.entries(data);
             .map(data);

        // Find the maximum number of agreements that occur in a single year
        var max = d3.max(yr_count_nest,function(d){ return d.value; });

        // Find the earliest & latest year in which agreements occur
        var minYear = d3.min(yr_count_nest,function(d){ return d.key; });
        var maxYear = d3.max(yr_count_nest,function(d){ return d.key; });

        // Create an array of years (non-repeating) in which agreements occur
        //var yearMap = d3.map(yr_count_nest,function(d){ return d.key; });

        // Find the earliest & latest day of the year on which agreements are written
        var minDay = d3.min(data,function(d){ return (d.Dat); });
        var maxDay = d3.max(data,function(d){ return (d.Dat); });

        // console.log(minYear);
        // console.log(maxYear);
        // console.log(max);
        // console.log(yearMap);
        // console.log(yr_count_nest.keys().sort());

        var y = d3.scaleLinear()
                    .domain([0,(max*30)]) // data space - assume rects height of 30px...?
                    .range([height,0]); // display space
        var x = d3.scaleTime()
                    .domain([minDay,maxDay])  // data space
                    .range([0,width]);  // display space
        var yAxis = d3.axisLeft(y);
        var xAxis = d3.axisBottom(x)
            .ticks(10);

        var svg = d3.select("body").select("#chart").append("svg")
            .attr("height", height + margin.top + margin.bottom)//"100%")
            .attr("width", width + margin.left + margin.right);//"100%");

        var chartGroup = svg.append("g")
                    .attr("transform","translate("+margin.left+","+margin.top+")");

        svg.call(d3.zoom()
          .on("zoom",function(){  //on: tell event, then tell function
            chartGroup.attr("transform",d3.event.transform);
        }));

        // Make one rectangle per agreement grouped by Year
        chartGroup.selectAll("rect.agt")
                .data(data)
                .enter().append("rect")
                   .attr("class","agt")
                   .attr("fill","black")
                   .attr("stroke","white")
                   //.attr("d", function(d,i) { return agt(d.values); })
                   .attr("x",function(d){ return x(d.Dat); })
                   .attr("y",function(d){ return ((height/2)-29)+"px"; })
                   .attr("width","2px")
                   .attr("height","30px") // TO DO: calculate height based on max # of agmts in single year
                   .on("mousemove",function(d){
                     this.style.fill = "steelblue"
                     tooltip.style("opacity","1")
                       .style("left",margin.left)  //("left",d3.event.pageX+"px")
                       .style("top",(margin.top + 140)+"px")  //("top",d3.event.pageY+"px")
                       .attr("class","tooltip");
                     // Display core agreement information (name, date, region, country/entity, status, type & stage)
                     tooltip.html("<h5>"+d.Agt+"</h5> " +"<p><b>Date:</b> "+formatDate(d.Dat)+"<br/><b>Region:</b> "+d.Reg+"<br/><b>Country/Entity:</b> "+d.Con+"<br/><b>Status:</b> "+d.Status+"<br/><b>Type:</b> "+d.Agtp+"<br/><b>Stage:</b> "+d.Stage+"</p>");  // HOW TO ACCESS AGMT DETAILS?
                   })
                   .on("mouseout",function(d) {
                     this.style.fill = "black"
                     tooltip.style("opacity","0");
                   });
                   //console.log(data);

        // chartGroup.append("path").attr("d",line(data));
        chartGroup.append("g")
                .attr("class","xaxis")
                .attr("transform","translate(0,"+height/2+")")
                .call(xAxis);  // WHY NOT SHOWING 4 DIGIT DATE?
      });
}
