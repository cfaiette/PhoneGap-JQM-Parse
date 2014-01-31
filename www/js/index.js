/* JQM + Parse */

var app = {

	// Constants
	APP_NAME: "{my app}",

	// Parse Keys
	PARSE_APPLICATION_ID: '{ Your Parse application id }',
	PARSE_CLIENT_KEY: '{ Your Parse client key }',
	PARSE_JAVASCRIPT_KEY:'{ Your Parse javascript key }',
	PARSE_REST_KEY:'{ Your Prase rest key }',	

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Device Ready');        
    }
};

// JQM Event Binding
//-------------------------------------------------

// Disable Transitions 
$( document ).bind( "mobileinit", function() {    	
	$.mobile.allowCrossDomainPages = true;
	$.mobile.defaultPageTransition   = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.phonegapNavigationEnabled = true;
	
	// Initialize Parse
	//-------------------------------------------------
	Parse.initialize(app.PARSE_APPLICATION_ID, app.PARSE_JAVASCRIPT_KEY);	
	
	// Attach FastClick
	//-------------------------------------------------
	$(function() {
		FastClick.attach(document.body);
	});		
	
	// Setup jQuery Validation
	//-------------------------------------------------
	
	// Sign in form
	$('#signInForm').validate({
		rules: {  			
			sign_in_email: {
				required: true,
				email: true				
			},
			sign_in_password: {
				required: true				
			}
		},
		highlight: function (element) {        		
			$(element).textinput({theme: 'b'});
		},
		success: function (label) {		
			$(label).parent().prev().find('input:first').textinput({theme: 'c'});		
		},
		errorPlacement: function(error, element) {
			$(error).appendTo($('<div class="error-container"></div>').appendTo($(element).parent().parent()));
		}
	});
	
	// Sign up form
	$('#signUpForm').validate({
		rules: {  			
			sign_up_email: {
				required: true,
				email: true,
				parseUniqueEmail: true
			},
			sign_up_password: {
				required: true,
				minlength: 5
			},
			sign_up_password_confirm: {
				required: true,
				minlength: 5,
				equalTo: "#sign_up_password"			
			}
		},
		highlight: function (element) {        		
			$(element).textinput({theme: 'b'});
		},
		success: function (label) {		
			$(label).parent().prev().find('input:first').textinput({theme: 'c'});		
		},
		errorPlacement: function(error, element) {
			$(error).appendTo($('<div class="error-container"></div>').appendTo($(element).parent().parent()));
		}
	});
	
	
	// Forgot password form
	$('#forgotPasswordForm').validate({
		rules: {  			
			forgot_email: {
				required: true,
				email: true
			}			
		},
		highlight: function (element) {        		
			$(element).textinput({theme: 'b'});
		},
		success: function (label) {		
			$(label).parent().prev().find('input:first').textinput({theme: 'c'});		
		},
		errorPlacement: function(error, element) {
			$(error).appendTo($('<div class="error-container"></div>').appendTo($(element).parent().parent()));
		}
	});
	
	// Event Handlers
	//-------------------------------------------------
	
	// Sign in form submit
	$('#signInForm').on('submit', function(e) { 		
		e.preventDefault();  				
		$.mobile.loading('show');		
		$('.error-message').hide();		
		$.mobile.activePage.validator = $("#signInForm").validate();			
		if($.mobile.activePage.validator.valid())
		{						
			Parse.User.logIn($('#sign_in_email').val(), $('#sign_in_password').val(), {
				success: function(user) {
					$.mobile.loading('hide');
					$('#sign_in_password').val('');
					$.mobile.navigate("#MainApp");
				},
				error: function(user, error) {		
					console.log(error.message);
					$.mobile.loading('hide');
					$('#sign_in_email').textinput({theme: 'b'});
					$('#sign_in_password').textinput({theme: 'b'});
					$('.error-message').html("Invalid username or password.").show();
				}
			});			
		}
		else
		{			
			$.mobile.loading('hide');	
		}		
	});
		
	// Sign up form submit	
	$('#signUpForm').on('submit', function(e) {
		e.preventDefault();  		
		$.mobile.loading('show');
		$('.error-message').hide();
		$.mobile.activePage.validator = $("#signUpForm").validate();
		if($.mobile.activePage.validator.valid())
		{			
			var newUser = new Parse.User();
			newUser.set("username", $('#sign_up_email').val());
			newUser.set("password", $('#sign_up_password').val());
			newUser.set("email",  $('#sign_up_email').val());
			
			newUser.signUp(null, {
				success: function(user) {							
					$.mobile.loading('hide');
					$.mobile.navigate("#MainApp");																
				},
				error: function(user, error) {
					console.log(error.message);
					$.mobile.loading('hide');
					$('#sign_up_email').textinput({theme: 'b'});
					$('#sign_up_password').textinput({theme: 'b'});
					$('#sign_up_email').textinput({theme: 'b'});
					$('.error-message').html("Could not sign up. Try again.").show();
				}
			});
		}
		else
		{
			$.mobile.loading('hide');	
		}
	});
	
	// Forgot password form submit
	$('#forgotPasswordForm').on('submit', function(e) {
		e.preventDefault();  		
		$.mobile.loading('show');
		$('.error-message').hide();
		$('.success-message').hide();
		$.mobile.activePage.validator = $("#forgotPasswordForm").validate();
		if($.mobile.activePage.validator.valid())
		{				
			Parse.User.requestPasswordReset($('#forgot_email').val(), {					
				success:function() {
					$.mobile.loading('hide');
					$('.success-message').html("You should recieve your request shortly.").show();
				},
				error:function(error) {
					console.log(error.message);
					$.mobile.loading('hide');
					$('#forgot_email').textinput({theme: 'b'});
					$('.error-message').html("Invalid email address.").show();
				}
			});
		}
		else
		{
			$.mobile.loading('hide');	
		}
	});
	
		
	// Sign out button
	$('#signOutButton').click(function(){
		Parse.User.logOut();
		$.mobile.navigate("#SignIn");	
		return false;
	});
	
	// Page Styling 
	$('.app-name').html(app.APP_NAME);
	
	// Misc Initialization
	//-------------------------------------------------
	
	// Route to 'MainApp' page if Parse current user exists and is authenticated
	if(Parse.User.current() && Parse.User.current().authenticated()){		
		$.mobile.changePage("#MainApp", { changeHash: true});
	}	
	
});

