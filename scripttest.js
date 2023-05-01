document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        
        var activeTab = tabs[0];
        var title = activeTab.title;
        var url = new URL(activeTab.url)
        var domain = url.hostname;
        //domain = domain.replace('http://', '').replace('https://', '').replace('www.', '').replace('.com','')
        document.getElementById("website").innerHTML = domain
        
        chrome.runtime.sendMessage({command: "fetch", data: {domain: domain}},
          (response)=> {
              parseData(response);
        }); 
        
    });
  });
   
   chrome.runtime.sendMessage({command: "fetchName"},
      (response)=> {
          parseData(response);
    }); 
     
  
      var parseData = function(data){
        chrome.runtime.sendMessage({command: "fetchVotes", data: {id: data}},
        (response)=> {
          parseVotes(response);
      }); 
    
    }
  
    var parseVotes = function(data){
      if(data == null){
        document.getElementById("votes").innerHTML = "Website Has not recieved enough votes"
      } else if(data < 50){
        alert("DANGER Satisfaction score for this website is below 50% - proceed with caution and NEVER give out personal details")
        document.getElementById("votes").innerHTML = "Satisfaction Score: " + data + "%"
      } else {
        document.getElementById("votes").innerHTML = "Satisfaction Score: " + data + "%"
      }
  }
        
  
  
  