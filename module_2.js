document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration du Module ---
    const moduleId = 'module_2_interactions';
    const maxScoreEx1 = 2; 
    const maxScoreEx2 = 4; 
    const maxScoreEx3 = 8; 
    const totalMaxScore = maxScoreEx1 + maxScoreEx2 + maxScoreEx3;

    let currentScore = 0;

    // --- Références DOM ---
    const introductionSection = document.getElementById('introduction');
    const startExercisesBtn = document.getElementById('start-exercises');

    const exercise1Section = document.getElementById('exercise-1');
    const validateEx1Btn = document.getElementById('validate-ex1');
    const nextEx2Btn = document.getElementById('next-ex2-btn');
    const feedbackEx1 = document.getElementById('feedback-ex1');
    const qcmForm1 = document.getElementById('qcm-form-1');

    const exercise2Section = document.getElementById('exercise-2');
    const validateEx2Btn = document.getElementById('validate-ex2');
    const nextEx3Btn = document.getElementById('next-ex3-btn');
    const feedbackEx2 = document.getElementById('feedback-ex2');
    const commModesContainer = document.getElementById('comm-modes');
    const draggablesComm = document.querySelectorAll('.draggable-comm');
    const dropzonesComm = document.querySelectorAll('.dropzone-comm');

    const exercise3Section = document.getElementById('exercise-3');
    const validateEx3Btn = document.getElementById('validate-ex3');
    const feedbackEx3 = document.getElementById('feedback-ex3');
    const fillBlanksForm = document.getElementById('fill-in-blanks-form');
    const inputsEx3 = fillBlanksForm.querySelectorAll('input[type="text"]');

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

    // --- Logique Exercice 1 (QCM Multiple) ---
    const correctAnswersEx1Values = ['utilisateur', 'patient'];
    const possibleAnswersEx1 = ['utilisateur', 'patient', 'environnement'];

    validateEx1Btn.addEventListener('click', () => {
        const selectedCheckboxes = qcmForm1.querySelectorAll('input[name="q1"]:checked');
        let scoreEx1 = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.value);

        if (selectedValues.includes('utilisateur')) scoreEx1++;
        if (selectedValues.includes('patient')) scoreEx1++;

        selectedValues.forEach(value => {
            if (possibleAnswersEx1.includes(value)) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        // On ne décrémente plus currentScore ici, il est calculé à chaque fois ou ajouté.
        // Pour éviter les scores négatifs ou des calculs incorrects si l'utilisateur re-valide.
        // Le plus simple est de calculer le score de l'exercice à chaque validation
        // et de mettre à jour le score total.
        // Si on valide une seule fois, on peut simplement ajouter.
        // Ici, comme validateEx1Btn est désactivé, on ajoute.
        currentScore += scoreEx1; 

        feedbackEx1.innerHTML = `Les interactions principales sont avec <strong>l'utilisateur</strong> et le <strong>patient</strong>. L'interaction avec l'<strong>environnement</strong> (température, etc.) est aussi une contrainte importante.<br>
                                ${incorrectCount > 0 ? `<span class="emoji-incorrect">❌</span> Attention, ${incorrectCount} sélection(s) sont incorrectes ou moins directes.` : '<span class="emoji-correct">✔️</span> Vos choix principaux sont corrects.'}<br>
                                <strong>Score Exercice 1 : ${scoreEx1} / ${maxScoreEx1}</strong>`;
        feedbackEx1.className = 'feedback ' + (incorrectCount === 0 && scoreEx1 === maxScoreEx1 ? 'correct' : 'incorrect');
        
        validateEx1Btn.disabled = true;
        nextEx2Btn.classList.remove('hidden'); 
        
        qcmForm1.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.disabled = true);
    });

    nextEx2Btn.addEventListener('click', () => {
        showSection(exercise2Section);
        // Optionnel: cacher le conteneur des boutons de l'exo 1
        // const buttonContainerEx1 = validateEx1Btn.parentElement;
        // if (buttonContainerEx1) buttonContainerEx1.classList.add('hidden');
    });


    // --- Logique Exercice 2 (Drag & Drop Communication) ---
     const correctMatchesComm = {
        comm1: 'func1', 
        comm2: 'func2', 
        comm3: 'func3', 
        comm4: 'func4'  
    };

    draggablesComm.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropzonesComm.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
             const draggingElement = document.querySelector('.draggable-comm.dragging');
             const existingElement = zone.querySelector('.draggable-comm');

             if (!existingElement || existingElement === draggingElement) {
                 zone.classList.add('over');
                 e.dataTransfer.dropEffect = 'move';
             } else {
                  e.dataTransfer.dropEffect = 'none'; 
                  zone.classList.remove('over');
             }
        });
         zone.addEventListener('dragleave', () => {
            zone.classList.remove('over');
        });
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const draggableId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggableId);
            const targetZone = e.currentTarget;

            if (draggedElement && targetZone.classList.contains('dropzone-comm')) {
                 const existingDraggable = targetZone.querySelector('.draggable-comm');
                 if (existingDraggable) {
                      commModesContainer.appendChild(existingDraggable);
                 }
                targetZone.appendChild(draggedElement); 
            }
             targetZone.classList.remove('over');
        });
    });
     commModesContainer.addEventListener('dragover', (e) => {
          e.preventDefault();
          commModesContainer.classList.add('over');
          e.dataTransfer.dropEffect = 'move';
     });
      commModesContainer.addEventListener('dragleave', () => {
          commModesContainer.classList.remove('over');
     });
      commModesContainer.addEventListener('drop', (e) => {
          e.preventDefault();
          const draggableId = e.dataTransfer.getData('text/plain');
          const draggedElement = document.getElementById(draggableId);
          if (draggedElement) {
               commModesContainer.appendChild(draggedElement);
          }
           commModesContainer.classList.remove('over');
      });

    validateEx2Btn.addEventListener('click', () => {
        let scoreEx2 = 0;
        let feedbackHtml = 'Résultats :<br>';

         if (commModesContainer.querySelectorAll('.draggable-comm').length > 0) {
              feedbackEx2.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez associer tous les modes de communication à une fonction.';
              feedbackEx2.className = 'feedback incorrect';
              return;
         }

        dropzonesComm.forEach(zone => {
            const placedElement = zone.querySelector('.draggable-comm');
            if (placedElement) { 
                 const isCorrect = correctMatchesComm[placedElement.id] === zone.id;
                 if(isCorrect) scoreEx2++;
                 feedbackHtml += `- ${zone.querySelector('p strong').textContent.replace('Fonction :', '').trim()} : ${isCorrect ? '<span class="emoji-correct">✔️</span> Correct' : '<span class="emoji-incorrect">❌</span> Incorrect'} (${placedElement.textContent})<br>`;
            }
        });
        // Idem que pour exo 1, on ajoute le score de l'exo 2 au score total
        currentScore += scoreEx2;

        feedbackEx2.innerHTML = feedbackHtml + `<strong>Score Exercice 2 : ${scoreEx2} / ${maxScoreEx2}</strong>`;
        feedbackEx2.className = 'feedback ' + (scoreEx2 === maxScoreEx2 ? 'correct' : 'incorrect');
        
        validateEx2Btn.disabled = true;
        nextEx3Btn.classList.remove('hidden'); 
        
        document.querySelectorAll('.draggable-comm').forEach(d => d.setAttribute('draggable', 'false'));
        draggablesComm.forEach(d => d.style.cursor = 'default');
    });

    nextEx3Btn.addEventListener('click', () => {
        showSection(exercise3Section);
        // Optionnel: cacher le conteneur des boutons de l'exo 2
        // const buttonContainerEx2 = validateEx2Btn.parentElement;
        // if (buttonContainerEx2) buttonContainerEx2.classList.add('hidden');
    });


    // --- Logique Exercice 3 (Texte à trous) --- MODIFIÉE
    validateEx3Btn.addEventListener('click', () => {
        let scoreEx3 = 0;
        let allFilled = true;
        let firstAttempt = !validateEx3Btn.dataset.attempted; // Vérifie si c'est la première tentative

        if (firstAttempt) {
            validateEx3Btn.dataset.attempted = "true"; // Marque comme tenté
        }

        inputsEx3.forEach(input => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.dataset.answer.toLowerCase();

            if (userAnswer === '') {
                allFilled = false;
                input.classList.remove('correct-answer', 'incorrect-answer');
                if (firstAttempt) input.disabled = false; // Ne désactive pas si vide à la 1ère tentative
            } else if (userAnswer === correctAnswer) {
                scoreEx3++;
                input.classList.add('correct-answer');
                input.classList.remove('incorrect-answer');
                input.disabled = true; 
            } else {
                input.classList.add('incorrect-answer');
                input.classList.remove('correct-answer');
                input.value = correctAnswer; // MODIFIÉ: Affiche la bonne réponse
                input.disabled = true; // Désactive après avoir montré la correction
            }
        });

        if (!allFilled && firstAttempt) { // Si des champs sont vides à la première tentative
            feedbackEx3.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez remplir tous les trous.';
            feedbackEx3.className = 'feedback incorrect';
            // Permettre de re-valider UNIQUEMENT si c'était la première tentative et des champs étaient vides
            validateEx3Btn.disabled = false; 
        } else {
            // Si tout est rempli ou si ce n'est pas la première tentative (et donc on a déjà montré les corrections)
            if(firstAttempt) currentScore += scoreEx3; // Ajoute le score seulement à la première validation complète

            feedbackEx3.innerHTML = `Résultats : ${scoreEx3} mot(s) correctement placé(s). Les réponses incorrectes ont été corrigées.<br><strong>Score Exercice 3 : ${scoreEx3} / ${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (scoreEx3 === maxScoreEx3 ? 'correct' : 'incorrect');
            validateEx3Btn.disabled = true; // Désactive définitivement le bouton après la correction complète
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