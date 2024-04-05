
function signIn() {
    // OAuth 2.0 endpoint for Google Sign-In
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  
    let clientId = "148631875075-1onbgeu2ufn08gel75dsh9nlu3du1m33.apps.googleusercontent.com";

    // Parameters for the OAuth request
    let params = {
        "client_id": clientId,
        "redirect_uri": "https://syafiqah3012.github.io/oauth/callback",
        "response_type": "token",
        "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly",
        "state": "pass-through-value" // Include state parameter for CSRF protection
    };

    // Construct OAuth URL
    let oauthUrl = oauth2Endpoint + "?" + new URLSearchParams(params).toString();

    // Redirect the user to the OAuth URL
    window.location.href = oauthUrl;
}

// Function to extract token from URL parameters
function extractTokenFromURL() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('access_token'); // Assuming access token is passed as a query parameter
}

// Function to verify token
function verifyToken(token) {
    // Make a request to Google's tokeninfo endpoint to validate the token
    let apiUrl = 'https://oauth2.googleapis.com/tokeninfo?access_token=' + encodeURIComponent(token);
    
    return fetch(apiUrl)
        .then(response => {
            if (response.ok) {
                // Token is valid if response status is 200 OK
                return true;
            } else {
                // Token is invalid if response status is not 200 OK
                return false;
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            // Token verification failed due to an error
            return false;
        });
}

// Function to handle authentication success
function handleAuthenticationSuccess() {
    // Redirect the user to data.html
    window.location.href = 'https://syafiqah3012.github.io/data.html';
}

// Function to handle authentication failure
function handleAuthenticationFailure() {
    // Display an error message to the user or perform other error handling actions
    console.error('Authentication failed. Please try again.');
}

// Main function to handle authentication callback
function handleAuthenticationCallback() {
    // Extract token from URL parameters
    let token = extractTokenFromURL();

    // Verify the token
    if (token) {
        // Token is present, verify it
        verifyToken(token)
            .then(valid => {
                if (valid) {
                    // Authentication and token verification succeeded
                    handleAuthenticationSuccess();
                } else {
                    // Token verification failed
                    handleAuthenticationFailure();
                }
            })
            .catch(error => {
                console.error('Error verifying token:', error);
                // Token verification failed due to an error
                handleAuthenticationFailure();
            });
    } else {
        // Token is not present in URL parameters
        handleAuthenticationFailure();
    }
}

// Call the main function to handle authentication callback when the page loads
handleAuthenticationCallback();

<<<<<<< HEAD

=======
>>>>>>> 04ad71d51a78d724e8801d7d5719e21982e891d3
}

