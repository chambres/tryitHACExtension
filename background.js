//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.





$(document).ready(function() {


var s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


const regex = /Category:\s*(\w+)/;

var categories = [];

var slides = document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-asp-table-data-row");
for (var i = 0; i < slides.length; i++) {
   console.log()

    var match = slides.item(i).innerHTML.match(regex);
    var category = match && match[1];
    if(category == null){continue;}
    console.log(category);
    categories.push(category);
    
}
var cats = new Set(categories);

data = `<tr class="ssg-asp-table-header-row" style="background-color:rgb(0, 255, 255);" >
			<td>Date Due (Optional)</td><td>Date Assigned (Optional)</td><td>Assignment (Optional)  </td><td>Category</td><td>Score</td><td>Total Points</td><td class="sg-view-quick">Weight</td><td class="sg-view-quick">Weighted Score</td><td class="sg-view-quick">Weighted Total Points</td><td class="sg-view-quick">Percentage</td>
		</tr>`


dat = `<tr class="ssg-asp-table-data-row">
   <td><input type="text" id="Date Due" name="username"></td>
   <td><input type="text" id="Date Assigned" name="username"></td>
   <td><input type="text" id="Assignment" name="username"></td>
   <td><select class="select-category"></select></td>
   <td><input type="text" id="Score" name="username"></td>
   <td><input type="text" id="Total Points" name="username"><button type="button" class="btn btn-primary" id="add" onclick='console.log(this.parentElement.parentElement.parentElement.parentElement); window.parent.add(this);'>Add</button></td>
</tr>`



$(document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-asp-table")).append(data);

    
$(document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-asp-table")).append(dat); 


const select = $(document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("select-category"));


console.log(select)


console.log(cats)

    // Retrieve the dictionary from Chrome storage
    chrome.storage.sync.get(["myDict"], function(result) {
    console.log("Dictionary retrieved from Chrome storage: ", result.myDict);
    if(result.myDict == undefined){
        console.log("no dict");
        const myDict = {};
        cats.forEach((value) => {
        myDict[value] = "";
        });

        // Save the dictionary to Chrome storage
        chrome.storage.sync.set({ myDict }, function() {
            console.log("Dictionary saved to Chrome storage");
        });
    }
    else{
        console.log("dict exists");
    }

    });

    for (const cat of cats) {
        const option = $("<option>").text(cat);
        select.append(option);console.log("saved");

    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }

    function recalculate(){
            var data = result.myDict;
            console.log(data)

            newGrades = [];

            for( var i = 0; i < document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-asp-table").length; i++){
                var table = document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-asp-table")[i];

                totalWeight = 0;
                weightedAverage = 0;


                for(var j = 0; j < table.getElementsByClassName('sg-asp-table-data-row').length; j++){
                    var row = table.getElementsByClassName('sg-asp-table-data-row')[j];
                    if((row.getElementsByTagName("td").length) > 6){ //avoid full view
                        if(row.getElementsByTagName("td")[4].innerHTML.trim() == ''){continue;}

                        var weight = data[(row.getElementsByTagName("td")[3].innerHTML.trim())];
                        if(weight == ''){
                            alert("Enter your weights in the extension!");
                            return;
                        }


                        
                        var grade = parseInt(row.getElementsByTagName("td")[4].innerHTML.trim());
                        var outof = parseInt(row.getElementsByTagName("td")[5].innerHTML.trim());


                        
                        totalWeight += +weight;

                        weightedAverage += (+grade/+outof) * +weight;
                                
                    }
                }

                if(totalWeight == 0 || weightedAverage == 0){continue;}

                
                newGrades.push((weightedAverage/totalWeight) * 100);

            }

            console.log()

            var count = 0;
            for(var i = 0; i < document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-header-heading sg-right").length; i++){
                var heading = document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-header-heading sg-right")[i].innerHTML
                
                
                if(document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-header-heading sg-right")[i].innerHTML == ''){
                    continue;
                }
            
                
                console.log(newGrades[count])
                document.getElementById("sg-legacy-iframe").contentWindow.document.getElementsByClassName("sg-header-heading sg-right")[i].innerHTML = '<style="color:blue;"> Classwork Average ' + Math.round(newGrades[count]);
                count++;
            }
    }


  document.addEventListener('recalculate', function (e) { //triggered by the add button in script.js
    chrome.storage.sync.get(["myDict"], function(result) {
        recalculate();
    });


  });




});