$( document ).bind( "pagebeforechange", function() {

	if($.mobile.activePage && $.mobile.activePage.validator){		
			$.mobile.activePage.validator.resetForm();
			$.mobile.activePage.validator.reset();
		}
		$('.form-text').textinput({theme: 'a'});
		$('.form-text').val('');
		$('.error-container').remove();
		$('.error-message').hide();
		$('.success-message').hide();
		
});

$( document ).bind( "pagechange", function(event, data) {	
	if($(data.toPage).attr('id') == "MainApp"){
		$('#loggedInUsername').html(Parse.User.current().getUsername());
	}	
});

$( document ).bind( "showpage", function() {
	$.mobile.activePage.validator = null;
});

/* Custom Validation Methods */

// Check for unqiue email address in Parse
jQuery.validator.addMethod("parseUniqueEmail", function(value, element, params) {		
	var isUnique = true;
	if(!$(element).is(":focus"))
	{
		$.ajax({
			type: 'GET',	
			async: false,				
			headers: {
				'X-Parse-Application-Id': app.PARSE_APPLICATION_ID,
				'X-Parse-REST-API-Key': app.PARSE_REST_KEY
			},
			url:'https://api.parse.com/1/users',
			data: {
				where: {
					email: function(){return $(element).val();}
				}
			},					
			contentType: 'application/json',			
			complete: function(data){
				var response = JSON.parse(data.responseText);				
				isUnique = response['results'].length == 0;
			}
		});
	}
	return isUnique;
}, jQuery.validator.format("Email already exists"));


