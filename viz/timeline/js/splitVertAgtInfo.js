/*
Display selected filters
(Countries/Entities, Codes)
*/

function callSplitVertFilterFunction() {
  /*
  Retrieve possible filter values
  */
  var paxANY = window.localStorage.getItem("paxANYSplitV"),
      paxALL = window.localStorage.getItem("paxALLSplitV"),
      // Code selections
      // paxHrFra = window.localStorage.getItem("paxHrFraSplitV"),
      paxHrFra = window.localStorage.getItem("paxHrFraSplitV"),
      paxPol = window.localStorage.getItem("paxPolSplitV"),
      paxEps = window.localStorage.getItem("paxEpsSplitV"),
      paxMps = window.localStorage.getItem("paxMpsSplitV"),
      paxPolps = window.localStorage.getItem("paxPolpsSplitV"),
      paxTerps = window.localStorage.getItem("paxTerpsSplitV"),
      paxTjMech = window.localStorage.getItem("paxTjMechSplitV"),
      paxGeWom = window.localStorage.getItem("paxGeWomSplitV");

  /*
  Display visualization selections
  */
  var codeText = getCodeText();
  console.log(codeText);

  // var newTCons = document.createTextNode(conText);
  // var pCons = document.getElementById("selectionsCon");
  // pCons.removeChild(pCons.childNodes[0]);
  // pCons.appendChild(newTCons);

  var newTCodes = document.createTextNode(codeText);
  var pCodes = document.getElementById("selectionsCode");
  pCodes.removeChild(pCodes.childNodes[0]);
  pCodes.appendChild(newTCodes);

  /*
  Functions to compose selections text
  */
  function getCodeText(){
    var codeFilters = [+paxHrFra, +paxPol, +paxEps, +paxMps, +paxPolps, +paxTerps, +paxTjMech, +paxGeWom]; //+paxHrFra,
    var codeFilterCount = codeFilters.length;
    var codeText = "";
    var vizCodes = ["Human Rights/Rule of Law", "Political Institutions", "Power Sharing: Economic", "Power Sharing: Military", "Power Sharing: Political", "Power Sharing: Territorial", "Transitional Justice Past Mechanism", "Women, Girls and Gender"]; //"Human Rights Framework",
    var codeIndeces = [];
    for (i = 0; i < codeFilterCount; i++){
      if (codeFilters[i] > 0){
        // codeIndeces.push(i);
        codeText += vizCodes[i] + ",";
      }
    }
    if (codeText.length == 0){
      return "None selected";
    }
    codeText = codeText.slice(0,-1);
    return codeText;
  }

}
