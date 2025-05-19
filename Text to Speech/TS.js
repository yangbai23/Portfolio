let speech = new SpeechSynthesisUtterance();
let voices = [];
const voiceSelect = document.querySelector("select");
const synth = window.speechSynthesis;

// Helper to create human-friendly voice labels
function getVoiceLabel(voice) {
    if (voice.name.includes("Google")) {
        return `Google ${voice.lang === "en-US" ? "US English" : voice.lang}`;
    }
    if (voice.name.includes("Microsoft")) {
        return `Microsoft ${voice.lang}`;
    }
    return `${voice.lang}`; // Fallback to language code
}

// Populate voice dropdown
function populateVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";

    voices.forEach((voice, i) => {
        const optionText = getVoiceLabel(voice);
        voiceSelect.appendChild(new Option(optionText, i));
    });

    // Set default to English voice or first available
    speech.voice = voices.find(v => v.lang.startsWith("en")) || voices[0];
}

// Ensure voices load correctly
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}

// Get language code from selected voice
function getSelectedLanguage() {
    const selectedIndex = voiceSelect.value;
    return voices[selectedIndex].lang.split("-")[0]; // Extract "es" from "es-ES"
}

// Update voice when user changes dropdown
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Translate text using a translation API 
async function translateText(text, targetLang) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Translation Error:", error);
        alert("Error translating text.");
    }
}

// Handle speech output
document.querySelector("button").addEventListener("click", async () => {
    const text = document.querySelector("textarea").value.trim();

    if (!text) {
        alert("Please enter text to speak.");
        return;
    }

    const targetLanguage = getSelectedLanguage();

    // If the target language is English, skip translation
    const translatedText = targetLanguage === "en"
        ? text
        : await translateText(text, targetLanguage);

    if (translatedText) {
        speech.text = translatedText;
        synth.speak(speech);
    }
});