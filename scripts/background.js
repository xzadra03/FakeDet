chrome.runtime.onMessage.addListener(function (request) {
    if(request.words) {
      let receivedWords = request.words;
      console.log("Received words in background script:", receivedWords);
  
      //join the words into a single string
      //use whitespace as a separator
      let words = receivedWords.join(' ');

      //delete short lines (less than 4 words, probably not a sentence)
      let lines = words.split('\n');
      let filteredLines = lines.filter(line => line.split(' ').length >= 4);
      words = filteredLines.join('\n');
      console.log(words);

      const url = "https://fakedet.azurewebsites.net/api/HttpTrigger1?code=";

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `key=${process.env.MEANINGCLOUD_API_KEY}&lang=en&txt=${words}`
      })

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      .then(responseData => {
        // Zde můžete zpracovat odpověď od serveru, pokud je to nutné
        console.log('Response from server:', responseData);
      })
      .catch(error => {
        console.error('Error when sending data to server: ', error);
      });

    }
  });