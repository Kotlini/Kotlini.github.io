var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow");
    editor.session.setMode("ace/mode/yaml");

    var verifyBtn = document.getElementById("verifyBtn");
    var errorContainer = document.getElementById("errorContainer");
    var popup = document.getElementById("popup");
    var closePopupBtn = document.getElementById("closePopupBtn");
    var errorMarkerId = null;

    verifyBtn.addEventListener("click", function () {
      var yamlContent = editor.getValue();
      var validationResult = validateYAML(yamlContent);
      displayValidationResult(validationResult);
    });

    closePopupBtn.addEventListener("click", function () {
      popup.classList.add("hidden");
    });

    function validateYAML(yamlContent) {
      try {
        jsyaml.load(yamlContent);
        return { isValid: true };
      } catch (error) {
        return { isValid: false, errorMessage: error.message, errorLine: error.mark ? error.mark.line + 1 : -1 };
      }
    }

    function displayValidationResult(validationResult) {
      if (validationResult.isValid) {
        errorContainer.innerHTML = "Le fichier YML est valide.";
        errorContainer.classList.remove("text-red-500");
        errorContainer.classList.add("text-green-500");
        editor.getSession().setAnnotations([]);
        removeErrorMarker();
        showPopup();
      } else {
        errorContainer.innerHTML = "Erreur de syntaxe YML : " + validationResult.errorMessage;
        errorContainer.classList.remove("text-green-500");
        errorContainer.classList.add("text-red-500");
        editor.getSession().setAnnotations([{ row: validationResult.errorLine - 1, column: 0, text: validationResult.errorMessage, type: "error" }]);
        addErrorMarker(validationResult.errorLine);
      }
    }

    function addErrorMarker(errorLine) {
      var Range = ace.require("ace/range").Range;
      var errorRange = new Range(errorLine - 1, 0, errorLine - 1, 1);
      errorMarkerId = editor.getSession().addMarker(errorRange, "errorMarker", "fullLine");
    }

    function removeErrorMarker() {
      if (errorMarkerId !== null) {
        editor.getSession().removeMarker(errorMarkerId);
        errorMarkerId = null;
      }
    }

    function showPopup() {
      popup.classList.remove("hidden");
      popup.classList.add("visible");
    }