import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const firebaseConfig = {
        apiKey: "AIzaSyDdQp4zHaH7tTV0hqG6OV905jj63phFgd4",
        authDomain: "dissertation-61223.firebaseapp.com",
        projectId: "dissertation-61223",
        storageBucket: "dissertation-61223.appspot.com",
        messagingSenderId: "73178915271",
        appId: "1:73178915271:web:1062973dca0e5058e039e2",
        measurementId: "G-RRN7J1TY5T"
    };

    const app = initializeApp(firebaseConfig)
    
    const db = getFirestore(app);
    const ref = collection(db, "websites")


    chrome.runtime.onMessage.addListener((msg, sender, response) => { 
         if (msg.command == "fetch"){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // only one tab will be active and in the current window at once
                // the return variable will only have one value
                var activeTab = tabs[0];
                var url = new URL(activeTab.url)
                var website = url.hostname;
                website = website.replace('http://', '').replace('https://', '')
            getWebsite(website).then(webData => getVotes(webData)).then(webData => {
                response({webData: webData, website: website})
                if(webData < 50 && webData != null){
                notification(website, webData);
                }
            });
        });
        } else (console.log("error"))
        return true;
    });

    async function getWebsite(website){
            const websiteRef = collection(db, "websites");
            const websitesRef = query(websiteRef, where("link", "==", website));
            const querySnapshot = await getDocs(websitesRef);
            let data = ''
                if(querySnapshot.size > 0){
                    querySnapshot.forEach((doc) => {
                        data = doc.id 
                        
                    })
                    return data
                } else {
                    data = "This website Has Not Been Reviewed"
                    return data
                } 
        }

        async function getVotes(id){
            const upvotesRef = collection(db, "upvotes");
            const upvotesDoc = query(upvotesRef, where("websiteId", "==", id));
            const upvotesSnapshot = await getDocs(upvotesDoc);
            const downvotesRef = collection(db, "downvotes");
            const downvoteDoc = query(downvotesRef, where("websiteId", "==", id));
            const downvoteSnapshot = await getDocs(downvoteDoc);
            let data = 0
            if(id === "This website Has Not Been Reviewed"){
                return id
            } else {

            let upvoteCount = 0
                if(upvotesSnapshot.size >= 0){
                    upvoteCount = upvotesSnapshot.size
                } 
            let downvoteCount = 0
                if(downvoteSnapshot.size >= 0){
                    downvoteCount = downvoteSnapshot.size
                } 
                if(upvotesSnapshot.size <= 0 && downvoteSnapshot.size <= 0){
                    data = null
                    return data
                }

                data = (upvoteCount / (upvoteCount+downvoteCount))*100
                data = data.toFixed(2)
                console.log(data)
                
                return data
        }
    }


        function notification(website, score){
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'scoreviewer128.png',
              title: 'Score Viewer',
              message: website +' is scored at '+ score + '% Proceed with caution or stop using the website.',
              priority: 2
          });
          }
