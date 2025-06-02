document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 7 ---");

    // --- Configuration et Références DOM (inchangées) ---
    const moduleId = 'module_7_algorithmique';
    const maxScoreEx1 = 5, maxScoreEx2 = 3, maxScoreEx3 = 1;
    const totalMaxScore = maxScoreEx1 + maxScoreEx2 + maxScoreEx3;
    let scoreEx1 = 0, scoreEx2 = 0, scoreEx3 = 0;

    const introductionSection = document.getElementById('introduction');
    const startExercisesBtn = document.getElementById('start-exercises');
    const exercise1Section = document.getElementById('exercise-1');
    const exercise2Section = document.getElementById('exercise-2');
    const exercise3Section = document.getElementById('exercise-3');
    const moduleResultsDiv = document.getElementById('module-results');
    const showLessonBtn = document.getElementById('show-lesson-btn');
    const microCoursArticle = document.getElementById('micro-cours');
    const moduleScoreSpan = document.getElementById('module-score');
    const moduleMaxScoreSpan = document.getElementById('module-max-score');

    // Ex1
    let validateEx1Btn, feedbackEx1, algoStepList, draggedAlgoItem = null, nextEx2BtnAlgo;
    // Ex2
    let validateEx2Btn, feedbackEx2, conditionsForm, nextEx3BtnAlgo;
    // Ex3
    let validateEx3Btn, feedbackEx3, qcmCodeForm;


    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv, microCoursArticle]
            .forEach(s => { if(s) s.classList.add('hidden'); });
        sectionToShow?.classList.remove('hidden');

        // Gérer spécifiquement la visibilité du bouton "Voir la leçon"
        // Il ne doit être visible qu'avec le bloc de résultats
        if (sectionToShow === moduleResultsDiv) {
            showLessonBtn?.classList.remove('hidden');
        } else {
            showLessonBtn?.classList.add('hidden');
        }
    }

    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod7: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        
        showSection(moduleResultsDiv); // Appelle showSection qui gère la visibilité du bouton leçon
        
        // S'assurer que la leçon est cachée par défaut lors de l'affichage des résultats
        microCoursArticle?.classList.add('hidden');
        if(showLessonBtn) showLessonBtn.textContent = "Voir la leçon";

        if (typeof enregistrerScore === 'function') { enregistrerScore(moduleId, currentScore, totalMaxScore); }
        else { console.error("Fonction enregistrerScore non trouvée."); }
    }

    // --- Initialisation Différée ---
    function initExercise1() { /* ... (comme avant) ... */ }
    function initExercise2() { /* ... (comme avant) ... */ }
    function initExercise3() {
        console.log("Init Ex3 Mod7 (Blocs QCM)");
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        qcmCodeForm = document.getElementById('qcm-code-form');
        scoreEx3 = 0; // Reset score Ex3

        qcmCodeForm?.reset();
        qcmCodeForm?.querySelectorAll('input[type="radio"]').forEach(r => {
            r.disabled = false;
            const label = r.closest('label');
            if(label) {
                label.classList.remove('correct-answer', 'incorrect-answer'); // Utiliser classes plutôt que style direct
                label.style.backgroundColor=''; // S'assurer de nettoyer aussi les styles inline au cas où
                label.style.fontWeight='';
            }
        });
        if(feedbackEx3) { feedbackEx3.innerHTML = ''; feedbackEx3.className = 'feedback';}
        if(validateEx3Btn) {
            validateEx3Btn.disabled = false;
            validateEx3Btn.removeEventListener('click', handleValidateEx3Algo);
            validateEx3Btn.addEventListener('click', handleValidateEx3Algo);
        }
        // **CORRECTION : Ne PAS cacher moduleResultsDiv, showLessonBtn ou microCoursArticle ici.**
        // Leur visibilité est gérée par showSection et displayModuleResults.
    }
    // (Copier/Coller les initExercise1 et initExercise2 de la réponse précédente)
     function initExercise1() { console.log("Init Ex1 Mod7 (Ordonnancement Algo)"); validateEx1Btn = document.getElementById('validate-ex1'); feedbackEx1 = document.getElementById('feedback-ex1'); algoStepList = document.getElementById('algo-step-list'); draggedAlgoItem = null; scoreEx1 = 0; if (algoStepList) { for (let i = algoStepList.children.length; i >= 0; i--) { algoStepList.appendChild(algoStepList.children[Math.random() * i | 0]); } Array.from(algoStepList.children).forEach(li => { li.classList.remove('correct-step', 'incorrect-step', 'dragging'); li.setAttribute('draggable', 'true'); li.style.cursor = 'grab'; }); } if(feedbackEx1) { feedbackEx1.innerHTML = ''; feedbackEx1.className = 'feedback';} if(validateEx1Btn) { validateEx1Btn.disabled = false; validateEx1Btn.removeEventListener('click', handleValidateEx1Algo); validateEx1Btn.addEventListener('click', handleValidateEx1Algo); } addDragListenersEx1Algo(); if (nextEx2BtnAlgo) nextEx2BtnAlgo.classList.add('hidden'); }
     function initExercise2() { console.log("Init Ex2 Mod7 (Conditions QCM)"); validateEx2Btn = document.getElementById('validate-ex2'); feedbackEx2 = document.getElementById('feedback-ex2'); conditionsForm = document.getElementById('conditions-form'); scoreEx2 = 0; conditionsForm?.reset(); conditionsForm?.querySelectorAll('input[type="radio"]').forEach(r => { r.disabled = false; const label = r.closest('label'); if(label) label.classList.remove('correct-answer', 'incorrect-answer'); }); if(feedbackEx2) { feedbackEx2.innerHTML = ''; feedbackEx2.className = 'feedback';} if(validateEx2Btn) { validateEx2Btn.disabled = false; validateEx2Btn.removeEventListener('click', handleValidateEx2Algo); validateEx2Btn.addEventListener('click', handleValidateEx2Algo); } if (!nextEx3BtnAlgo && exercise2Section && validateEx2Btn) { nextEx3BtnAlgo = document.createElement('button'); nextEx3BtnAlgo.id = 'next-ex3-algo'; nextEx3BtnAlgo.textContent = "Passer à l'exercice 3"; nextEx3BtnAlgo.classList.add('hidden'); nextEx3BtnAlgo.style.marginLeft="10px"; validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnAlgo); nextEx3BtnAlgo.removeEventListener('click', handleNextEx3ClickAlgo); nextEx3BtnAlgo.addEventListener('click', handleNextEx3ClickAlgo); } if (nextEx3BtnAlgo) nextEx3BtnAlgo.classList.add('hidden'); }


    // --- Handlers pour boutons Start et Next ---
    function handleStartClick() { /* ... (inchangé) ... */ }
    function handleNextEx2ClickAlgo() { /* ... (inchangé) ... */ }
    function handleNextEx3ClickAlgo() { /* ... (inchangé) ... */ }
    // (Copier/Coller les handlers de la réponse précédente)
    function handleStartClick() { if (startExercisesBtn) startExercisesBtn.disabled = true; introductionSection?.classList.add('hidden'); showSection(exercise1Section); initExercise1(); }
    function handleNextEx2ClickAlgo() { if (nextEx2BtnAlgo) nextEx2BtnAlgo.classList.add('hidden'); showSection(exercise2Section); initExercise2(); }
    function handleNextEx3ClickAlgo() { if (nextEx3BtnAlgo) nextEx3BtnAlgo.classList.add('hidden'); showSection(exercise3Section); initExercise3(); }


    // --- Logique Exercice 1 : Ordonnancement Algo ---
    // (Fonctions D&D et Validation Ex1 inchangées)
    function getDragAfterElementAlgo(container, y) { /* ... */ }
    function handleAlgoDragStart(e) { /* ... */ }
    function handleAlgoDragEnd() { /* ... */ }
    function handleAlgoDragOver(e) { /* ... */ }
    function addDragListenersEx1Algo() { /* ... */ }
    function removeDragListenersEx1Algo() { /* ... */ }
    function handleValidateEx1Algo() { /* ... (appelle initExercise2 via nextEx2BtnAlgo) ... */ }
    // (Copier/Coller les définitions Ex1 de la réponse précédente)
    function getDragAfterElementAlgo(container, y) { const draggables = [...container.querySelectorAll('li:not(.dragging)')]; return draggables.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; } }, { offset: Number.NEGATIVE_INFINITY }).element; }
    function handleAlgoDragStart(e) { draggedAlgoItem = e.target.closest('li'); if(draggedAlgoItem && draggedAlgoItem.getAttribute('draggable') === 'true') { setTimeout(() => { if(draggedAlgoItem) draggedAlgoItem.classList.add('dragging'); }, 0); e.dataTransfer.effectAllowed = 'move'; try{e.dataTransfer.setData('text/plain', draggedAlgoItem.dataset.stepId || 'step');}catch(e){} } else {e.preventDefault();} }
    function handleAlgoDragEnd() { if(draggedAlgoItem) draggedAlgoItem.classList.remove('dragging'); draggedAlgoItem = null; }
    function handleAlgoDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; const container = algoStepList; const afterElement = getDragAfterElementAlgo(container, e.clientY); if (draggedAlgoItem) { if (afterElement == null) { container.appendChild(draggedAlgoItem); } else { if (afterElement !== draggedAlgoItem) container.insertBefore(draggedAlgoItem, afterElement); } } }
    function addDragListenersEx1Algo() { const items = algoStepList?.querySelectorAll('li'); if(!items) return; items.forEach(item => { item.setAttribute('draggable','true'); item.style.cursor='grab'; item.removeEventListener('dragstart', handleAlgoDragStart); item.addEventListener('dragstart', handleAlgoDragStart); item.removeEventListener('dragend', handleAlgoDragEnd); item.addEventListener('dragend', handleAlgoDragEnd); }); if(algoStepList) { algoStepList.removeEventListener('dragover', handleAlgoDragOver); algoStepList.addEventListener('dragover', handleAlgoDragOver); } console.log("Listeners D&D Ex1 Algo activés.");}
    function removeDragListenersEx1Algo() { const items = algoStepList?.querySelectorAll('li'); if(!items) return; items.forEach(item => { item.setAttribute('draggable','false'); item.style.cursor='default'; item.removeEventListener('dragstart', handleAlgoDragStart); item.removeEventListener('dragend', handleAlgoDragEnd); }); if(algoStepList) algoStepList.removeEventListener('dragover', handleAlgoDragOver); console.log("Listeners D&D Ex1 Algo désactivés."); }
    function handleValidateEx1Algo() { scoreEx1 = 0; let feedback = "Résultats Ex 1:<br>"; let perfect = true; const correctOrder = ["analyse", "decision", "charge", "choc", "guide_rcp"]; const userOrder = algoStepList ? [...algoStepList.querySelectorAll('li')].map(li => li.dataset.stepId) : []; if(userOrder.length !== correctOrder.length) { if(feedbackEx1) {feedbackEx1.innerHTML = "⚠️ Erreur."; feedbackEx1.className="feedback incorrect";} return; } userOrder.forEach((stepId, index) => { const liElement = algoStepList.querySelector(`li[data-step-id="${stepId}"]`); if (stepId === correctOrder[index]) { scoreEx1++; liElement?.classList.add('correct-step'); } else { perfect = false; liElement?.classList.add('incorrect-step'); } feedback += `Étape ${index + 1} (${liElement?.textContent.substring(0,20)}...): ${stepId === correctOrder[index] ? '✔️':'❌'}<br>`; }); if(feedbackEx1) { feedbackEx1.innerHTML = feedback + `<strong>Score: ${scoreEx1}/${maxScoreEx1}</strong>`; feedbackEx1.className = 'feedback '+(perfect ? 'correct':'incorrect'); } validateEx1Btn.disabled = true; removeDragListenersEx1Algo(); if (!nextEx2BtnAlgo && exercise1Section && validateEx1Btn) { nextEx2BtnAlgo = document.createElement('button'); nextEx2BtnAlgo.id = 'next-ex2-algo'; nextEx2BtnAlgo.textContent = "Passer à l'exercice 2"; nextEx2BtnAlgo.style.marginLeft="10px"; validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnAlgo); nextEx2BtnAlgo.removeEventListener('click', handleNextEx2ClickAlgo); nextEx2BtnAlgo.addEventListener('click', handleNextEx2ClickAlgo); } nextEx2BtnAlgo?.classList.remove('hidden'); }


    // --- Logique Exercice 2 : Conditions QCM ---
    function handleValidateEx2Algo() { /* ... (appelle initExercise3 via nextEx3BtnAlgo) ... */ }
    // (Copier/Coller définition Ex2 ici)
    function handleValidateEx2Algo() { scoreEx2 = 0; let perfect = true; let feedback = "Résultats Ex 2:<br>"; let allAnswered = true; const qNames = ["cond1", "cond2", "cond3"]; qNames.forEach(name => { if(!conditionsForm?.querySelector(`input[name="${name}"]:checked`)) allAnswered = false; conditionsForm?.querySelectorAll(`input[name="${name}"]`).forEach(r => r.closest('label')?.classList.remove('correct-answer','incorrect-answer')); }); if(!allAnswered){ if(feedbackEx2){feedbackEx2.innerHTML = "⚠️ Veuillez répondre à toutes les questions."; feedbackEx2.className="feedback incorrect";} return;} qNames.forEach((name, index) => { const selected = conditionsForm.querySelector(`input[name="${name}"]:checked`); const isOk = selected.dataset.correct === 'true'; const selectedLabel = selected.closest('label'); const correctRadio = conditionsForm.querySelector(`input[name="${name}"][data-correct="true"]`); const correctLabelText = correctRadio?.closest('label')?.textContent ?? "?"; if(isOk) { scoreEx2++; selectedLabel?.classList.add('correct-answer'); } else { perfect = false; selectedLabel?.classList.add('incorrect-answer'); correctRadio?.closest('label')?.classList.add('correct-answer');} feedback += `Question ${index+1}: ${isOk ? '✔️ Correct':'❌ Incorrect'} ${!isOk ? `(Rép: ${correctLabelText})`:''}<br>`; conditionsForm.querySelectorAll(`input[name="${name}"]`).forEach(r => r.disabled = true); }); if(feedbackEx2){feedbackEx2.innerHTML = feedback + `<strong>Score: ${scoreEx2}/${maxScoreEx2}</strong>`; feedbackEx2.className = 'feedback '+(perfect?'correct':'incorrect');} validateEx2Btn.disabled = true; nextEx3BtnAlgo?.classList.remove('hidden'); }


  // --- Logique Exercice 3 : Blocs QCM ---
    function handleValidateEx3Algo() {
        console.log("Validation Ex3 Algo"); // DEBUG
        scoreEx3 = 0;
        let perfect = true; // Changé de allOk pour cohérence
        let feedbackHtml = "Résultats Ex 3:<br>"; // Renommé pour clarté
        let allAnswered = true;
        const selected = qcmCodeForm?.querySelector('input[name="q_code"]:checked');

        // Vérifier si répondu
        if (!selected) {
            allAnswered = false;
            if (feedbackEx3) {
                feedbackEx3.innerHTML = "⚠️ Veuillez choisir une réponse.";
                feedbackEx3.className = "feedback incorrect";
            }
            return; // Arrêter si pas répondu
        }

        // Correction
        const isOk = selected.dataset.correct === 'true';
        const selectedLabel = selected.closest('label');
        const correctRadio = qcmCodeForm.querySelector('input[name="q_code"][data-correct="true"]');
        const correctLabelText = correctRadio?.closest('label')?.textContent ?? "?";

        if (isOk) {
            scoreEx3++;
            if(selectedLabel) selectedLabel.classList.add('correct-answer');
        } else {
            perfect = false;
            if(selectedLabel) selectedLabel.classList.add('incorrect-answer');
            if(correctRadio?.closest('label')) correctRadio.closest('label').classList.add('correct-answer'); // Montrer la bonne
        }
        feedbackHtml += `Réponse: ${isOk ? '<span class="emoji-correct">✔️</span> Correct':'<span class="emoji-incorrect">❌</span> Incorrect'} ${!isOk ? `(Réponse attendue: ${correctLabelText})`:''}<br>`;
        qcmCodeForm.querySelectorAll('input[name="q_code"]').forEach(r => r.disabled = true);

        if (feedbackEx3) {
            feedbackEx3.innerHTML = feedbackHtml + `<strong>Score: ${scoreEx3}/${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (perfect ? 'correct' : 'incorrect');
        }
        validateEx3Btn.disabled = true;

        // Appel à displayModuleResults MAINTENANT que l'exercice 3 est validé
        displayModuleResults(); // Afficher résultats finaux et le bouton leçon
    }


    // --- Fonction displayModuleResults - Ajustée ---
    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod7: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;

        // S'assurer que l'exercice 3 (et son feedback) restent visibles
        // showSection(exercise3Section); // Ne pas appeler showSection ici car elle cache tout le reste

        // Afficher le bloc des résultats
        moduleResultsDiv?.classList.remove('hidden');
        console.log("Bloc module-results affiché"); // DEBUG

        // S'assurer que le bouton "Voir la leçon" est visible ET ACTIF
        if(showLessonBtn) {
            showLessonBtn.classList.remove('hidden');
            showLessonBtn.disabled = false; // Important de le réactiver
            // S'assurer que son texte est correct
            if (microCoursArticle?.classList.contains('hidden')) {
                showLessonBtn.textContent = 'Voir la leçon';
            } else {
                showLessonBtn.textContent = 'Cacher la leçon';
            }
            console.log("Bouton 'Voir la leçon' rendu visible et actif."); // DEBUG
        } else {
            console.error("Bouton showLessonBtn non trouvé dans displayModuleResults"); // DEBUG
        }

        // La leçon reste cachée par défaut lors de l'affichage des résultats,
        // elle sera affichée/cachée par son propre bouton.
        // microCoursArticle?.classList.add('hidden'); // Ne pas cacher la leçon ici si elle était déjà ouverte

        if (typeof enregistrerScore === 'function') { enregistrerScore(moduleId, currentScore, totalMaxScore); }
        else { console.error("Fonction enregistrerScore non trouvée."); }
    }

    // == Affichage Leçon (Listener attaché une seule fois) ==
    if (showLessonBtn && microCoursArticle) {
        showLessonBtn.removeEventListener('click', handleShowLessonClick); // Nettoyer
        showLessonBtn.addEventListener('click', handleShowLessonClick);
        console.log("Listener attaché au bouton 'Voir la leçon'."); //DEBUG
    } else {
        console.error("Bouton 'showLessonBtn' ou 'microCoursArticle' non trouvé pour attacher listener."); // DEBUG
    }

    function handleShowLessonClick() {
        if (microCoursArticle && showLessonBtn) {
            microCoursArticle.classList.toggle('hidden');
            showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
            console.log("Clic sur bouton Leçon. État hidden leçon:", microCoursArticle.classList.contains('hidden')); // DEBUG
        }
    }


    // == Initialisation Finale de la Page ==
    showSection(introductionSection); // Afficher seulement l'intro au départ

    // Attacher le listener au bouton "Commencer"
    if (startExercisesBtn) {
        startExercisesBtn.removeEventListener('click', handleStartClick);
        startExercisesBtn.addEventListener('click', handleStartClick);
    } else { /* Fallback */ }

    // --- Ajout Emojis CSS via JS ---
    if (!document.getElementById('emoji-styles')) { /* ... (code inchangé) ... */ }

}); // Fin DOMContentLoaded