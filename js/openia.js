const API_URL = "https://api.openai.com/v1/chat/completions";
const form = document.getElementById('upload-form');
const popupLoading = document.getElementById('popup-loading-files');
const popupDownload = document.getElementById('popup-dl-files');
const popupAlert = document.getElementById('popup-alert');
const buttonDownload = document.getElementById('download-files');
let translatedFiles = [];

buttonDownload.addEventListener('click', () => {
  translatedFiles.forEach((file) => {
    const downloadURL = file.url;
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(downloadURL);
    document.body.removeChild(link);
    popupDownload.classList.add('hidden');
  });
});

form.addEventListener('submit', (event) => {

  handleFormSubmit(event);
});

function handleFormSubmit(event) {
  event.preventDefault();

  const languageSelect = document.getElementById('lang-select');
  const selectedLanguage = languageSelect.value;
  const modelSelect = document.getElementById('model-select');
  const selectedModel = modelSelect.value;
  const codeInput = document.getElementById('code-input');
  const apiKey = codeInput.value;
  const fileInput = document.getElementById('file-input');
  const selectedFiles = fileInput.files;

  if (selectedFiles.length > 0) {
    popupLoading.classList.remove('hidden');
    handleFileTranslation(apiKey, selectedLanguage, selectedModel, selectedFiles);
  }
}

function handleFileTranslation(apiKey, language, model, files) {
  function translateFile(index) {
    if (index >= files.length) {
      popupLoading.classList.add('hidden');
      popupDownload.classList.remove('hidden');
      return;
    }
    const file = files[index];
    readContentsOfFile(file, function (fileContents) {
      callChatGPTAPI(apiKey, fileContents, language, model, function (response, error) {
        if (error) {
          const spanElement = document.querySelector('span[name="alert-message"]');         
          popupLoading.classList.add('hidden');
          console.log('Erreur lors de l\'appel à l\'API ChatGPT :', error);
          spanElement.textContent = 'Erreur lors de l\'appel à l\'API ChatGPT: ' + error;
          popupAlert.classList.remove('hidden');
          return;
        } else {
          translatedFiles.push({
            name: file.name,
            url: URL.createObjectURL(new Blob([response], { type: 'text/plain' })),
          });
          const spanElement = document.querySelector('span[name="alert-message"]');         
          popupLoading.classList.add('hidden');
          spanElement.textContent = response;
          popupAlert.classList.remove('hidden');        
        }
        translateFile(index + 1);
      });
    });
  }

  translateFile(0);
}

function readContentsOfFile(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const contents = event.target.result;
    callback(contents);
  };

  reader.onerror = function (event) {
    console.error('Erreur de lecture du fichier :', event.target.error);
  };

  reader.readAsText(file);
}

async function callChatGPTAPI(apiKey, fileText, language, model, callback) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
<<<<<<< HEAD
      { role: 'user', content: fileText },
    ],
  };

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`${response.statusText}`);
      }
    })
    .then(data => {
      const responseText = data.choices[0].message.content;
      callback(responseText, null);
    })
    .catch(error => {
      callback(null, `${error.message}`);
=======
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an expert translator and proofreader specializing in YAML syntax and Minecraft color codes. Your task is to translate the provided YAML file while preserving the encoding, color codes, and most importantly, the YAML syntax. Please translate it into ${language} language.`,
          },
          { role: 'user', content: fileText },
        ],
      }),
>>>>>>> ba24c5a (Added error handling for fetch request and JSON parsing)
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      callback(data.choices[0].message.content, null);
    } else {
      throw new Error("Invalid response format: data.choices is undefined or empty.");
    }
  } catch (error) {
    console.error("Error:", error);
    callback(null, `${error.message}`);
  }
}


function getFileExtension(filename) {
  return filename.split(".").pop();
}
