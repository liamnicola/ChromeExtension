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
            var website = msg.data.domain
            getWebsite(website).then(webData => {
                response(webData)
            });
            // return true;
    
        } else if(msg.command = "fetchVotes"){
            var id = msg.data.id
            getVotes(id).then(voteData => {
                response(voteData)
            });
            // return true;
        }else (console.log("error"))
        return true;
    });

    async function getWebsite(website){
            const websiteRef = collection(db, "websites");
            const websitesRef = query(websiteRef, where("link", "==", website));
            const querySnapshot = await getDocs(websitesRef);
            let data = ''
                if(querySnapshot.size > 0){
                    //response({type: "result", status: "success", data: querySnapshot.data(), request: msg})
                    querySnapshot.forEach((doc) => {
                        data = doc.id 
                        
                    })
                    return data
                } else {
                    data = "Website Has Not Been Reviewed"
                    return data
                } 
                return true;
        }

        async function getVotes(id){
            const upvotesRef = collection(db, "upvotes");
            const upvotesDoc = query(upvotesRef, where("websiteId", "==", id));
            const upvotesSnapshot = await getDocs(upvotesDoc);
            const downvotesRef = collection(db, "downvotes");
            const downvoteDoc = query(downvotesRef, where("websiteId", "==", id));
            const downvoteSnapshot = await getDocs(downvoteDoc);
            let data = 0

            let upvoteCount = 0
                if(upvotesSnapshot.size >= 0){
                    upvoteCount = upvotesSnapshot.size
                } 
                console.log(upvoteCount)
            let downvoteCount = 0
                if(downvoteSnapshot.size >= 0){
                    downvoteCount = downvoteSnapshot.size
                } 
                console.log(downvoteCount)
                data = (upvoteCount / (upvoteCount+downvoteCount))*100
                console.log(data)
                return data

        }



                 /*chrome.runtime.onMessage.addListener((msg, sender, rspo) => {
        if (msg.command == "fetch"){
            var website = msg.data.domain
            const getWebsite = getDocs(query(ref, where("name", "==", website)));
            if (getWebsite.length > 0) {
        response({type: "result", status: "success", data: getWebsite.val(), request: msg});
      } else {
        response({type: "result", status: "success", data: [], request: msg});
        console.log("No data available");
      }
        }
    }) */

    