const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let systemState = {
    loggedIn: false,
    loginAttempts: 0,
    balance: 1000,
    sessionActive: true,
    currentModule: 'login'
};

const MASTER_PIN = '9999';
const UNIT_PRICE = 50;
const SECRET_WORD = 'quantum';
const SECRET_HINT = 'It represents something uncertain in physics...';
const SECRET_MESSAGE = 'Congratulations! You unlocked the secret path: https://hidden-realm.vcore/alpha';

function bootSequence() {
    console.clear();
    
    let banner = '';
    banner += '╔═══════════════════════════════════════════════════════════╗\n';
    banner += '║                                                           ║\n';
    banner += '║          ██╗   ██╗████████╗██╗   ██╗ █████╗██╗          ║\n';
    banner += '║          ██║   ██║╚══██╔══╝██║   ██║██╔════╝██║          ║\n';
    banner += '║          ██║   ██║   ██║   ██║   ██║███████╗██║          ║\n';
    banner += '║          ╚██╗ ██╔╝   ██║   ██║   ██║╚════██║██║          ║\n';
    banner += '║           ╚████╔╝    ██║   ╚██████╔╝█████████║███████╗   ║\n';
    banner += '║            ╚═══╝     ╚═╝    ╚═════╝ ╚══════════╚══════╝   ║\n';
    banner += '║                                                           ║\n';
    banner += '║              Welcome to VIRTUAL CORE v1.0                ║\n';
    banner += '║              System Security Protocol Active             ║\n';
    banner += '║                                                           ║\n';
    banner += '╚═══════════════════════════════════════════════════════════╝\n';
    
    console.log(banner);
    console.log('[SYSTEM] Initializing security protocols...');
    console.log('[SYSTEM] Enter Master PIN to authenticate (3 attempts)\n');
    
    attemptLogin();
}

function attemptLogin() {
    if (systemState.loginAttempts >= 3) {
        console.log('\n✗ PIN rejected. Maximum attempts exceeded.');
        console.log('[SYSTEM] Initiating SYSTEM SELF-DESTRUCT SEQUENCE...\n');
        console.log('╔═════════════════════════════════════════════════════╗');
        console.log('║                                                     ║');
        console.log('║          ⚠  SYSTEM SELF-DESTRUCT INITIATED  ⚠      ║');
        console.log('║                                                     ║');
        console.log('║  CORE SYSTEMS SHUTTING DOWN IN 3... 2... 1...      ║');
        console.log('║                                                     ║');
        console.log('╚═════════════════════════════════════════════════════╝\n');
        rl.close();
        return;
    }
    
    rl.question(`[SYSTEM] Attempt ${systemState.loginAttempts + 1}/3 - Enter Master PIN: `, (input) => {
        if (input.trim() === MASTER_PIN) {
            console.log('\n✓ PIN accepted!');
            console.log('[SYSTEM] Authentication successful. Welcome to V-CORE!\n');
            systemState.loggedIn = true;
            systemState.currentModule = 'main';
            mainKernel();
        } else {
            systemState.loginAttempts++;
            console.log(`✗ PIN rejected. Attempt ${systemState.loginAttempts}/3`);
            attemptLogin();
        }
    });
}

function mainKernel() {
    if (!systemState.sessionActive) {
        rl.close();
        return;
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('[V-CORE MAIN KERNEL] System Ready');
    console.log('Available Modules:');
    console.log('  [bank]  - Access Banking Kernel');
    console.log('  [shop]  - Enter Smart Shop');
    console.log('  [vault] - Access Secure Vault');
    console.log('  [exit]  - Shutdown System');
    console.log('═══════════════════════════════════════════════════════\n');
    
    rl.question('[V-CORE]> Type command: (bank, shop, vault, exit): ', (command) => {
        const cmd = command.trim().toLowerCase();
        
        switch (cmd) {
            case 'bank':
                bankingKernel();
                break;
            case 'shop':
                smartShop();
                break;
            case 'vault':
                secureVault();
                break;
            case 'exit':
                console.log('\n═══════════════════════════════════════════════════════');
                console.log('[SYSTEM] Shutting down V-CORE...');
                console.log('[SYSTEM] Finalizing session...');
                console.log('[SYSTEM] Goodbye!');
                console.log('═══════════════════════════════════════════════════════\n');
                systemState.sessionActive = false;
                rl.close();
                break;
            default:
                console.log('✗ Unknown command. Available: bank, shop, vault, exit\n');
                mainKernel();
        }
    });
}

function bankingKernel() {
    systemState.currentModule = 'bank';
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('╔═══════════════════════════════╗');
    console.log('║  BANKING KERNEL INITIALIZED  ║');
    console.log('╚═══════════════════════════════╝');
    console.log(`Current Balance: $${systemState.balance.toFixed(2)}`);
    console.log('Available Commands:');
    console.log('  [deposit]  - Deposit money');
    console.log('  [withdraw] - Withdraw money');
    console.log('  [balance]  - Check balance');
    console.log('  [back]     - Return to main menu');
    console.log('═══════════════════════════════════════════════════════\n');
    
    bankCommandLoop();
}

function bankCommandLoop() {
    rl.question('[BANK]> Enter command: ', (command) => {
        const cmd = command.trim().toLowerCase();
        
        switch (cmd) {
            case 'balance':
                console.log(`Current Balance: $${systemState.balance.toFixed(2)}\n`);
                bankCommandLoop();
                break;
            case 'deposit':
                handleDeposit();
                break;
            case 'withdraw':
                handleWithdraw();
                break;
            case 'back':
                console.log('\n[BANK] Returning to main menu...\n');
                mainKernel();
                break;
            default:
                console.log('✗ Invalid bank command\n');
                bankCommandLoop();
        }
    });
}

function handleDeposit() {
    rl.question('Enter amount to deposit: $', (amount) => {
        const depositAmount = parseFloat(amount);
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log('✗ Invalid amount. Please enter a positive number.\n');
            handleDeposit();
        } else {
            systemState.balance += depositAmount;
            console.log(`✓ Deposit successful! Added $${depositAmount.toFixed(2)}`);
            console.log(`New Balance: $${systemState.balance.toFixed(2)}\n`);
            bankCommandLoop();
        }
    });
}

