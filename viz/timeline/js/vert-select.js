window.onload = function() {
  // window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("updatePaxVerticalA","false");
  window.localStorage.setItem("updatePaxVerticalB","false");
  window.localStorage.setItem("updatePaxVerticalC","false");
  // window.localStorage.setItem("updatePaxHorizontal","false");
  // Agreement selection
  window.localStorage.setItem("paxselectionV", 0);
  // Hovered agreement
  window.localStorage.setItem("paxagtidV", 0);
  paxFilterUncheck(); // Check all code filters
  paxRuleAll(); // Pick code filter rule ALL
  // window.localStorage.setItem("updatePaxVerticalA","true");
  // window.localStorage.setItem("updatePaxVerticalB","true");
  // window.localStorage.setItem("updatePaxVerticalC","true");

  // Filter rule listeners
  document.getElementById("anyV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAny();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }
  document.getElementById("allV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAll();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("DeselectAllCodesV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterUncheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }
  document.getElementById("SelectAllCodesV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterCheck();
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("CodesV").onclick = function(event){
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxVerticalA","false");
    window.localStorage.setItem("updatePaxVerticalB","false");
    window.localStorage.setItem("updatePaxVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    let target = event.target;
    if (+localStorage.getItem(target.id) == 0){
      localStorage.setItem(target.id, 1);
      target.checked = true;
      console.log("Checked "+target.id);
    } else {
      localStorage.setItem(target.id, 0);
      target.checked = false;
      console.log("Unchecked "+target.id);
    }
    window.localStorage.setItem("updatePaxVerticalA","true");
    window.localStorage.setItem("updatePaxVerticalB","true");
    window.localStorage.setItem("updatePaxVerticalC","true");
    //updateURL();
  }

  // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD)) { //|| (window.localStorage.getItem("paxReset") == "true")
        window.localStorage.setItem("updatePaxVerticalA","false");
        window.localStorage.setItem("updatePaxVerticalB","false");
        window.localStorage.setItem("updatePaxVerticalC","false");

        // Agreement selection
        window.localStorage.setItem("paxselectionV", 0);
        // Hovered agreement
        window.localStorage.setItem("paxagtidV", 0);

        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
        window.localStorage.setItem("updatePaxVerticalA","true");
        window.localStorage.setItem("updatePaxVerticalB","true");
        window.localStorage.setItem("updatePaxVerticalC","true");
    }
  }
}

function paxRuleAny() {
  document.getElementById("anyV").checked = true;
  window.localStorage.setItem("paxANYV",1);
  window.localStorage.setItem("paxALLV",0);
  console.log("Selected ANY for vertical timelines")
}
function paxRuleAll() {
  document.getElementById("allV").checked = true;
  window.localStorage.setItem("paxANYV",0);
  window.localStorage.setItem("paxALLV",1);
  console.log("Selected ALL for vertical timelines")
}
function paxFilterUncheck() {
  var filters = document.getElementsByName("filterV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = false;
  window.localStorage.setItem(filters[i].id,0);
}
console.log("Unchecked all code filters for vertical timelines");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filterV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = true;
  window.localStorage.setItem(filters[i].id,1);
}
console.log("Checked all code filters for vertical timelines");
}
