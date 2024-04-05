function signIn() {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let clientId = "148631875075-1onbgeu2ufn08gel75dsh9nlu3du1m33.apps.googleusercontent.com";

    let params ={
        "client_id": clientId,
        "redirect_uri": "https://syafiqah3012.github.io/data.html",
        "response_type": "token",
        "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly",
        "include_granted_scopes": true,
        "state": "pass-through-value"
    };

    for (var p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
<<<<<<< HEAD

=======
>>>>>>> 04ad71d51a78d724e8801d7d5719e21982e891d3
}

