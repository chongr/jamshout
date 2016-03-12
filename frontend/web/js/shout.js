//Global Data
var url = "https://api.parse.com/1/classes/jam";
var appId = "wYg7o4Y8YKRT0hRdo4L6hkGH4SXMLu442ZcRqPWL";
var restKey = "NPpukuphjKnmihajxzJyuSz3UWrrSZDpWBKEvidE";

function formSubmit() {
	if(!sanitizeJam())
		return;

	//close form
	$("#shoutPopup").hide();

	var formObj = {"votes": 0};
	var data = $('#songForm').serializeArray();

	$.each(data, function (i, input) {
    		formObj[input.name] = input.value;
	});

	sendToParse(formObj);

}

function sendToParse(obj) {
	var data = JSON.stringify(obj)

	$.ajax({
	  url: url,
	  type:"POST",
	  data: data,
	  contentType:"application/json",
	  dataType:"json",
	  headers: {'X-Parse-Application-Id': appId, 'X-Parse-REST-API-Key': restKey},
	  success: function(){
	    refresh();
	  }
	})
}