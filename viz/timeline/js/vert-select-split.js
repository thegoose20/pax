window.onload = function() {
  // window.localStorage.setItem("updatePaxMap", "false");
  window.localStorage.setItem("updatePaxSplitVerticalA","false");
  window.localStorage.setItem("updatePaxSplitVerticalB","false");
  window.localStorage.setItem("updatePaxSplitVerticalC","false");
  // window.localStorage.setItem("updatePaxHorizontal","false");
  // Agreement selection
  window.localStorage.setItem("paxselectionSplitV", 0);
  // Hovered agreement
  window.localStorage.setItem("paxagtidSplitV", 0);
  paxFilterUncheck(); // Check all code filters
  paxRuleAll(); // Pick code filter rule ALL
  // window.localStorage.setItem("updatePaxSplitVerticalA","true");
  // window.localStorage.setItem("updatePaxSplitVerticalB","true");
  // window.localStorage.setItem("updatePaxSplitVerticalC","true");

  // Filter rule listeners
  document.getElementById("anySplitV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxSplitVerticalA","false");
    window.localStorage.setItem("updatePaxSplitVerticalB","false");
    window.localStorage.setItem("updatePaxSplitVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAny();
    window.localStorage.setItem("updatePaxSplitVerticalA","true");
    window.localStorage.setItem("updatePaxSplitVerticalB","true");
    window.localStorage.setItem("updatePaxSplitVerticalC","true");
    //updateURL();
  }
  document.getElementById("allSplitV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxSplitVerticalA","false");
    window.localStorage.setItem("updatePaxSplitVerticalB","false");
    window.localStorage.setItem("updatePaxSplitVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxRuleAll();
    window.localStorage.setItem("updatePaxSplitVerticalA","true");
    window.localStorage.setItem("updatePaxSplitVerticalB","true");
    window.localStorage.setItem("updatePaxSplitVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("DeselectAllCodesSplitV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxSplitVerticalA","false");
    window.localStorage.setItem("updatePaxSplitVerticalB","false");
    window.localStorage.setItem("updatePaxSplitVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterUncheck();
    window.localStorage.setItem("updatePaxSplitVerticalA","true");
    window.localStorage.setItem("updatePaxSplitVerticalB","true");
    window.localStorage.setItem("updatePaxSplitVerticalC","true");
    //updateURL();
  }
  document.getElementById("SelectAllCodesSplitV").onclick = function(event) {
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxSplitVerticalA","false");
    window.localStorage.setItem("updatePaxSplitVerticalB","false");
    window.localStorage.setItem("updatePaxSplitVerticalC","false");
    // window.localStorage.setItem("updatePaxHorizontal","false");
    paxFilterCheck();
    window.localStorage.setItem("updatePaxSplitVerticalA","true");
    window.localStorage.setItem("updatePaxSplitVerticalB","true");
    window.localStorage.setItem("updatePaxSplitVerticalC","true");
    //updateURL();
  }

  // Code filter listeners
  document.getElementById("CodesSplitV").onclick = function(event){
    // window.localStorage.setItem("updatePaxMap", "false");
    window.localStorage.setItem("updatePaxSplitVerticalA","false");
    window.localStorage.setItem("updatePaxSplitVerticalB","false");
    window.localStorage.setItem("updatePaxSplitVerticalC","false");
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
    window.localStorage.setItem("updatePaxSplitVerticalA","true");
    window.localStorage.setItem("updatePaxSplitVerticalB","true");
    window.localStorage.setItem("updatePaxSplitVerticalC","true");
    //updateURL();
  }

  // Page refresh listener
    if (window.performance) {
      if ((performance.navigation.TYPE_RELOAD)) { //|| (window.localStorage.getItem("paxReset") == "true")
        window.localStorage.setItem("updatePaxSplitVerticalA","false");
        window.localStorage.setItem("updatePaxSplitVerticalB","false");
        window.localStorage.setItem("updatePaxSplitVerticalC","false");

        // Agreement selection
        window.localStorage.setItem("paxselectionSplitV", 0);
        // Hovered agreement
        window.localStorage.setItem("paxagtidSplitV", 0);

        paxFilterUncheck(); // Check all code filters
        paxRuleAll(); // Pick code filter rule ALL
        window.localStorage.setItem("updatePaxSplitVerticalA","true");
        window.localStorage.setItem("updatePaxSplitVerticalB","true");
        window.localStorage.setItem("updatePaxSplitVerticalC","true");
    }
  }
}

function paxRuleAny() {
  document.getElementById("anySplitV").checked = true;
  window.localStorage.setItem("paxANYSplitV",1);
  window.localStorage.setItem("paxALLSplitV",0);
  console.log("Selected ANY for vertical timelines")
}
function paxRuleAll() {
  document.getElementById("allSplitV").checked = true;
  window.localStorage.setItem("paxANYSplitV",0);
  window.localStorage.setItem("paxALLSplitV",1);
  console.log("Selected ALL for vertical timelines")
}
function paxFilterUncheck() {
  var filters = document.getElementsByName("filterSplitV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = false;
  window.localStorage.setItem(filters[i].id,0);
}
console.log("Unchecked all code filters for vertical timelines");
}
function paxFilterCheck() {
  var filters = document.getElementsByName("filterSplitV");
  for (i = 0; i < filters.length; i++) {
  filters[i].checked = true;
  window.localStorage.setItem(filters[i].id,1);
}
console.log("Checked all code filters for vertical timelines");
}
