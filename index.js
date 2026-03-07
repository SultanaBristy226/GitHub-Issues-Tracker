
console.log("Index.js loaded successfully");
console.log("Current location:", window.location.pathname);
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded");
    
    const loginButton = document.getElementById("login-button");
    console.log("Login button found:", loginButton);
    
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            console.log("Login button clicked");
            
            const userInput = document.getElementById('username-input');
            const passwordInput = document.getElementById("password-input");
            
            console.log("Username input:", userInput);
            console.log("Password input:", passwordInput);
            
            const userValue = userInput.value;
            const passwordValue = passwordInput.value;
            
            console.log("Username:", userValue);
            console.log("Password:", passwordValue);
            
            if (userValue === "admin" && passwordValue === "admin123") {
                console.log("Login successful, redirecting to homepage.html");
                window.location.href = "homepage.html";
                
            } else {
                alert("Enter valid username and password");
                userInput.value = "";
                passwordInput.value = "";
                userInput.focus();
            }
        });
    } else {
        console.error("Login button not found!");
    }
});

