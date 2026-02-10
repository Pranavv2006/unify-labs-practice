const target = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 7;

let guess = null;

while (guess !== target && attempts < maxAttempts) {
    guess = prompt(`Guess a number between 1 and 100 (Attempt ${attempts + 1} of ${maxAttempts}):`);

    guess = Number(guess);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert("Please enter a valid number between 1 and 100.");
        continue;
    }

    attempts++;

    if (guess < target) {
        alert("Too low!");
    } else if (guess > target) {
        alert("Too high!");
    } else {
        alert(`Correct! You guessed it in ${attempts} attempts.`);
        break;
    }
}

if (guess !== target) {
    alert(`Game Over! The number was ${target}.`);
}

