chrome.runtime.sendMessage({command: "fetch"},
        (response)=> {
          document.getElementById("website").innerHTML = "Current Website: " + response.website
            console.log(response.webData);
            if(response.webData == null){
              document.getElementById("votes").innerHTML = "Website Has not recieved enough votes"
            } else if(response.webData < 50){
              alert("DANGER Satisfaction score for this website is below 50% - proceed with caution and NEVER give out personal details");
              document.getElementById("votes").innerHTML = "Satisfaction Score:";
              document.getElementById("score").innerHTML = response.webData + "%";
            } else if(response.webData === "This website Has Not Been Reviewed"){
              document.getElementById("votes").innerHTML = "This website is not in the database";
            }else {
              document.getElementById("votes").innerHTML = "Satisfaction Score:"
              document.getElementById("score").innerHTML = response.webData + "%"
            }
      }); 
      
