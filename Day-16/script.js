const getTextInput = () => document.getElementById('textInput').value;

const titleCase = (str) => {
    return str
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const countVowelsTotal = (str) => {
    const vowels = 'aeiouAEIOU';
    return str.split('').filter(char => vowels.includes(char)).length;
};

const countVowelsBreakdown = (str) => {
    const vowels = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    str.toLowerCase().split('').forEach(char => {
        if (char in vowels) vowels[char]++;
    });
    return vowels;
};

const generateSecretMessage = (str, secretWordsInput) => {
    const secretWords = secretWordsInput
        .split(',')
        .map(word => word.trim().toLowerCase())
        .filter(word => word.length > 0);
    
    return str.split(/\s+/).map(word => {
        const wordLower = word.toLowerCase().replace(/[^\w]/g, '');
        return secretWords.includes(wordLower) ? '***' : word;
    }).join(' ');
};

const cleanText = (str) => {
    return str.trim().replace(/\s+/g, ' ');
};

const getTextStats = (str) => {
    const cleaned = cleanText(str);
    const charCount = cleaned.length;
    const wordArray = cleaned.split(/\s+/).filter(word => word.length > 0);
    const wordCount = wordArray.length;
    const vowelCount = countVowelsTotal(cleaned);
    const consonantCount = charCount - vowelCount;
    const sentenceCount = (cleaned.match(/[.!?]/g) || []).length || 1;
    const avgWordLength = wordCount > 0 ? (charCount / wordCount).toFixed(2) : '0.00';
    const avgWordsPerSentence = (wordCount / sentenceCount).toFixed(2);
    const spaceCount = (cleaned.match(/\s/g) || []).length;
    
    return {
        characters: charCount,
        words: wordCount,
        vowels: vowelCount,
        consonants: consonantCount,
        sentences: sentenceCount,
        spaces: spaceCount,
        avgWordLength: parseFloat(avgWordLength),
        avgWordsPerSentence: parseFloat(avgWordsPerSentence),
        longestWord: wordArray.length > 0 ? Math.max(...wordArray.map(w => w.length)) : 0,
        shortestWord: wordArray.length > 0 ? Math.min(...wordArray.map(w => w.length)) : 0
    };
};

const applyTitleCase = () => {
    const input = getTextInput();
    
    if (input.trim() === '') {
        document.getElementById('titleCaseOutput').innerHTML = 
            '<p class="error">❌ Please enter some text first.</p>';
        return;
    }
    
    const result = titleCase(input);
    document.getElementById('titleCaseOutput').innerHTML = `<p>${result}</p>`;
    updateStats();
};

const displayVowelCount = () => {
    const input = getTextInput();
    
    if (input.trim() === '') {
        document.getElementById('vowelOutput').innerHTML = 
            '<p class="error">❌ Please enter some text first.</p>';
        return;
    }
    
    const total = countVowelsTotal(input);
    const breakdown = countVowelsBreakdown(input);
    const cleaned = cleanText(input);
    const percentage = cleaned.length > 0 ? 
        ((total / cleaned.length) * 100).toFixed(2) : '0.00';
    
    let html = `
        <ul class="stats-list">
            <li>
                <span class="stat-label">Total Vowels:</span>
                <span class="stat-value">${total}</span>
            </li>
            <li>
                <span class="stat-label">Percentage:</span>
                <span class="stat-value">${percentage}%</span>
            </li>
            <li style="border-bottom: 2px solid #ddd; padding-bottom: 10px;">
                <span class="stat-label">Breakdown:</span>
            </li>
            <li>
                <span>A: ${breakdown.a}</span>
                <span>E: ${breakdown.e}</span>
            </li>
            <li>
                <span>I: ${breakdown.i}</span>
                <span>O: ${breakdown.o}</span>
            </li>
            <li>
                <span>U: ${breakdown.u}</span>
            </li>
        </ul>
    `;
    
    document.getElementById('vowelOutput').innerHTML = html;
    updateStats();
};

const showSecretMessage = () => {
    const input = getTextInput();
    const secretWordsInput = document.getElementById('secretWords').value;
    
    if (input.trim() === '') {
        document.getElementById('secretOutput').innerHTML = 
            '<p class="error">❌ Please enter some text first.</p>';
        return;
    }
    
    if (secretWordsInput.trim() === '') {
        document.getElementById('secretOutput').innerHTML = 
            '<p class="error">❌ Please configure secret words.</p>';
        return;
    }
    
    const result = generateSecretMessage(input, secretWordsInput);
    document.getElementById('secretOutput').innerHTML = `<p>${result}</p>`;
    updateStats();
};

const updateStats = () => {
    const input = getTextInput();
    
    if (input.trim() === '') {
        document.getElementById('statsOutput').innerHTML = 
            '<p class="placeholder">Enter text and click a button to see statistics...</p>';
        return;
    }
    
    const stats = getTextStats(input);
    
    let html = `
        <ul class="stats-list">
            <li>
                <span class="stat-label">Characters:</span>
                <span class="stat-value">${stats.characters}</span>
            </li>
            <li>
                <span class="stat-label">Words:</span>
                <span class="stat-value">${stats.words}</span>
            </li>
            <li>
                <span class="stat-label">Vowels:</span>
                <span class="stat-value">${stats.vowels}</span>
            </li>
            <li>
                <span class="stat-label">Consonants:</span>
                <span class="stat-value">${stats.consonants}</span>
            </li>
            <li>
                <span class="stat-label">Sentences:</span>
                <span class="stat-value">${stats.sentences}</span>
            </li>
            <li>
                <span class="stat-label">Avg Word Length:</span>
                <span class="stat-value">${stats.avgWordLength}</span>
            </li>
            <li>
                <span class="stat-label">Longest Word:</span>
                <span class="stat-value">${stats.longestWord} chars</span>
            </li>
            <li>
                <span class="stat-label">Shortest Word:</span>
                <span class="stat-value">${stats.shortestWord} chars</span>
            </li>
        </ul>
    `;
    
    document.getElementById('statsOutput').innerHTML = html;
};

const clearAll = () => {
    document.getElementById('textInput').value = '';
    document.getElementById('titleCaseOutput').innerHTML = 
        '<p class="placeholder">Your formatted text will appear here...</p>';
    document.getElementById('vowelOutput').innerHTML = 
        '<p class="placeholder">Click "Count Vowels" to analyze...</p>';
    document.getElementById('secretOutput').innerHTML = 
        '<p class="placeholder">Click "Secret Message" to censor...</p>';
    document.getElementById('statsOutput').innerHTML = 
        '<p class="placeholder">Statistics will appear here...</p>';
    document.getElementById('textInput').focus();
};

document.getElementById('textInput').addEventListener('input', updateStats);
