$(function(){

	$.ajax({
	    url: 'http://localhost:3000/gantt',
	    type: 'GET',
	    success : function(data) {

	    	var tasks = data;

	    	console.log(data);

			var gantt = new Gantt("#gantt", tasks, {
				view_mode: 'Year',
				date_format: 'YYYY-MM-DD'
			});
		}
	      
  	});

	
})