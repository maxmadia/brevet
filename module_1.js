document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration du Module ---
    const moduleId = 'module_1_usages';
    const maxScoreEx1 = 1;
    const maxScoreEx2 = 6; // 1 point par caractéristique
    const maxScoreEx3 = 4; // 1 point par affirmation
    const totalMaxScore = maxScoreEx1 + maxScoreEx2 + maxScoreEx3;

    let currentScore = 0;

    // --- Références DOM ---
    const introductionSection = document.getElementById('introduction');
    const startExercisesBtn = document.getElementById('start-exercises');

    const exercise1Section = document.getElementById('exercise-1');
    const validateEx1Btn = document.getElementById('validate-ex1');
    const feedbackEx1 = document.getElementById('feedback-ex1');
    const feedbackEx1Message = document.getElementById('feedback-ex1-message');
    const qcmForm1 = document.getElementById('qcm-form-1');
    const nextEx2Btn = document.getElementById('next-ex2-btn');

    const exercise2Section = document.getElementById('exercise-2');
    const validateEx2Btn = document.getElementById('validate-ex2');
    const feedbackEx2 = document.getElementById('feedback-ex2');
    const characteristicsContainer = document.getElementById('characteristics');
    const dropzoneManuel = document.getElementById('zone-manuel');
    const dropzoneDAE = document.getElementById('zone-dae');
    const draggables = document.querySelectorAll('.draggable');
    // NOUVELLE RÉFÉRENCE DOM pour le bouton "Passer à l'exercice 3"
    const nextEx3Btn = document.getElementById('next-ex3-btn');

    const exercise3Section = document.getElementById('exercise-3');
    const validateEx3Btn = document.getElementById('validate-ex3');
    const feedbackEx3 = document.getElementById('feedback-ex3');
    const trueFalseForm = document.getElementById('true-false-form');

    const moduleResultsDiv = document.getElementById('module-results');
    const moduleScoreSpan = document.getElementById('module-score');
    const moduleMaxScoreSpan = document.getElementById('module-max-score');
    const showLessonBtn = document.getElementById('show-lesson-btn');
    const microCoursArticle = document.getElementById('micro-cours');

    // --- Logique Introduction ---
    startExercisesBtn.addEventListener('click', () => {
        introductionSection.classList.add('hidden');
        showSection(exercise1Section);
    });

    // --- Logique Exercice 1 (QCM) ---
    validateEx1Btn.addEventListener('click', () => {
        const selectedAnswer = qcmForm1.querySelector('input[name="q1"]:checked');
        if (selectedAnswer) {
            const isCorrect = selectedAnswer.value === 'b';
            if (isCorrect) {
                currentScore += maxScoreEx1;
                feedbackEx1Message.innerHTML = '<span class="emoji-correct"✔️</span> Correct ! C\'est la fonction principale du DAE.';
                feedbackEx1Message.className = 'feedback correct'; // Applique le style au message
            } else {
                feedbackEx1Message.innerHTML = '<span class="emoji-incorrect">❌</span> Incorrect. La bonne réponse est la b). Le DAE analyse le rythme et peut délivrer un choc.';
                feedbackEx1Message.className = 'feedback incorrect'; // Applique le style au message
            }
            validateEx1Btn.disabled = true;
            qcmForm1.querySelectorAll('input[name="q1"]').forEach(radio => {
                radio.disabled = true;
            });
            feedbackEx1.classList.remove('hidden'); // Affiche le conteneur du feedback (qui contient le message)
            nextEx2Btn.classList.remove('hidden');
        } else {
            feedbackEx1Message.textContent = 'Veuillez sélectionner une réponse.';
            feedbackEx1Message.className = 'feedback incorrect'; // Applique le style au message
            feedbackEx1.classList.remove('hidden'); // Affiche le conteneur du feedback
        }
    });

    nextEx2Btn.addEventListener('click', () => {
        showSection(exercise2Section);
    });

    // --- Logique Exercice 2 (Drag & Drop) ---
    const correctMatches = {
        char1: 'zone-manuel', char4: 'zone-manuel', char6: 'zone-manuel',
        char2: 'zone-dae', char3: 'zone-dae', char5: 'zone-dae'
    };

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    [dropzoneManuel, dropzoneDAE, characteristicsContainer].forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('over');
            e.dataTransfer.dropEffect = 'move';
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('over');
        });
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const draggableId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggableId);
            const targetZone = e.currentTarget;

            if (draggedElement && (targetZone.classList.contains('dropzone') || targetZone.id === 'characteristics')) {
                targetZone.appendChild(draggedElement);
            }
            targetZone.classList.remove('over');
        });
    });

    validateEx2Btn.addEventListener('click', () => {
        let scoreEx2 = 0;
        let feedbackHtml = 'Résultats :<br>';

        if (characteristicsContainer.querySelectorAll('.draggable').length > 0) {
            feedbackEx2.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez placer toutes les caractéristiques dans les zones "Manuel" ou "DAE".';
            feedbackEx2.className = 'feedback incorrect';
            feedbackEx2.classList.remove('hidden'); // Afficher le feedback
            return;
        }

        const checkPlacement = (zone) => {
            Array.from(zone.children).forEach(el => {
                if (el.classList.contains('draggable')) {
                    const isCorrect = correctMatches[el.id] === zone.id;
                    if (isCorrect) scoreEx2++;
                    feedbackHtml += `- ${el.textContent}: ${isCorrect ? '<span class="emoji-correct">✔️</span> Correct' : '<span class="emoji-incorrect">❌</span> Incorrect'}<br>`;
                }
            });
        };

        checkPlacement(dropzoneManuel);
        checkPlacement(dropzoneDAE);

        currentScore += scoreEx2;
        feedbackEx2.innerHTML = feedbackHtml + `<strong>Score Exercice 2 : ${scoreEx2} / ${maxScoreEx2}</strong>`;
        feedbackEx2.className = 'feedback ' + (scoreEx2 === maxScoreEx2 ? 'correct' : 'incorrect');
        feedbackEx2.classList.remove('hidden'); // Afficher le feedback

        validateEx2Btn.disabled = true;
        document.querySelectorAll('.draggable').forEach(d => d.setAttribute('draggable', 'false'));
        draggables.forEach(d => d.style.cursor = 'default');
        
        nextEx3Btn.classList.remove('hidden'); // Afficher le bouton "Passer à l'exercice 3"
        // NE PAS appeler showSection(exercise3Section) ici
    });

    // NOUVEL ÉCOUTEUR D'ÉVÉNEMENT pour le bouton "Passer à l'exercice 3"
    nextEx3Btn.addEventListener('click', () => {
        showSection(exercise3Section);
    });

    // --- Logique Exercice 3 (Vrai/Faux) ---
    const correctAnswersEx3 = { q3_1: 'vrai', q3_2: 'faux', q3_3: 'vrai', q3_4: 'faux' };
    validateEx3Btn.addEventListener('click', () => {
        let scoreEx3 = 0;
        let feedbackHtml = 'Résultats :<br>';
        let allAnswered = true;

        for (const qName in correctAnswersEx3) {
            const selectedAnswer = trueFalseForm.querySelector(`input[name="${qName}"]:checked`);
            const statementElement = trueFalseForm.querySelector(`input[name="${qName}"]`).closest('.tf-statement').querySelector('p');

            if (selectedAnswer) {
                const isCorrect = selectedAnswer.value === correctAnswersEx3[qName];
                if (isCorrect) scoreEx3++;
                feedbackHtml += `- ${statementElement.textContent}: ${isCorrect ? '<span class="emoji-correct">✔️</span> Correct' : '<span class="emoji-incorrect">❌</span> Incorrect'}<br>`;
                trueFalseForm.querySelectorAll(`input[name="${qName}"]`).forEach(radio => radio.disabled = true);
            } else {
                allAnswered = false;
                feedbackHtml += `- ${statementElement.textContent}: <span class="emoji-incorrect">⚠️</span> Non répondu<br>`;
            }
        }

        feedbackEx3.classList.remove('hidden'); // Toujours afficher le feedback
        if (!allAnswered) {
            feedbackEx3.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez répondre à toutes les affirmations.<br>' + feedbackHtml;
            feedbackEx3.className = 'feedback incorrect';
        } else {
            currentScore += scoreEx3;
            feedbackEx3.innerHTML = feedbackHtml + `<strong>Score Exercice 3 : ${scoreEx3} / ${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (scoreEx3 === maxScoreEx3 ? 'correct' : 'incorrect');
            validateEx3Btn.disabled = true;
            displayModuleResults();
        }
    });

    // --- Affichage Séquentiel & Fin de Module ---
    function showSection(sectionToShow) {
        exercise1Section.classList.add('hidden');
        exercise2Section.classList.add('hidden');
        exercise3Section.classList.add('hidden');
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
    }

    function displayModuleResults() {
        moduleScoreSpan.textContent = currentScore;
        moduleMaxScoreSpan.textContent = totalMaxScore;
        moduleResultsDiv.classList.remove('hidden');
        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
            console.error("La fonction enregistrerScore n'est pas définie. Inclure notation.js.");
        }
    }

    // --- Affichage Leçon ---
    showLessonBtn.addEventListener('click', () => {
        microCoursArticle.classList.toggle('hidden');
        showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
    });

    // --- Initialisation ---
    showSection(null);
    if (feedbackEx1) feedbackEx1.classList.add('hidden'); // Assure que le conteneur de feedback ex1 est caché
    if (feedbackEx2) feedbackEx2.classList.add('hidden'); // Assure que le conteneur de feedback ex2 est caché
    if (feedbackEx3) feedbackEx3.classList.add('hidden'); // Assure que le conteneur de feedback ex3 est caché
    // Les boutons "next" sont déjà cachés par la classe "hidden" dans le HTML

    // --- Ajout Emojis ---
    if (!document.getElementById('emoji-styles')) {
        const style = document.createElement('style');
        style.id = 'emoji-styles';
        style.innerHTML = `
            .emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }
            .emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }
        `;
        document.head.appendChild(style);
    }
});