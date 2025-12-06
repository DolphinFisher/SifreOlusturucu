document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const passwordDisplay = document.getElementById('password-display');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    const lengthSlider = document.getElementById('length-slider');
    const lengthNumber = document.getElementById('length-number');
    const lengthValue = document.getElementById('length-value');
    
    const includeSpecial = document.getElementById('include-special');
    const includeNumbers = document.getElementById('include-numbers');
    const includeUppercase = document.getElementById('include-uppercase');
    
    const generateBtn = document.getElementById('generate-btn');

    // Character Sets
    const chars = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        number: '0123456789',
        special: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    // Initialize
    syncLengthInputs(12);
    generatePassword();

    // Event Listeners
    lengthSlider.addEventListener('input', (e) => {
        syncLengthInputs(e.target.value);
        generatePassword();
    });

    lengthNumber.addEventListener('input', (e) => {
        syncLengthInputs(e.target.value);
        generatePassword();
    });

    [includeSpecial, includeNumbers, includeUppercase].forEach(el => {
        el.addEventListener('change', () => {
            // Prevent unchecking all
            if (!includeSpecial.checked && !includeNumbers.checked && !includeUppercase.checked) {
                // If user tries to uncheck the last one (which implies lowercase only is left implicitly, 
                // but usually we want at least one complexity option or just default to lowercase).
                // Actually, if all are unchecked, we just use lowercase. That's fine.
            }
            generatePassword();
        });
    });

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', copyToClipboard);

    toggleVisibilityBtn.addEventListener('click', () => {
        const type = passwordDisplay.getAttribute('type') === 'text' ? 'password' : 'text';
        passwordDisplay.setAttribute('type', type);
        
        const icon = toggleVisibilityBtn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // Functions
    function syncLengthInputs(value) {
        // Clamp value
        let val = parseInt(value);
        if (isNaN(val)) val = 12;
        if (val < 8) val = 8;
        if (val > 64) val = 64;

        lengthSlider.value = val;
        lengthNumber.value = val;
        lengthValue.textContent = val;
    }

    function generatePassword() {
        let length = parseInt(lengthSlider.value);
        let charset = chars.lower; // Always include lowercase
        
        if (includeUppercase.checked) charset += chars.upper;
        if (includeNumbers.checked) charset += chars.number;
        if (includeSpecial.checked) charset += chars.special;

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        passwordDisplay.value = password;
        calculateStrength(password);
    }

    function calculateStrength(password) {
        let score = 0;
        
        // Length contribution
        if (password.length > 8) score += 10;
        if (password.length > 12) score += 20;
        if (password.length >= 16) score += 30;

        // Variety contribution
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;

        // Max score roughly 100
        // Normalize
        if (score > 100) score = 100;

        // Update UI
        strengthFill.style.width = `${score}%`;
        
        let color = '#e74c3c'; // Weak (Red)
        let text = 'Zayıf';

        if (score > 40) {
            color = '#f1c40f'; // Medium (Yellow)
            text = 'Orta';
        }
        if (score > 70) {
            color = '#2ecc71'; // Strong (Green)
            text = 'Güçlü';
        }

        strengthFill.style.backgroundColor = color;
        strengthText.textContent = `Güç: ${text}`;
        strengthText.style.color = color;
    }

    function copyToClipboard() {
        const password = passwordDisplay.value;
        if (!password) return;

        navigator.clipboard.writeText(password).then(() => {
            showFeedback();
        }).catch(err => {
            console.error('Kopyalama hatası:', err);
            // Fallback for older browsers if needed, but modern browsers support this
            passwordDisplay.select();
            document.execCommand('copy');
            showFeedback();
        });
    }

    function showFeedback() {
        copyFeedback.classList.remove('hidden');
        setTimeout(() => {
            copyFeedback.classList.add('hidden');
        }, 2000);
    }
});
