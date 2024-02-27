chrome.runtime.onMessage.addListener(function (request) {
    if(request.words) {
      let receivedWords = request.words;
      console.log("Received words in background script");
  
      //join the words into a single string
      //use whitespace as a separator
      let words = receivedWords.join(' ');

      //delete short lines (less than 4 words, probably not a sentence)
      let lines = words.split('\n');
      let filteredLines = lines.filter(line => line.split(' ').length >= 4);
      words = filteredLines.join('\n');
      console.log(words);

      const url = "http://127.0.0.1:5000/analyze";

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: words})
      })

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Prislo to")
        return response.json();
      })

      .then(responseData => {
        console.log('Response from server:', responseData);
        chrome.runtime.sendMessage({ type: 'serverResponse', data: responseData });
      })
      .catch(error => {
        console.error('Error when sending data to server: ', error);
      });

    }
  });