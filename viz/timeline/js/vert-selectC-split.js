/*
Updates right vertical timelines when the webpage is reloaded or a
country/entity is selected from the dropdown list
*/

window.onload = function() {
  window.localStorage.setItem("updatePaxSplitVerticalA","false");
  window.localStorage.setItem("updatePaxSplitVerticalB","false");
  window.localStorage.setItem("updatePaxSplitVerticalC","false");
  localStorage.setItem("paxSplitVertConC","None selected");
  document.getElementById("None").checked = true;
  window.localStorage.setItem("updatePaxSplitVerticalC","true");

  // Country/entity listeners for vertical timelines (left to right)
  document.getElementById("SplitVertConRadiosC").onclick = function(event){
    let target = event.target;
    if (target.name == "ConRadio"){
      window.localStorage.setItem("updatePaxSplitVerticalC","true");
      window.localStorage.setItem("updatePaxSplitVerticalA","false");
      window.localStorage.setItem("updatePaxSplitVerticalB","false");
      // window.localStorage.setItem("updatePaxHorizontal","false");
      // window.localStorage.setItem("updatePaxMap", "false");
      localStorage.setItem("paxSplitVertConC",String(target.id));
      console.log("Set paxSplitVertConC to "+target.id);
      //updateURL();
    }
  }

  // Page refresh listener
  if (window.performance) {
    if ((performance.navigation.TYPE_RELOAD)) {  // || (window.localStorage.getItem("paxReset") == "true")
      window.localStorage.setItem("updatePaxSplitVerticalA","false");
      window.localStorage.setItem("updatePaxSplitVerticalB","false");
      window.localStorage.setItem("updatePaxSplitVerticalC","false");
      // Agreement selection
      window.localStorage.setItem("paxselectionSplitV", 0);
      // Hovered agreement
      window.localStorage.setItem("paxagtidSplitV", 0);
    }
  }

}
