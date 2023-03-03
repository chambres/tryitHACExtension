
function delRow(elem){
  elem.parentNode.parentNode.remove();
  document.dispatchEvent(new CustomEvent('recalculate', { detail: "" }));  
}


function add(variable){ 
	console.log(variable.parentElement.parentElement.parentElement.parentElement); 

    var a =  [];
	$(variable.parentElement.parentElement).find('td').each (function() {
		if($(this).find('input').val() == undefined){
      //get selection
      a.push($(this).find('select').val());
      
    }
    else{
      a.push($(this).find('input').val());
      $(this).find('input').val("");
    }

	  });   

    console.log(a)

    var hasNumber = /\d/;

    if(!hasNumber.test(a[4])){
      return;
    }

    if(a[5] == ""){ a[5] = "100.00"; } //defaults to 100

    console.log(a)


      newrow = `<tr class="sg-asp-table-data-row">
          <td>${a[0]}</td><td>${a[1]}</td><td>
          <a>
          ${a[2]}
          </a>
          <label style="display:none">*</label>
          </td><td>${a[3]}</td>
          <td align="center">
          ${intToFloat(a[4], 2)}
           <input type="button" onclick="window.parent.delRow(this)" style="float:none!important;display:inline;" value="x" />
          </td>
          <td>${a[5]}</td><td class="sg-view-quick">${a[5]}</td><td class="sg-view-quick">${a[5]}</td><td class="sg-view-quick">${a[5]}</td><td class="sg-view-quick">${a[5]}</td>
          </tr>`

      
    $(newrow).insertBefore($(variable.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("ssg-asp-table-header-row")));


    var a = variable.parentElement.parentElement.parentElement.parentElement
    console.log(a);
    document.dispatchEvent(new CustomEvent('recalculate', { detail: a }));

    function intToFloat(num, decPlaces) { 
        return Number(num).toFixed(decPlaces)
    }




    


}