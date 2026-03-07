document.getElementById("login-button").addEventListener('click', function() {
    const userInput = document.getElementById('username-input');
    const userValue = userInput.value;
    const passwordInput = document.getElementById("password-input");
    const passwordValue = passwordInput.value;
    
    if (userValue === "admin" && passwordValue === "admin123") {
        window.location.assign("./home.html");
    } else {
        alert("Enter valid username and password");
        userInput.value = "";
        passwordInput.value = "";
    }
});