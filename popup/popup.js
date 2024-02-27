let text = document.getElementById('eval');
let statusBox = document.getElementById('status-box');

text.addEventListener('click', async () => {
    //Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    let random = Math.floor(Math.random() * 101);

    statusBox.textContent = random + "%";
    setStatusBoxColor(random);
    statusBox.style.display = "flex";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrape
    });
});

function setStatusBoxColor(randomNumber) {
    let color;

    if(randomNumber < 20){
        color = 'red';
    }else if(randomNumber < 40){
        color = 'orange';
    }
    else if(randomNumber < 60){
        color = 'yellow';
    }else if(randomNumber < 80){
        color = 'lightgreen';
    } else {
        color = 'green';
    }

    statusBox.style.backgroundColor = color;
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