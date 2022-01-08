console.log("Content Script at Work");

//function to create extension container to display
async function createExtensionContainer() {
  //create container
  console.log("add container");
  var extensionContainer = document.createElement("div");
  extensionContainer.id = "extensionContainer";
  extensionContainer.style.cssText =
    "position:absolute;top:0;right:0;width:auto;height:auto;opacity:1;z-index:1000000;background-color:pink;";
  document.body.appendChild(extensionContainer);

  return new Promise(async (resolve, reject) => {
    try {
      //get HTML data
      console.log("add container data");
      var htmlURL = chrome.runtime.getURL("/src/content/content.html");
      var htmlContent = await $.get(htmlURL);
      $("#extensionContainer").html(htmlContent);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

//function to display search Dictionary button or not
function displaySearchDictionaryButton(isWord) {
  if (isWord) {
    $("#extension #meaningButton").css("display", "block");
  } else {
    $("#extension #meaningButton").css("display", "none");
  }
}

// display container on right side on ctrl + Selection event
$(document).mouseup(async function (event) {
  if ((event.ctrlKey || event.metaKey) && window.getSelection) {
    console.log("Detected selection with ctrl key");

    //get selected text
    var selectedText = window.getSelection().toString();
    selectedText = selectedText.trim();
    console.log(selectedText);

    //store selected text in chrome storage
    chrome.storage.sync.set({ selectedText: selectedText });

    var isWord = selectedText.split(" ").length == 1;

    //store isWord in chrome storage
    chrome.storage.sync.set({ isWord: isWord });

    //create display container
    createExtensionContainer()
      .then(() => {
        //add selected text to the container
        console.log("containerAdded");

        displaySearchDictionaryButton(isWord);

        $("#extension #selectedText").html(selectedText);
        console.log($("#extension"));
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//remove extension container when user clicks outside the div
$(document).mousedown(function (event) {
  var container = $("#extensionContainer");

  // if the target of the click isn't the container nor a descendant of the container
  if (!container.is(event.target) && container.has(event.target).length === 0) {
    container.remove();
  }
});