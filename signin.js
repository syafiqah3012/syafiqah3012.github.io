let fullname = document.getElementById("fullname");
let first = document.getElementById("first");
let last = document.getElementById("last");
let mail = document.getElementById("email");
let photo = document.getElementById("photo");
let id_num = document.getElementById("id_num");
let sign = document.getElementById("sign");
let out = document.getElementById("out");
let info = document.getElementById("info");

// Function to redirect to data.html page
function redirectToDataPage() {
    window.location.href = 'data.html';
}

// Show All Data in Web from localStorage
function showUserData() {
    if (localStorage.getItem("infos")) {
        let userInfo = JSON.parse(localStorage.getItem("infos"));

        info.classList.remove("d-none");
        sign.classList.add("d-none");
        out.classList.remove("d-none");

        fullname.innerHTML = userInfo.fullnameL;
        photo.src = userInfo.photo_linkL;
        first.innerHTML = userInfo.firstL;
        last.innerHTML = userInfo.lastL;
        mail.innerHTML = userInfo.mailL;
        id_num.innerHTML = userInfo.id_numL;
    } else {
        info.classList.add("d-none");
        sign.classList.remove("d-none");
        out.classList.add("d-none");
    }
}

window.addEventListener("load", showUserData());

// Function to handle sign-in response
function handleCredentialResponse(response) {
    const payload = decodeJwtResponse(response.credential);

    let userInfo = {
        fullnameL: payload.name,
        photo_linkL: payload.picture,
        firstL: payload.given_name,
        lastL: payload.family_name,
        mailL: payload.email,
        id_numL: payload.sub
    };

    localStorage.setItem("infos", JSON.stringify(userInfo));
    showUserData();
    redirectToDataPage(); // Redirect to data.html page after successful sign-in
}

// Function to decode JWT response
function decodeJwtResponse(data) {
    let tokens = data.split(".");
    return JSON.parse(atob(tokens[1]));
}

// Function to handle sign-out
out.addEventListener("click", () => {
    localStorage.clear();
    info.classList.add("d-none");
    sign.classList.remove("d-none");
    out.classList.add("d-none");
});


<<<<<<< HEAD

=======
>>>>>>> 04ad71d51a78d724e8801d7d5719e21982e891d3
}

