const form = document.getElementById('upload-form');
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;

    const codeInput = document.getElementById('code-input');
    const apiKey = codeInput.value;

    const fileInput = document.getElementById('fichier');
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        console.log('Nom du fichier :', selectedFile.name);
        console.log('Type du fichier :', selectedFile.type);
        console.log('Taille du fichier :', selectedFile.size);

        readContentsOfFile(selectedFile, function(fileContents) {
            callChatGPTAPI(apiKey, fileContents, selectedLanguage)
                .then((response) => {
                    console.log('Réponse de l\'API ChatGPT :', response);

                    // Générer et télécharger le fichier
                    var blob = new Blob([response], { type: 'text/plain' });
                    var downloadURL = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = selectedFile.name + '.yml';
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(downloadURL);
                })
                .catch((error) => {
                    displayTranslationError(error);
                    console.error('Erreur lors de l\'appel à l\'API ChatGPT :', error);
                });
        });
    }
}

function readContentsOfFile(file, callback) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const contents = event.target.result;
        callback(contents);
    };

    reader.onerror = function(event) {
        displayTranslationError("Erreur de lecture du fichier :" + event.target.error)
        console.error('Erreur de lecture du fichier :', event.target.error);
    };

    reader.readAsText(file);
}

async function callChatGPTAPI(apiKey, fileText, language) {
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
  
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
  
    const data = {
        prompt: `Instructions: Please correct the YAML file using the Minecraft color codes. Use the "${language}" language for the correction.'${fileText}'`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };
  
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
  
        if (response.ok) {
            const responseJson = await response.json();
            const yml = responseJson.choices[0].text;
            return yml;
        } else {
            return `Une erreur s'est produite: ${response.statusText}`;
        }
    } catch (error) {
        return `Une erreur s'est produite: ${error.message}`;
    }
}

function displayTranslationResult(translation) {
    const translationSection = document.getElementById('translation-section');
    const translationResult = document.getElementById('translation-result');
    
    translationResult.textContent = translation;
    translationSection.style.display = 'block';
}

function displayTranslationError(errorMessage) {
    const translationSection = document.getElementById('error-section');
    const mess = document.getElementById('error-message');
    
    translationSection.style.display = 'block';
    mess.textContent = errorMessage;
    mess.style.color = "red";
}
