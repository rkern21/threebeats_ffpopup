			// initializing the library with the API key. This key should be unique. It will be received after Ryan will registry application
	      	// You need to alter next strings for each site because Facebook allows only one application for one site.
	    	//So you'll have multiple strings:
	    	//if(url="people.com"){
	    	//	FB.init({ apiKey: '123456789...' });
	    	//}else if(url="another_url"){
	    	//	FB.init({ apiKey: 'another_api_key' });
	    	//}.....
      		FB.init({ apiKey: '6c9c19286767fb7278e32a9f6b80e7b0' });

      		// fetching the status on load
      		FB.getLoginStatus(handleSessionResponse);
	  
	  		// if user clicks login
      		$('#login').bind('click', function() {
        		login();
      		});
      
     		// login user function 
	  			function login(){
	   				FB.login(function(response) {
	  	  			if (!response.session) {
	  		 			$("#login").show();
	  		 			$("#logout").hide();
         			}else{
	  		 			$("#login").hide();
	  		 			$("#logout").show();
		 			}

         		// if we have a session, query for the user's id, email and name
         		FB.api(
	           {
	             method: 'fql.query',
	             query: 'SELECT name, email FROM user WHERE uid=' + FB.getSession().uid
	           },
	           function(response) {
	             var user = response[0];
	             $('#user-info').html(user.name+" "+user.email+" "+FB.getSession().uid ).show();
	           }
	         );
		   }, {
		   
		   //initializing additional permissions to get access to the user's email
	      	 perms: 'email'
	  	   });
		  }

      $('#logout').bind('click', function() {
        FB.logout(handleSessionResponse);
        clearDisplay();
      });

      // no user, clear display
      function clearDisplay() {
        $('#user-info').hide('fast');
      }

      // handle a session response from any of the auth related calls
      function handleSessionResponse(response) {
        // if we don't have a session, calling login function
        if (!response.session) {
	  		login();
	  		$("#login").show();
	  		$("#logout").hide();
        }else{
	  		$("#login").hide();
	  		$("#logout").show();
		}

        // if we have a session, query for the user's profile id, name and email
        FB.api(
          {
            method: 'fql.query',
            query: 'SELECT name, email FROM user WHERE uid=' + FB.getSession().uid
          },
          function(response) {
            var user = response[0];
            $('#user-info').html(user.name+" "+user.email+" "+FB.getSession().uid ).show('fast');
          }
        );
      }