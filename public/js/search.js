var search = (function() {
    //caching DOM
    var search = $("#search"); //search input selector
    var res = $("#res"); //ul that shows the results
    var timeoutID; //timeout on ajax requests to reduce server load
    
    //bind event
    search.on("keyup", function() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(ajaxSearch, 200);
    });
    
    function render(results) {
        var string = "";
        if (results.length > 0) {
            results.forEach(function(result) { //loops through each ajax result and creates an anchor link
                         string += "<li><a href=" + "/campgrounds/" + result._id + ">" + result.name + "</a></li>";   //build the element in the form of a string
                         
                         });
                         res.html(string); //injects the build up string into the #res ul
        } else {
            res.html("<li>No results found</li>");
        }
        
    }
    
    function ajaxSearch () {
         if(search.val().length > 1 ) { //only send an AJAX request when the user has typed more than 1 letters
             $.ajax({
              type: 'GET',
              url: "/campgrounds/search/" + search.val(),
              success: function(results) {
                  render(results);
            }
         }); 
         } else {
             res.html(""); // clear the results if the search input is empty
         }
    }
         
    
})();
    
