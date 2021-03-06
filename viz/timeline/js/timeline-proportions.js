/*
Horizontal Timeline with Agreements Grouped by Year showing Yearly Code Proportions
*/

callFunction();
d3.select(window).on("resize", callFunction);
window.addEventListener("storage", toUpdate);

function toUpdate(){
  if (window.localStorage.getItem("updatePaxHorizontal") == "true"){
    d3.selectAll("rects").remove();
    return callFunction();
  }
}

function callFunction() {
  console.log("Drawing visualization of yearly grouping");

  clicked = false; // To dislay agreement in left sidebar

  // Countries/entities
  var paxCons = JSON.parse(window.localStorage.getItem("paxCons"));
  var paxConRule = localStorage.getItem("paxConRule");
  // Code filter rule
  var paxANY = localStorage.getItem("paxANY");
  var paxALL = localStorage.getItem("paxALL");
  // Code filters
  // var paxHrFra = localStorage.getItem("paxHrFra");
  var paxHrFra = localStorage.getItem("paxHrFra");
  var paxPol = localStorage.getItem("paxPol");
  var paxEps = localStorage.getItem("paxEps");
  var paxMps = localStorage.getItem("paxMps");
  var paxPolps = localStorage.getItem("paxPolps");
  var paxTerps = localStorage.getItem("paxTerps");
  var paxTjMech = localStorage.getItem("paxTjMech");
  var paxGeWom = localStorage.getItem("paxGeWom");
  // Time period
  var newMinDay = localStorage.getItem("paxNewMinDay");
  var newMaxDay = localStorage.getItem("paxNewMaxDay");
  // Agreement clicked on map or timeline
  var selection = JSON.parse(window.localStorage.getItem("paxselection"));
  // console.log("Selection: "+selection);

  // Date parsers & formatters
  var parseDate = d3.timeParse("%d/%m/%Y");
  var parseMonth = d3.timeParse("%m");
  var parseYear = d3.timeParse("%Y");
  var parseDay = d3.timeParse("%j");
  var formatDate = d3.timeFormat("%d %B %Y");
  var formatMonth = d3.timeFormat("%m");
  var formatDay = d3.timeFormat("%j");  // day of the year as decimal number
  var formatYear = d3.timeFormat("%Y");

  var margin = {top: 4, right: 65, bottom: 15, left: 5}, //read clockwise from top
      width = parseInt(d3.select("body").style("width"), 10),
      width = width - margin.left - margin.right,
      agtHeight = 1.5,
      xHeight = 20,
      agtPadding = 0.5,
      agtSpacing = 1;

  // Obtain data
  d3.csv("data/paxTimelineData_02092018.csv")
      .row(function(d){ return{ Year:+d.Year,
                                Dat:parseDate(d.Dat),
                                AgtId:Number(d.AgtId),
                                // Reg:d.Reg,
                                Con:d.Con,
                                Status:d.Status,
                                Agtp:d.Agtp,
                                Stage:d.Stage, // "Pre", "SubPar", "SubComp", "Imp", "Cea", "Other"
                                StageSub:d.StageSub, // "FrCons"
                                Agt:d.Agt,
                                GeWom:d.GeWom, // 1 if topic of Women, girls and gender addressed; 0 if not
                                Polps:d.Polps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
                                Terps:d.Terps, // 1-3 indicating increasing level of detail given about Territorial Power sharing; 0 if none given
                                Eps:d.Eps, // 1-3 indicating increasing level of detail given about Economic Power sharing; 0 if none given
                                Mps:d.Mps, // 1-3 indicating increasing level of detail given about Political Power sharing; 0 if none given
                                Pol:d.Pol, // 1-3 indicating increasing level of detail given about political institutions; 0 if none given
                                HrFra:d.HrFra, // 1 if topic of human rights/rule of law addressed; 0 if not
                                //HrFra:d.HrFra, // 1-3 indicating increasing level of detail given about human rights framework to be established; 0 if none given
                                TjMech:d.TjMech // 1-3 indicating increasing level of detail given about a body to deal with the past; 0 if none given
                              }; })
      .get(function(error,data){

          var paxVizData = [];

          var svgTest = d3.select("body").select("svg");
          if (!svgTest.empty()) {
            svgTest.remove();
          };
          // Group agreements by Year (create an array of objects whose key is the year and value is an array of objects (one per agreement))
          var years = d3.nest()
               .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
               .sortValues(function(a,b){ return d3.descending(a.Dat, b.Dat); })
               .entries(data);
          var yrList = (d3.map(years, function(year){ return year.key; })).keys(); // array of year values

          var yr_count = d3.nest()
                .key(function(d){ return d.Year; }).sortKeys(d3.ascending)
                .rollup(function(leaves){ return leaves.length; })
                .entries(data);
          // console.log(years); // an array of objects
          // console.log(years[0].values); // array of objects (one for each agreement in 1990)
          // console.log(years[0].values[0]); // first agreement object from 1990
          // console.log(years[0].values[0].Year); // Year (as number) of the first agreement object from 1990

          // Find the maximum number of agreements in a single year
          var maxAgts = d3.max(years, function(year){ return year.values.length; });
          var height = (maxAgts*agtHeight)+(xHeight*2)+(margin.top*7); //defines w & h as inner dimensions of chart area
          // console.log(maxAgts); // 91

          // Set up the x axis
          // Find the earliest & latest years in which agreements are written
          if ((newMinDay.length > 0) && (newMaxDay.length > 0)){
            var minYear = +(newMinDay.substring(6))-1;
            var maxYear = +(newMaxDay.substring(6))+1;
            var x = d3.scaleTime()
                  .domain([parseYear(minYear),parseYear(maxYear)])
                  .range([margin.left,width]);
          } else {
            var minYear = d3.min(data,function(d){ return parseYear(d.Year-1); });
            window.localStorage.setItem("paxNewMaxDay", ("01/01/"+minYear));
            var maxYear = d3.max(data,function(d){ return parseYear(d.Year+1); });
            window.localStorage.setItem("paxNewMaxDay", ("31/12/"+maxYear));
            var x = d3.scaleTime()
                        .domain([minYear,maxYear])  // data space
                        .range([margin.left,width]);  // display space
          }

          // Calculate the size of each agreement in the display space
          var agtWidth = width/(maxYear-minYear)-agtPadding;

          // Define the full timeline chart SVG element
          var svg = d3.select("body").select("#chart").append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right)

          var yrProps = [];
          for (year = 0; year < yrList.length; year++){
            var y = +(years[year].key);
            // Only draw agreements within the axis bounds
            if ((y > minYear) && (y < maxYear)){
              var chartGroup = svg.append("g")
                          .attr("class","yearGroup")
                          .attr("id", String(years[year].key))
                          .attr("transform","translate("+(margin.left*2)+","+margin.top+")")

              var rects = chartGroup.selectAll("rect")
                  .data(years[year].values)
                .enter().append("rect")
                .filter(function(d){ return setAgtTimePeriod(d); })
                .filter(function(d){ return setAgtCons(d); })
                  .attr("class",function(d){ return String((setAgtColors(d))[1]); })
                  .attr("id",function(d){ return d.AgtId; })
                  .attr("name",function(d){ return d.Agt; })
                  .attr("value",function(d){ return d.Year; })
                  .attr("fill", function(d){ return (setAgtColors(d))[0]; })//"black")
                  .attr("stroke",function(d){ if (+d.AgtId == +selection[0]){ return "white"; } else { return "#dee3e8"; } })   //.attr("stroke","#737373")  // same as html background-color
                  .attr("stroke-width",function(d){ if (+d.AgtId == +selection[0]){ return "2px"; } else { return "0.5px"; } }) //.attr("stroke-width","0.5px")
                  .style("opacity", function(d){ if (+d.AgtId == +selection[0]){ return "1"; } else { return "0.5"; } })        //.style("opacity", "0.7")
                  .attr("x", function(d){ return x(parseYear(d.Year)) - (agtWidth/2) + margin.left*2; })
                  .attr("y",function(d,i){ return (height-xHeight-margin.bottom-(agtHeight*1.5)-((agtHeight)*(i*agtSpacing)))+"px"; })
                  .attr("width", agtWidth+"px")
                  .attr("height", agtHeight+"px");

                  var selectedRects = chartGroup.selectAll('rect.selected');
                  selectedRects.on("click", function(d) {
                    if (!clicked){ // if an agreement's been selected
                      clicked = true;
                      this.style.opacity = 1;
                      console.log(this.id);
                      if (+this.id == +(selection[0])){
                        window.localStorage.setItem("paxselection", JSON.stringify([]));
                      } else {
                        paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
                        window.localStorage.setItem("paxselection", JSON.stringify(paxVizData));
                      }
                      window.localStorage.setItem("updatePaxMap", "true");
                      callFunction();

                    } else { // if an agreement's not selected
                      clicked = false;
                      this.style.opacity = 0.5;
                      window.localStorage.setItem("paxselection", JSON.stringify([]));
                      window.localStorage.setItem("updatePaxMap", "true");
                      callFunction();
                    }
                  });

                selectedRects.on("mouseover",function(d){
                    if (!clicked){
                      this.style.fill = "#ffffff";
                      this.style.stroke = "#ffffff";
                      window.localStorage.setItem("updatePaxHorizontal","false");
                      window.localStorage.setItem("updatePaxMap", "false");
                      paxVizData = [d.AgtId,d.Agt,formatDate(d.Dat),d.Con,d.Status,d.Agtp,d.Stage,d.StageSub,d.Pol,d.Polps,d.Terps,d.Eps,d.Mps,d.HrFra,d.GeWom,d.TjMech];
                      window.localStorage.setItem("paxhover", JSON.stringify(paxVizData));
                     }
                });
                selectedRects.on("mouseout",function(d) {
                    if ((!clicked) && (+this.id != +selection[0])){
                      window.localStorage.setItem("updatePaxHorizontal","false");
                      window.localStorage.setItem("updatePaxMap", "false");
                      window.localStorage.setItem("paxhover", JSON.stringify([]));
                      this.style.fill = "black"
                      this.style.stroke = "#dee3e8";
                     }
                });

               var yrCount = selectedRects._groups[0].length;
               var yrTotal = years[year].values.filter(function(d){ return setAgtCons(d); }).length;
               yrProps.push([(years[year].values[0].Year), yrCount, yrTotal]);

             }
          }

        /*
        SHOW PROPORTIONS (%)
        */
        var text = svg.selectAll("text.count")
              .data(yrProps)   //yrProps format: [Year, yrCount, yrTotals]
            .enter().append("text")
              .attr("class","count")
              .attr("x", function(d){ return x(parseYear(d[0]))+(margin.left*4); })
              .attr("y", function(d){ return height-(xHeight*2)-(d[2]*agtHeight); })
              .text(function(d){ return getProp(d[1],d[2]); })
              .style("font-family", "sans-serif")
              .style("font-size", "10px")
              .style("fill","black")
              .style("stroke","0px")
              .style("font-weight","light")
              .style("text-anchor", "middle");

          /*
          FUNCTIONS
          */
          // Calculate the proportion of agreements that address selected codes
          // Percentage calculated as: (# that address selected codes / total # for selected country/entity)*100
          function getProp(yrCount, yrTotal){
            var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
            var codeFilterCount = codeFilters.length;
            var codeValueTotal = 0;
            for (i = 0; i < codeFilterCount; i++){
              if (codeFilters[i] == 1){ codeValueTotal += 1; }
            }
            if (codeValueTotal == 0){ return ""; } else {
              if ((yrCount == 0) || (yrTotal == 0)){ return "0%" }
              // else if (yrCount == "none"){ return ""; }
              else {
                var prop = (+yrCount/+yrTotal)*100;
                var propText = String(prop).substring(0,4)+"%"
                return propText;
              }
            }
          }

          // Visualize agreements signed in the selected years only
          function setAgtTimePeriod(d){
            var minDate = parseDate(newMinDay);
            var maxDate = parseDate(newMaxDay);
            var agmtDat = d.Dat;
            if ((agmtDat >= minDate) && (agmtDat <= maxDate)){
              return d;
            }
          }

          // Draw agreements with selected codes & countries/entities in black,
          // those without selected codes & countries/entities in gray
          function setAgtColors(d){
            var agmtCodes = [d.HrFra, d.Pol, d.Eps, d.Mps, d.Polps, d.Terps, d.TjMech, d.GeWom, ]; //d.HrFra,
            var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
            var codeFilterCount = codeFilters.length;
            if (paxANY == 1){
              pass = false;
              var codeValueTotal = 0;
              for (i = 0; i < codeFilterCount; i++){
                if (codeFilters[i] == 1){
                  codeValueTotal += 1;
                  if ((agmtCodes[i] > 0)){
                    pass = true;
                  }
                }
              }
              if ((codeValueTotal > 0) && (pass)){
                if (+d.AgtId == +selection[0]){
                  return ["white", "selected"];
                } else {
                  return ["#4f545e", "selected"];
                }
                // return getAgtCons(d);
              } else {
                // deselect agreements that don't meet filter criteria
                window.localStorage.setItem("paxselection", JSON.stringify([]));
                selection = JSON.parse(window.localStorage.getItem("paxselection"));
                return ["silver", "unselected"];
              }
            }
            else { // if paxALL == 1
              var codeValueTotal = 0;
              var mismatch = false;
              for (j = 0; j < codeFilterCount; j++){
                if (codeFilters[j] == 1){
                  codeValueTotal += 1;
                  if (agmtCodes[j] == 0){
                    mismatch = true;
                  }
                }
              }
              if ((codeValueTotal > 0) && (!mismatch)){
                if (+d.AgtId == +selection[0]){
                  return ["white", "selected"];
                } else {
                  return ["#4f545e", "selected"];
                }
                // return getAgtCons(d);
              } else {
                // deselect agreements that don't meet filter criteria
                window.localStorage.setItem("paxselection", JSON.stringify([]));
                selection = JSON.parse(window.localStorage.getItem("paxselection"));
                return ["silver", "unselected"];
              }
            }
          }

          function setAgtCons(d){         //getAgtCons(d){
            var agmtCon = String(d.Con);
            if (paxConRule == "any"){
              if (paxCons.length > 0){
                for (i = 0; i < paxCons.length; i++){
                  if ((agmtCon.includes(paxCons[i])) || (paxCons[i].includes(agmtCon))){
                    // if (+d.AgtId == +selection){
                    //   return ["white", "selected"];
                    // } else {
                    //   return ["black", "selected"];
                    // }
                    return d;
                  }
                }
              }
              // return ["#595959", "unselected"];
            }
            if (paxConRule == "all") {
              var mismatch = false;
              for (j = 0; j < paxCons.length; j++){
                if ((!(agmtCon.includes(paxCons[j]))) || (!(paxCons[j].includes(agmtCon)))){
                  mismatch = true;
                }
              }
              if (!mismatch){
              //   if (+d.AgtId == +selection){
              //     return ["white", "selected"];
              //   } else {
              //     return ["black", "selected"];
              //   }
                return d;
              // } else {
              //   return ["#595959", "unselected"];
              }
            }
          }

          /*
          DRAW X AXIS
          */
          var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).tickPadding([5]).ticks(4);

          var gX = chartGroup.append("g")
               .attr("class","xaxis")
               .attr("transform","translate("+(margin.left*2)+","+(height-xHeight-margin.bottom)+")")
               .call(xAxis);

      }) // end of .get(error,data)

      window.localStorage.setItem("updatePaxHorizontal","false");

      /*
      EXPORT PNG
      from https://github.com/exupero/saveSvgAsPng
      */
      d3.select("#export").on("click", function(){
        var title = "PA-X_HorizontalTimeline_Proportions";
        var cons = "";
        for (i = 0; i < paxCons.length; i++){
          cons += paxCons[i];
        }
        var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom];
        var codeNames = ["HrFra", "Pol", "Eps", "Mps", "Polps", "Terps", "TjMech", "GeWom"];
        var codes = "";
        for (i = 0; i < codeFilters.length; i++){
          if (codeFilters[i] > 0){
            codes += codeNames[i];
          }
        }
        title = title + "_" + cons + "_" + codes + "_" + newMinDay + "-" + newMaxDay + ".png";
        saveSvgAsPng(document.getElementsByTagName("svg")[0], title, {scale: 5, backgroundColor: "#dee3e8"});
        // if IE need canvg: canvg passed between scale & backgroundColor
      });

  }; // end of callFunction()
