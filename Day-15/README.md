# Virtual Terminal - V-CORE v1.0

A CLI-based mini operating system built in pure JavaScript that simulates a virtual terminal with multi-layer security, banking system, smart shopping, and secure vault modules.

## Features

### 🔐 Step 1: Boot Security System
- Master PIN authentication (PIN: `9999`)
- 3 login attempts maximum
- System self-destruct on failed authentication
- ASCII banner display on successful login

### 💻 Step 2: Command Kernel
- Continuous `while(true)` loop terminal prompt
- `switch` statement routing for commands
- Error-resistant input handling
- Available commands: `bank`, `shop`, `vault`, `exit`

### 💰 Step 3: Banking Kernel
- Starting balance: $1000
- Commands: `deposit`, `withdraw`, `balance`, `back`
- Decimal support using `parseFloat()`
- Insufficient funds protection
- Real-time balance updates

### 🛒 Step 4: Smart Shop
- Dynamic discount system:
  - 0-5 items: 0% discount
  - 6-10 items: 10% discount
  - 11+ items: 20% discount
- Unit price: $50 per item
- Automatic bank balance deduction
- Purchase receipt generation

### 🔒 Step 5: Secure Vault
- Secret word challenge: `quantum`
- One hint provided
- Secret message reveal on correct guess
- Automatic return to main menu

## How to Run

1. Make sure you have Node.js installed on your system
2. Navigate to the Day-15 directory:
   ```bash
   cd Day-15
   ```
3. Run the script:
   ```bash
   node script.js
   ```

## Usage Flow

1. **Login**: Enter Master PIN `9999` (you have 3 attempts)
2. **Main Menu**: Choose from available modules:
   - `bank` - Access banking operations
   - `shop` - Purchase items with dynamic discounts
   - `vault` - Try to unlock the secret vault
   - `exit` - Shutdown the system
3. **Banking**: Manage your money with deposit/withdraw operations
4. **Shopping**: Buy items and get automatic discounts based on quantity
5. **Vault**: Guess the secret word using the provided hint
6. **Exit**: Cleanly shutdown the virtual terminal

## Technical Implementation

- **State Machine**: Global `systemState` object manages all system states
- **Session Management**: Tracks login status, current module, and session activity
- **Error Handling**: Validates all inputs and handles edge cases gracefully
- **Nested Logic**: Complex conditional flows using if/else chains and switch statements
- **Continuous Loop**: Recursive function calls simulate `while(true)` behavior
- **Security Layers**: PIN authentication and attempt limiting

## System Architecture

```
┌─────────────────────────────────────┐
│       Boot Sequence (Login)         │
│     Master PIN: 9999 (3 attempts)   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│      Main Command Kernel            │
│   (State Machine + Switch Router)   │
└────┬─────────┬──────────┬───────────┘
     │         │          │
     ▼         ▼          ▼
┌─────────┐ ┌──────┐ ┌─────────┐
│ Banking │ │ Shop │ │  Vault  │
│ Module  │ │Module│ │ Module  │
└─────────┘ └──────┘ └─────────┘
```

## Easter Egg

Successfully unlock the vault to discover the hidden secret message!

---

**Built with**: Pure JavaScript (Node.js)  
**Version**: 1.0  
**Author**: Virtual Core Development Team