function handleWithdraw() {
    rl.question('Enter amount to withdraw: $', (amount) => {
        const withdrawAmount = parseFloat(amount);
        
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            console.log('✗ Invalid amount. Please enter a positive number.\n');
            handleWithdraw();
        } else if (withdrawAmount > systemState.balance) {
            console.log('✗ INSUFFICIENT FUNDS');
            console.log(`Available Balance: $${systemState.balance.toFixed(2)}\n`);
            handleWithdraw();
        } else {
            systemState.balance -= withdrawAmount;
            console.log(`✓ Withdrawal successful! Withdrew $${withdrawAmount.toFixed(2)}`);
            console.log(`Remaining Balance: $${systemState.balance.toFixed(2)}\n`);
            bankCommandLoop();
        }
    });
}

function smartShop() {
    systemState.currentModule = 'shop';
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('╔═══════════════════════════════╗');
    console.log('║  SMART SHOP SYSTEM ONLINE    ║');
    console.log('╚═══════════════════════════════╝');
    console.log(`Unit Price: $${UNIT_PRICE}`);
    console.log(`Current Balance: $${systemState.balance.toFixed(2)}`);
    console.log('\nDYNAMIC PRICING:');
    console.log('  0-5 items:   0% discount');
    console.log('  6-10 items:  10% discount');
    console.log('  11+ items:   20% discount');
    console.log('═══════════════════════════════════════════════════════\n');
    
    rl.question('Enter quantity to purchase: ', (quantityStr) => {
        const quantity = parseInt(quantityStr);
        
        if (isNaN(quantity) || quantity <= 0) {
            console.log('✗ Invalid quantity. Please enter a positive number.\n');
            smartShop();
            return;
        }
        
        let discountPercent = 0;
        let discountInfo = '';
        
        if (quantity >= 11) {
            discountPercent = 20;
            discountInfo = '20% SUPER DISCOUNT Applied!';
        } else if (quantity >= 6) {
            discountPercent = 10;
            discountInfo = '10% BULK DISCOUNT Applied!';
        } else {
            discountPercent = 0;
            discountInfo = 'No discount (0-5 items)';
        }
        
        const totalBeforeDiscount = quantity * UNIT_PRICE;
        const discountAmount = totalBeforeDiscount * (discountPercent / 100);
        const finalPrice = totalBeforeDiscount - discountAmount;
        
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('PURCHASE RECEIPT:');
        console.log(`Quantity: ${quantity} items`);
        console.log(`Unit Price: $${UNIT_PRICE}`);
        console.log(`Subtotal: $${totalBeforeDiscount.toFixed(2)}`);
        console.log(discountInfo);
        if (discountPercent > 0) {
            console.log(`Discount: -$${discountAmount.toFixed(2)} (${discountPercent}%)`);
        }
        console.log(`TOTAL: $${finalPrice.toFixed(2)}`);
        console.log('═══════════════════════════════════════════════════════\n');
        
        if (finalPrice > systemState.balance) {
            console.log('✗ INSUFFICIENT FUNDS for this purchase!');
            console.log(`Required: $${finalPrice.toFixed(2)} | Available: $${systemState.balance.toFixed(2)}\n`);
            console.log('[SHOP] Returning to main menu...\n');
            mainKernel();
        } else {
            systemState.balance -= finalPrice;
            console.log('✓ Purchase successful!');
            console.log(`Items purchased: ${quantity}`);
            console.log(`New Balance: $${systemState.balance.toFixed(2)}\n`);
            console.log('[SHOP] Returning to main menu...\n');
            mainKernel();
        }
    });
}

function secureVault() {
    systemState.currentModule = 'vault';
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('╔═════════════════════════════════╗');
    console.log('║  SECURE VAULT SYSTEM ONLINE    ║');
    console.log('╚═════════════════════════════════╝');
    console.log('\nA mysterious secret is hidden within...');
    console.log('You get ONE hint to guess the secret word.\n');
    console.log(`HINT: ${SECRET_HINT}\n`);
    
    rl.question('Enter your guess: ', (guess) => {
        const userGuess = guess.trim().toLowerCase();
        
        if (userGuess === SECRET_WORD) {
            console.log('\n═══════════════════════════════════════════════════════');
            console.log('🔓 VAULT UNLOCKED!');
            console.log('\n╔══════════════════════════════════════════════════════╗');
            console.log('║          *** SECRET MESSAGE REVEALED ***            ║');
            console.log('║                                                      ║');
            console.log(`║  ${SECRET_MESSAGE}  ║`);
            console.log('║                                                      ║');
            console.log('╚══════════════════════════════════════════════════════╝\n');
        } else {
            console.log('\n✗ Incorrect guess!');
            console.log('The vault remains sealed...\n');
        }
        
        console.log('[VAULT] Returning to main menu...\n');
        mainKernel();
    });
}

console.log('[SYSTEM] Booting Virtual Core...\n');
setTimeout(() => {
    bootSequence();
}, 500);
