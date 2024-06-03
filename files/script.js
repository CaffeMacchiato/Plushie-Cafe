// Function to start the game
function startGame() {
    // Hide the title screen and display the game screen
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Set up canvas and context
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // Character object
    const character = {
        x: 100,
        y: 100,
        width: 92, // Twice the original width
        height: 130, // Twice the original height
        img: new Image()
    };
    character.img.src = 'pictures/joey-chibi-transparent.png';

    // Plushies array
    const plushies = [
        { name: "Cute Teddy Bear", imgSrc: 'pictures/cute teddy bear plush cropped.png', img: new Image() },
        { name: "Pink Bunny", imgSrc: 'pictures/pink bunny plushie pixel art cropped.jpg', img: new Image() },
        { name: "Heart Teddy Bear", imgSrc: 'pictures/teddy bear heart pixel art cute cropped.png', img: new Image() }
    ];

    // Counter to track loaded plushies
    let plushiesLoaded = 0;

    // Load plushie images
    plushies.forEach(plushie => {
        plushie.img.src = plushie.imgSrc;
        plushie.img.onload = () => {
            // Calculate the scaling factor
            let scale = Math.min(100 / plushie.img.width, 80 / plushie.img.height);
            plushie.width = plushie.img.width * scale;
            plushie.height = plushie.img.height * scale;
            // Place the plushie
            placePlushie(plushie);
            plushiesLoaded++;
            if (plushiesLoaded === plushies.length) {
                // All plushies are loaded and placed, start the game loop
                update();
            }
        };
    });

    // Function to place plushies randomly on the canvas
    function placePlushie(plushie) {
        let placed = false;
        while (!placed) {
            plushie.x = getRandomInt(0, canvas.width - plushie.width);
            plushie.y = getRandomInt(0, canvas.height - plushie.height);
            placed = !plushies.some(other => other !== plushie && isColliding(plushie, other));
        }
    }

    // Keyboard input handling
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        KeyT: false // Added "T" key
    };

    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    // Function to move the character
    function moveCharacter() {
        const speed = 5;
        if (keys.ArrowUp || keys.KeyW) character.y -= speed;
        if (keys.ArrowDown || keys.KeyS) character.y += speed;
        if (keys.ArrowLeft || keys.KeyA) character.x -= speed;
        if (keys.ArrowRight || keys.KeyD) character.x += speed;

        // Prevent character from moving out of the canvas
        if (character.x < 0) character.x = 0;
        if (character.y < 0) character.y = 0;
        if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
        if (character.y + character.height > canvas.height) character.y = canvas.height - character.height;

        let collidingWithPlushie = false; // Flag to check if character is colliding with any plushie
        plushies.forEach(plushie => {
            if (isColliding(character, plushie)) {
                collidingWithPlushie = true;
                document.getElementById('prompt').textContent = `Press and hold 'T' to talk to ${plushie.name}`;
                document.getElementById('prompt').style.visibility = 'visible'; // Show the prompt
            }
        });

        // Check for "T" key press
        if (keys.KeyT) {
            // Display the desired text
            document.getElementById('prompt').textContent = "What would you like to eat?";
            document.getElementById('prompt').style.visibility = 'visible'; // Show the prompt

            // Hide the prompt after 2 seconds
            setTimeout(() => {
                document.getElementById('prompt').style.visibility = 'hidden'; // Hide the prompt
            }, 2000);
        } else if (!collidingWithPlushie) {
            // If character is not colliding with any plushie and "T" key is not pressed, hide the prompt
            document.getElementById('prompt').style.visibility = 'hidden'; // Hide the prompt
        }
    }

    // Function to detect collisions between two rectangles
    function isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Function to draw everything on the canvas
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(character.img, character.x, character.y, character.width, character.height);
        plushies.forEach(plushie => {
            ctx.drawImage(plushie.img, plushie.x, plushie.y, plushie.width, plushie.height);
        });
    }

    // Function to continuously update the game
    function update() {
        moveCharacter();
        draw();
        requestAnimationFrame(update);
    }
}

// Function to generate a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Function to calculate the distance between two points
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Event listener for the start button to begin the game
document.getElementById('start-button').addEventListener('click', startGame);
