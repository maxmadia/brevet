document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration du Module ---
    const moduleId = 'module_3_choix';
    const maxScoreEx1 = 1;
    const maxScoreEx2 = 9; // 1 point par bonne réponse
    const maxScoreEx3 = 4;
    const totalMaxScore = maxScoreEx1 + maxScoreEx2 + maxScoreEx3;

    let scoreEx1 = 0; // Scores spécifiques aux exercices
    let scoreEx2 = 0;
    let scoreEx3 = 0;
    // currentScore sera calculé à la fin dans displayModuleResults

    // --- Références DOM ---
    const introductionSection = document.getElementById('introduction');
    const startExercisesBtn = document.getElementById('start-exercises');
    
    const exercise1Section = document.getElementById('exercise-1');
    const validateEx1Btn = document.getElementById('validate-ex1');
    const nextEx2Btn = document.getElementById('next-ex2'); // Nouveau bouton
    const feedbackEx1 = document.getElementById('feedback-ex1');
    const qcmForm1 = document.getElementById('qcm-form-1');

    const exercise2Section = document.getElementById('exercise-2');
    const validateEx2Btn = document.getElementById('validate-ex2');
    const feedbackEx2 = document.getElementById('feedback-ex2');
    const tableForm2 = document.getElementById('table-form-2');
    const radioGroupsEx2 = [
        'q2_fab_eco','q2_fab_econ','q2_fab_soc',
        'q2_use_eco','q2_use_econ','q2_use_soc',
        'q2_end_eco','q2_end_econ','q2_end_soc'
    ];
    let validatedEx2 = false; // Suivi de la validation complète de l'ex 2

    const exercise3Section = document.getElementById('exercise-3');
    const validateEx3Btn = document.getElementById('validate-ex3');
    const feedbackEx3 = document.getElementById('feedback-ex3');
    const rankingList = document.getElementById('ranking-list'); // Cible UL
    let draggedItemEx3 = null; // Élément LI en cours de déplacement
    let validatedEx3 = false; // Suivi validation Ex3

    const moduleResultsDiv = document.getElementById('module-results');
    const moduleScoreSpan = document.getElementById('module-score');
    const moduleMaxScoreSpan = document.getElementById('module-max-score');
    const showLessonBtn = document.getElementById('show-lesson-btn');
    const microCoursArticle = document.getElementById('micro-cours');

    // Récupérer ou créer le bouton nextEx3Btn (pour passer de l'exercice 2 à 3)
    let nextEx3Btn = document.getElementById('next-ex3');
    if (exercise2Section && !nextEx3Btn && validateEx2Btn) { // Assurer que validateEx2Btn existe
         nextEx3Btn = document.createElement('button');
         nextEx3Btn.id = 'next-ex3';
         nextEx3Btn.textContent = "Passer à l'exercice 3";
         nextEx3Btn.classList.add('hidden'); // Caché par défaut
         nextEx3Btn.style.marginLeft = "10px";
         validateEx2Btn.insertAdjacentElement('afterend', nextEx3Btn);
     }


    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
         // Cacher toutes les sections potentiellement visibles (intro + exos)
         [introductionSection, exercise1Section, exercise2Section, exercise3Section]
             .forEach(s => {
                  if(s) s.classList.add('hidden'); // Cache si l'élément existe
             });
         // Afficher la section demandée si elle existe
         if(sectionToShow) {
             sectionToShow.classList.remove('hidden');
         }
     }

    function displayModuleResults() {
         // Calculer le score total final pour ce module au moment de l'affichage
         let currentScore = scoreEx1 + scoreEx2 + scoreEx3;

        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        moduleResultsDiv?.classList.remove('hidden');

        // Enregistrement dans localStorage
        if (typeof enregistrerScore === 'function') {
             enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
             console.error("Fonction enregistrerScore non trouvée.");
        }
    }


    // --- Logique Introduction ---
    if (startExercisesBtn && introductionSection && exercise1Section) {
        startExercisesBtn.addEventListener('click', () => {
            introductionSection.classList.add('hidden');
            showSection(exercise1Section);
        });
    } else {
        console.error("Élément(s) manquant(s) pour l'introduction/démarrage.", {startExercisesBtn, introductionSection, exercise1Section});
         if(!introductionSection || !startExercisesBtn) {
              showSection(exercise1Section); // Affiche exo 1 si intro/bouton manque
         }
    }

    // --- Logique Exercice 1 ---
    validateEx1Btn?.addEventListener('click', () => {
        const sel = qcmForm1?.querySelector('input[name="q1"]:checked');
        if (sel) {
            const ok = sel.value === 'b';
            scoreEx1 = ok ? maxScoreEx1 : 0; // Met à jour le score Ex1
            if (feedbackEx1) {
                 feedbackEx1.innerHTML = ok ? '<span class="emoji-correct">✔️</span> Correct ! La fiabilité...' : '<span class="emoji-incorrect">❌</span> Incorrect. La fiabilité (b)...';
                 feedbackEx1.className = 'feedback ' + (ok ? 'correct' : 'incorrect');
            }
            validateEx1Btn.disabled = true;
            qcmForm1?.querySelectorAll('input[name="q1"]').forEach(r => r.disabled = true);
            
            // Afficher le bouton "Passer à l'exercice 2"
            if (nextEx2Btn) {
                nextEx2Btn.classList.remove('hidden');
            }
            // Ne pas afficher l'exercice 2 automatiquement ici
            // showSection(exercise2Section); // Ligne supprimée
        } else {
            if (feedbackEx1) {
                feedbackEx1.textContent = 'Veuillez sélectionner une réponse.';
                feedbackEx1.className = 'feedback incorrect';
            }
        }
    });

    // Nouveau: Listener pour le bouton "Passer à l'exercice 2"
    nextEx2Btn?.addEventListener('click', () => {
        showSection(exercise2Section);
        // Optionnel: cacher ce bouton s'il ne doit servir qu'une fois
        // nextEx2Btn.classList.add('hidden'); 
    });


    // --- Logique Exercice 2 ---
     validateEx2Btn?.addEventListener('click', () => {
        let currentAttemptScoreEx2 = 0;
        let feedbackHtml = 'Résultats par enjeu :<br>';
        let allAnswered = true;
        let isPerfect = true;

        // 1. Vérifier si tout est répondu
        radioGroupsEx2.forEach(groupName => {
            const selectedRadio = tableForm2?.querySelector(`input[name="${groupName}"]:checked`);
            if (!selectedRadio) { allAnswered = false; }
            if (!validatedEx2) {
                 tableForm2?.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    const label = radio.closest('label');
                    if(label) { label.style.backgroundColor = 'transparent'; label.style.fontWeight = 'normal'; label.style.outline = 'none'; }
                    radio.disabled = false;
                });
            }
        });

        if (!allAnswered) {
            if(feedbackEx2) {
                feedbackEx2.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez répondre à toutes les questions avant de valider.';
                feedbackEx2.className = 'feedback incorrect';
            }
            nextEx3Btn?.classList.add('hidden'); 
            return;
        }

        radioGroupsEx2.forEach(groupName => {
             const selectedRadio = tableForm2.querySelector(`input[name="${groupName}"]:checked`);
             const radiosInGroup = tableForm2.querySelectorAll(`input[name="${groupName}"]`);
             const trElement = selectedRadio.closest('tr');
             const groupLabelElement = selectedRadio.closest('td');
             const thElement = groupLabelElement?.closest('table')?.querySelector(`thead th:nth-of-type(${groupLabelElement.cellIndex + 1})`);
             const rowLabel = trElement?.querySelector('td:first-child strong')?.textContent ?? 'Inconnu';
             const colLabel = thElement?.textContent ?? 'Inconnu';
             const correctAnswerRadio = trElement?.querySelector(`input[name='${groupName}'][data-correct='true']`);
             const correctAnswerLabel = correctAnswerRadio?.closest('label')?.textContent.trim() ?? "N/A";

             const isCorrect = selectedRadio.dataset.correct === 'true';
             if (isCorrect) {
                 currentAttemptScoreEx2++;
                 feedbackHtml += `- <strong>${rowLabel} / ${colLabel} :</strong> <span class="emoji-correct">✔️</span> Correct (${selectedRadio.closest('label').textContent.trim()})<br>`;
                 selectedRadio.closest('label').style.backgroundColor = '#d1e7dd';
                 selectedRadio.closest('label').style.fontWeight = 'bold';
             } else {
                 isPerfect = false;
                 feedbackHtml += `- <strong>${rowLabel} / ${colLabel} :</strong> <span class="emoji-incorrect">❌</span> Incorrect (${selectedRadio.closest('label').textContent.trim()}). La bonne réponse était "${correctAnswerLabel}"<br>`;
                 selectedRadio.closest('label').style.backgroundColor = '#f8d7da';
                 if(correctAnswerRadio?.closest('label')) {
                      correctAnswerRadio.closest('label').style.backgroundColor = '#d1e7dd';
                      correctAnswerRadio.closest('label').style.fontWeight = 'bold';
                 }
             }
             radiosInGroup.forEach(radio => radio.disabled = true);
        });

        if (!validatedEx2) {
            scoreEx2 = currentAttemptScoreEx2;
            validatedEx2 = true;
        }

        if (feedbackEx2) {
            feedbackEx2.innerHTML = feedbackHtml + `<strong>Score Exercice 2 : ${scoreEx2} / ${maxScoreEx2}</strong>`;
            feedbackEx2.className = 'feedback ' + (isPerfect ? 'correct' : 'incorrect');
        }
        validateEx2Btn.disabled = true;
        nextEx3Btn?.classList.remove('hidden');
    });

     nextEx3Btn?.addEventListener('click', () => {
        showSection(exercise3Section);
        if(nextEx3Btn) nextEx3Btn.classList.add('hidden');
    });


    // --- Logique Exercice 3 (Ordonnancement Drag & Drop) ---

    function getDragAfterElementEx3(container, y) {
         const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
         return draggableElements.reduce((closest, child) => {
             const box = child.getBoundingClientRect();
             const offset = y - box.top - box.height / 2;
             if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; }
             else { return closest; }
         }, { offset: Number.NEGATIVE_INFINITY }).element;
     }

    function handleDragStartEx3(e) {
        draggedItemEx3 = e.target.closest('li');
        if(draggedItemEx3 && draggedItemEx3.getAttribute('draggable') === 'true') {
            setTimeout(() => { if(draggedItemEx3) draggedItemEx3.classList.add('dragging'); }, 0);
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', draggedItemEx3.dataset.rankId || 'item'); } catch(err) {}
        } else {
            e.preventDefault(); 
        }
    }

    function handleDragEndEx3() {
        if (draggedItemEx3) { draggedItemEx3.classList.remove('dragging'); }
        draggedItemEx3 = null; 
    }

    function handleDragOverEx3(e) {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move';

        const container = rankingList;
        const currentDragging = draggedItemEx3; 
        if (!currentDragging) return; 

        const afterElement = getDragAfterElementEx3(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(currentDragging);
        } else {
            if (afterElement !== currentDragging) {
                 container.insertBefore(currentDragging, afterElement);
            }
        }
    }

    function addDragListenersEx3() {
        const items = rankingList?.querySelectorAll('li');
        if (!items) return;
        items.forEach(item => {
            item.setAttribute('draggable', 'true');
            item.style.cursor = 'grab';
            const handle = item.querySelector('.rank-handle');
            if (handle) handle.style.cursor = 'grab';
            item.removeEventListener('dragstart', handleDragStartEx3);
            item.removeEventListener('dragend', handleDragEndEx3);
            item.addEventListener('dragstart', handleDragStartEx3);
            item.addEventListener('dragend', handleDragEndEx3);
        });
        rankingList.removeEventListener('dragover', handleDragOverEx3);
        rankingList.addEventListener('dragover', handleDragOverEx3);
    }

    function removeDragListenersEx3() {
        const items = rankingList?.querySelectorAll('li');
        if (!items) return;
        items.forEach(item => {
            item.setAttribute('draggable', 'false');
            item.style.cursor = 'default';
            const handle = item.querySelector('.rank-handle');
            if (handle) handle.style.cursor = 'default';
            item.removeEventListener('dragstart', handleDragStartEx3);
            item.removeEventListener('dragend', handleDragEndEx3);
        });
        rankingList?.removeEventListener('dragover', handleDragOverEx3);
    }

    if (rankingList) { addDragListenersEx3(); }
    else { console.error("Element #ranking-list non trouvé pour Ex3"); }


    const correctOrderEx3 = ['fiabilite', 'facilite', 'autonomie', 'cout', 'design'];

    validateEx3Btn?.addEventListener('click', () => {
        if (!rankingList) return;

        let scoreEx3Calculated = 0;
        const currentOrderIds = [...rankingList.querySelectorAll('li')].map(li => li.dataset.rankId);

        if (currentOrderIds.length !== correctOrderEx3.length) { return; }

        if (currentOrderIds[0] === 'fiabilite') scoreEx3Calculated += 2;
        if (currentOrderIds[1] === 'facilite') scoreEx3Calculated += 1;
        if (currentOrderIds[currentOrderIds.length - 1] === 'design') scoreEx3Calculated += 1;

        if (!validatedEx3) {
            scoreEx3 = scoreEx3Calculated;
            validatedEx3 = true;
        }

        const isPerfect = scoreEx3 === maxScoreEx3;

        if (feedbackEx3) { 
            feedbackEx3.innerHTML = `Votre classement a été évalué.<br> L'ordre généralement admis est : <strong>Fiabilité > Facilité > Autonomie > Coût > Design</strong>.<br> <strong>Score Exercice 3 : ${scoreEx3} / ${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (isPerfect ? 'correct' : 'incorrect');
        }
        validateEx3Btn.disabled = true;
        removeDragListenersEx3(); 
        displayModuleResults();
    });


    // --- Affichage Leçon ---
     showLessonBtn?.addEventListener('click', () => {
        if (microCoursArticle) {
             microCoursArticle.classList.toggle('hidden');
             showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
        }
    });

    // --- Initialisation ---
    showSection(introductionSection); 

     if (!document.getElementById('emoji-styles') && typeof document.styleSheets !== 'undefined' && document.styleSheets.length > 0) {
         const styleSheet = document.styleSheets[0];
          try {
             styleSheet.insertRule('.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }', styleSheet.cssRules.length);
             styleSheet.insertRule('.emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }', styleSheet.cssRules.length);
          } catch (e) {
              console.warn("Impossible d'insérer les règles CSS pour les emojis via insertRule: ", e);
               const style = document.createElement('style'); style.id = 'emoji-styles';
               style.innerHTML = `.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; } .emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }`;
               document.head.appendChild(style);
          }
      } else if (!document.getElementById('emoji-styles')) {
           const style = document.createElement('style'); style.id = 'emoji-styles';
           style.innerHTML = `.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; } .emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }`;
           document.head.appendChild(style);
      }

}); // Fin DOMContentLoaded