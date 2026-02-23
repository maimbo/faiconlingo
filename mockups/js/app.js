/**
 * FaiconLingo Mockup Logic
 * Simulates the interactive experience of the app.
 */

document.addEventListener('DOMContentLoaded', () => {
    // === Variables ===
    let currentHeartCount = 5;
    let progressBarValue = 60; // Start at 60%
    let selectedWord = null;
    let isCorrect = false;

    // === Elements ===
    const wordBankButtons = document.querySelectorAll('.word-bank-btn');
    const answerSlot = document.querySelector('.answer-slot');
    const checkButton = document.getElementById('check-btn');
    const bottomSheet = document.getElementById('feedback-sheet');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackButton = document.getElementById('feedback-action-btn');
    const heartCountEl = document.getElementById('heart-count');
    const progressBar = document.getElementById('progress-bar-inner');

    // === Audio Placeholders (Non-functional in mockups but good for structure) ===
    const correctSound = new Audio('assets/correct.mp3'); // hypothetical
    const incorrectSound = new Audio('assets/incorrect.mp3'); // hypothetical

    // === Functions ===

    // 1. Word Selection
    if (wordBankButtons.length > 0) {
        wordBankButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // If already selected, deselect
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    selectedWord = null;
                    answerSlot.textContent = '_______';
                    answerSlot.classList.remove('filled');
                    checkButton.disabled = true;
                    checkButton.classList.remove('btn-primary');
                    checkButton.classList.add('btn-disabled');
                } else {
                    // Deselect others
                    wordBankButtons.forEach(b => b.classList.remove('selected'));

                    // Select this one
                    btn.classList.add('selected');
                    selectedWord = btn.getAttribute('data-word');

                    // Update Answer Slot
                    answerSlot.textContent = selectedWord;
                    answerSlot.classList.add('filled');

                    // Enable Check Button
                    checkButton.disabled = false;
                    checkButton.classList.remove('btn-disabled');
                    checkButton.classList.add('btn-primary');
                }
            });
        });
    }

    // 2. Check Answer
    if (checkButton) {
        checkButton.addEventListener('click', () => {
            if (!selectedWord) return;

            // Determine correctness (Hardcoded for "Buying Vegetables" lesson)
            // Correct answer expected is "shani" (Muli shani mukwai)
            isCorrect = (selectedWord.toLowerCase() === 'shani');

            showFeedback(isCorrect);
        });
    }

    // 3. Show Feedback Sheet
    function showFeedback(correct) {
        bottomSheet.classList.remove('hidden');
        bottomSheet.classList.add('visible');

        if (correct) {
            // Visuals
            bottomSheet.classList.add('sheet-correct');
            bottomSheet.classList.remove('sheet-incorrect');
            feedbackTitle.textContent = 'Nicely done!';
            feedbackTitle.style.color = '#58a700';
            feedbackButton.textContent = 'Continue';
            feedbackButton.classList.add('btn-correct');

            // Progress Bar
            progressBarValue += 10;
            if (progressBarValue > 100) progressBarValue = 100;
            progressBar.style.width = `${progressBarValue}%`;

            // Sound (simulated)
            console.log("Playing Correct Sound");

        } else {
            // Visuals
            bottomSheet.classList.add('sheet-incorrect');
            bottomSheet.classList.remove('sheet-correct');
            feedbackTitle.textContent = 'Correct answer:';
            feedbackTitle.style.color = '#ea2b2b';
            feedbackMessage.textContent = 'shani'; // The correct word
            feedbackMessage.style.display = 'block';
            feedbackButton.textContent = 'Got it';
            feedbackButton.classList.add('btn-incorrect');

            // Hearts
            if (currentHeartCount > 0) {
                currentHeartCount--;
                heartCountEl.textContent = currentHeartCount;
                heartCountEl.parentElement.classList.add('shake-animation');
                setTimeout(() => heartCountEl.parentElement.classList.remove('shake-animation'), 500);
            }

            // Sound (simulated)
            console.log("Playing Incorrect Sound");
        }
    }

    // 4. Continue / Reset
    if (feedbackButton) {
        feedbackButton.addEventListener('click', () => {
            bottomSheet.classList.remove('visible');
            bottomSheet.classList.add('hidden');

            if (isCorrect) {
                window.location.href = 'lesson_complete.html';
            }
        });
    }

});
