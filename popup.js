

// Create a dictionary to store the data
const myDict = {};

// Retrieve the dictionary from Chrome storage
chrome.storage.sync.get(["myDict"], function(result) {
    console.log("Dictionary retrieved from Chrome storage: ", result.myDict);
    

    // Get the container element
    const fieldsContainer = document.getElementById("fields");

    // Create the fields
    for (const key in result.myDict) {
    if (result.myDict.hasOwnProperty(key)) {
        const label = document.createElement("label");
        label.setAttribute("for", key.toLowerCase());
        label.textContent = `${key}:`;

        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", key.toLowerCase());
        input.setAttribute("name", key.toLowerCase());
        input.setAttribute("class", "form-control")
        input.value = result.myDict[key];

        fieldsContainer.appendChild(label);
        fieldsContainer.appendChild(input);
        fieldsContainer.appendChild(document.createElement("br"));
    }
    }

    //add keydown listener to form-control
    const formControls = document.getElementsByClassName("form-control");
    for (const formControl of formControls) {
        setInputFilter(formControl, function(value) {
            return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp.
          }, "Only digits and '.' are allowed");

        formControl.addEventListener("keyup", function(e) {
            console.log(e)
            save();
        });
    }

    
    

    function save() {
        // Get the values from the input fields
        for (const key in result.myDict) {
            if (result.myDict.hasOwnProperty(key)) {
                console.log(key)
                console.log(document.getElementById(key.toLowerCase()).value)
                result.myDict[key] = document.getElementById(key.toLowerCase()).value;
            }
        }

        // Save the dictionary to Chrome storage
        chrome.storage.sync.set({ myDict: result.myDict }, function() {
            console.log("Dictionary saved to Chrome storage");
        });
    }






    // Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter, errMsg) {
    [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
      textbox.addEventListener(event, function(e) {
        if (inputFilter(this.value)) {
          // Accepted value.
          if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0){
            this.classList.remove("input-error");
            this.setCustomValidity("");
          }
  
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        }
        else if (this.hasOwnProperty("oldValue")) {
          // Rejected value: restore the previous one.
          this.classList.add("input-error");
          this.setCustomValidity(errMsg);
          this.reportValidity();
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
        else {
          // Rejected value: nothing to restore.
          this.value = "";
        }
      });
    });
  }

});


