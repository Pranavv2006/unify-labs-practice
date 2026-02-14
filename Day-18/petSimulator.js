import readline from "readline";

class Pet {
  constructor(name, type) {
    this.name = name;
    this.type = type;

    this._health = 100;
    this._hunger = 0;   
    this._energy = 100; 
  }

  get health() {
    return this._health;
  }

  set health(val) {
    this._health = Math.max(0, Math.min(100, val));
  }

  get hunger() {
    return this._hunger;
  }

  set hunger(val) {
    this._hunger = Math.max(0, Math.min(100, val));
  }

  get energy() {
    return this._energy;
  }

  set energy(val) {
    this._energy = Math.max(0, Math.min(100, val));
  }

  feed() {
    console.log(`\n🍖 You fed ${this.name}.`);
    this.hunger -= 20;
    this.energy += 10;
    this.health += 5;
    this.showStatus();
  }

  play() {
    console.log(`\n🎾 You played with ${this.name}.`);
    this.energy -= 20;
    this.hunger += 15;
    this.health += 5;
    this.showStatus();
  }

  showStatus() {
    console.log(`
🐶 ${this.name}'s Status:
  Health : ${this.health}
  Hunger : ${this.hunger}
  Energy : ${this.energy}
`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🎮 Welcome to the Digital Pet Simulator (CLI)\n");

rl.question("Enter your pet's name: ", (name) => {
  rl.question("Enter your pet's type: ", (type) => {
    const pet = new Pet(name, type);
    console.log(`\n🐾 A new pet has been born! Meet ${pet.name} the ${pet.type}.\n`);
    pet.showStatus();

    const menu = `
What would you like to do?
1. Feed
2. Play
3. Status
4. Exit
Enter a number: `;

    function askAction() {
      rl.question(menu, (choice) => {
        switch (choice.trim()) {
          case "1":
            pet.feed();
            askAction();
            break;
          case "2":
            pet.play();
            askAction();
            break;
          case "3":
            pet.showStatus();
            askAction();
            break;
          case "4":
            console.log("\n👋 Thanks for playing! Goodbye!");
            rl.close();
            break;
          default:
            console.log("\n❗ Invalid choice. Try again.");
            askAction();
        }
      });
    }

    askAction();
  });
}
);
