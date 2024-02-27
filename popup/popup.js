let text = document.getElementById('eval');
let statusBox = document.getElementById('status-box');

text.addEventListener('click', async () => {
    //Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    

    statusBox.textContent = "X";
    setStatusBoxColor(0);
    statusBox.style.display = "flex";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrape
    });
});

function setStatusBoxColor(score){
    let color;

    if(score < 20){
        color = 'red';
    }else if(score < 40){
        color = 'orange';
    }
    else if(score < 60){
        color = 'yellow';
    }else if(score < 80){
        color = 'lightgreen';
    } else {
        color = 'green';
    }

    statusBox.textContent = score + "%";
    statusBox.style.backgroundColor = color; 
}

function setManTech(techniques){
    detected_technique.textContent = techniques;
}

//function to scrape the page
function scrape(){
    let body = document.querySelector('body');
    let text = body.innerText;
    let words = text.split(' ');
    
    //delete the first 15 words
    words.splice(0,15);

    //the article is not longer than 600 words or cut the last 50 words
    if(words.length > 600)
        words.splice(600, words.length-600);
    else
        words.splice(words.length-50, 50);
    
    //send the words to the background script
    chrome.runtime.sendMessage({words: words});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'serverResponse') {
        // Zpracování odpovědi od background skriptu
        console.log('Received server response in popup:', request.data);

        setStatusBoxColor(request.data.score)    
        setManTech(request.data.techniques)
    }
});