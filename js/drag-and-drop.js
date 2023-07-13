let uploadForm = document.getElementById("upload-form");
let dropArea = document.getElementById("drop-area");
let dropBorder = document.getElementById("drop-border");
let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("file-list");

dropArea.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dropArea.classList.add("border-blue-500");
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropBorder.classList.add("border-blue-500");
});

dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropBorder.classList.remove("border-blue-500");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropBorder.classList.remove("border-blue-500");
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  fileList.innerHTML = "";
  const valitedFiles = files;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (getFileExtension(file.name) !== "yml") {
      valitedFiles.remove(file);
      continue;
    }
    let listItem = document.createElement("div");
    listItem.classList.add("bg-gray-200", "p-2", "rounded-md", "w-1/2", "mb-4");

    let fileName = document.createElement("div");
    fileName.innerText = file.name + " ( " + formatFileSize(file.size) + " )";
    fileName.classList.add("text-gray-700", "font-bold");
    listItem.appendChild(fileName);

    let progressBar = document.createElement("div");
    progressBar.classList.add("bg-blue-500", "h-2", "rounded-md", "mt-2", "overflow-hidden");

    let progressBarInner = document.createElement("div");
    progressBarInner.classList.add("bg-blue-600", "h-full");
    progressBar.appendChild(progressBarInner);
    listItem.appendChild(progressBar);

    fileList.appendChild(listItem);
  }
  fileInput.files = valitedFiles;
}

function getFileExtension(filename) {
  return filename.split(".").pop();
}


function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}