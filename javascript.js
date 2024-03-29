  // Object to track state of the application
var gameState = {
    gameWon: false
}
var toneNamesArray = [
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
    "F5",
    "F#5",
    "G5",
    "G#5",
    "A5",
    "A#5",
    "B5",
    "C6"
];

// Draw the keyboard
var keyboard = document.getElementById("keyboard");
for (var i = 0; i < toneNamesArray.length; i++) {
    var newKey = document.createElement("div");
    newKey.classList.add("key");
    newKey.setAttribute("id", toneNamesArray[i]);

    // Black keys are contained inside white divs
    if (toneNamesArray[i].indexOf("#") != -1) {
        newKey.classList.add("key-black");

        // Set as child of the white key, not keyboard
        keyboard.lastChild.appendChild(newKey);
    } else {
        newKey.classList.add("key-white");
        keyboard.appendChild(newKey);
    }
}

// Elements for keys and buttons, also message div
var keys = document.querySelectorAll(".key");
var whiteKeys = document.querySelectorAll(".key-white");
var blackKeys = document.querySelectorAll(".key-black");

var newGameButton = document.getElementById("newGame");
var playToneButton = document.getElementById("playTone");
var messageDiv = document.getElementById("messageDiv");
var tooSmallMessageModal = document.getElementById("tooSmallMessageModal");
var userAcceptedSmallScreen = document.getElementById("userAcceptedSmallScreen");

// Pick a random tone to begin the game
// This line might get removed, if "Start Game" button is added
var toneName = toneNamesArray[Math.floor(Math.random() * toneNamesArray.length) + 1];

// Loop adds functions to play the keys
for (var i = 0; i < keys.length; i++) {
    keys[i].addEventListener("mousedown", function(e) {

        // Add depression effect
        e.target.classList.add("key-depressed");

        // Generate tone with the array
        playTone(e.target.id, "sine", 2.0);

        // Set message
        if (toneName === e.target.getAttribute("id")) {
            messageDiv.textContent = "Correct!";
            // Set state to tell the app the game is over
            gameState.gameWon = true;
            // Show new game button if not already shown
            if (newGameButton.classList.contains("hide")) {
                toggleButtons();
            }
        } else if (!gameState.gameWon) {
            // if game isn't over, keep telling false keys
            messageDiv.textContent = "Wrong key...";

            // If wrong key is selected, add a clue
            if (toneNamesArray.indexOf(toneName) < toneNamesArray.indexOf(e.target.getAttribute("id"))) {
                messageDiv.textContent += "try a lower key.";
            } else {
                messageDiv.textContent += "try a higher key.";
            }
        }

        // Stop white keys from firing the listener when black keys are pressed
        e.stopPropagation();
    });

    // Remove depression effect after key release
    keys[i].addEventListener("mouseup", function(e) {
        e.target.classList.remove("key-depressed")
    })
}

// Following loop paints keys gray when mouseover
// CSS :hover doesn't work because of overlapping elements
for (var key of keys) {
    key.addEventListener("mouseover", function(e) {
        e.target.classList.add("mouseover");
        e.stopPropagation();
    });
    key.addEventListener("mouseout", function(e) {
        e.target.classList.remove("mouseover");
        // When a key is clicked and dragged away, key was stuck depressed
        e.target.classList.remove("key-depressed");
        e.stopPropagation();
    });
}

// Device detection displays warning mobile devices
if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) {
    tooSmallMessageModal.classList.add("is-active");
}

// Warning disappears when user clicks button
userAcceptedSmallScreen.addEventListener("click", function() {
    tooSmallMessageModal.classList.remove("is-active");
})

newGameButton.addEventListener("click", function(e) {
    // Clear message, pick a new random note
    messageDiv.textContent = "";
    var newToneNumber = Math.floor(Math.random() * 24) + 1;
    toneName = toneNamesArray[newToneNumber];
    playTone(toneName, "sine", 2.0);
    // Clear gameWon state
    gameState.gameWon = false;
    // Show play note buttons
    toggleButtons();
});

playToneButton.addEventListener("click", function() {
    // Play the target tone
    playTone(toneName, "sine", 2.0);
});

// Hide the shown button, show the hidden button
function toggleButtons() {
    newGameButton.classList.toggle("hide");
    playToneButton.classList.toggle("hide");
}
