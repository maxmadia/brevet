document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 5 ---");

    // --- Configuration et Références DOM ---
    const moduleId = 'module_5_information';
    const maxScoreEx1 = 3, maxScoreEx2 = 4, maxScoreEx3 = 3;
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

    // Variables spécifiques pour les exercices
    let validateEx1Btn, feedbackEx1, schemaContainerInfo, etiquettesInfoContainer, dropZonesInfo, etiquettesInfo, draggedEtiquetteInfo;
    let nextEx2BtnInfo;
    let validateEx2Btn, feedbackEx2, compInfoListContainer, dropzonesCompInfo, draggablesCompInfo, draggedCompInfo, validatedEx2Info = false, nextEx3BtnInfo;
    let validateEx3Btn, feedbackEx3, qcmInfoForm, validatedEx3Info = false;


    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv, microCoursArticle]
            .forEach(s => {
                if (s) s.classList.add('hidden');
                else console.warn("Tentative de cacher une section non trouvée.");
            });
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        } else {
            console.warn("Tentative d'afficher une section non trouvée.");
        }
        if (sectionToShow === moduleResultsDiv && showLessonBtn) {
             showLessonBtn.classList.remove('hidden');
        }
    }

    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod5: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;

        if (moduleResultsDiv) moduleResultsDiv.classList.remove('hidden');
        if(showLessonBtn) {
            showLessonBtn.classList.remove('hidden');
            showLessonBtn.disabled = false;
            console.log("Bouton 'Voir la leçon' rendu visible et actif.");
        }
        if (microCoursArticle) microCoursArticle.classList.add('hidden');
        if (showLessonBtn) showLessonBtn.textContent = 'Voir la leçon';

        if (typeof enregistrerScore === 'function') { enregistrerScore(moduleId, currentScore, totalMaxScore); }
        else { console.error("Fonction enregistrerScore non trouvée."); }
    }

    // --- Initialisation Différée des Exercices ---
    function initExercise1() {
        console.log("Init Ex1 Mod5");
        validateEx1Btn = document.getElementById('validate-ex1');
        feedbackEx1 = document.getElementById('feedback-ex1');
        schemaContainerInfo = document.getElementById('chaine-info-schema-container');
        etiquettesInfoContainer = document.getElementById('etiquettes-info-container');

        if (!validateEx1Btn || !feedbackEx1 || !schemaContainerInfo || !etiquettesInfoContainer) {
            console.error("Un ou plusieurs éléments de l'exercice 1 sont manquants. Vérifiez les IDs HTML.");
            return; // Arrêter l'initialisation si les éléments clés manquent
        }
        
        dropZonesInfo = schemaContainerInfo.querySelectorAll('.drop-zone-info');
        etiquettesInfo = etiquettesInfoContainer.querySelectorAll('.etiquette-info');
        draggedEtiquetteInfo = null;
        scoreEx1 = 0;

        etiquettesInfo?.forEach(et => {
            etiquettesInfoContainer.appendChild(et);
            et.classList.remove('correct', 'incorrect', 'dragging');
            et.setAttribute('draggable','true');
            et.style.cursor = 'grab';
        });
        dropZonesInfo?.forEach(dz => {
            const child = dz.querySelector('.etiquette-info');
            if(child) dz.removeChild(child);
            dz.classList.remove('over');
        });
        
        feedbackEx1.innerHTML = '';
        feedbackEx1.className = 'feedback';
        
        validateEx1Btn.disabled = false;
        validateEx1Btn.removeEventListener('click', handleValidateEx1Info);
        validateEx1Btn.addEventListener('click', handleValidateEx1Info);

        // Création/gestion du bouton "Passer à l'exercice 2"
        if (exercise1Section && validateEx1Btn) { // S'assurer que validateEx1Btn existe
            if (!nextEx2BtnInfo) {
                nextEx2BtnInfo = document.createElement('button');
                nextEx2BtnInfo.id = 'next-ex2-info';
                nextEx2BtnInfo.textContent = "Passer à l'exercice 2";
                nextEx2BtnInfo.style.marginLeft = "10px";
                validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnInfo);
                nextEx2BtnInfo.addEventListener('click', handleNextEx2ClickInfo);
            }
            nextEx2BtnInfo.classList.add('hidden'); // Toujours le cacher à l'init
        }
        addDragListenersEx1Info();
    }

    function initExercise2() {
        console.log("Init Ex2 Mod5");
        validateEx2Btn = document.getElementById('validate-ex2');
        feedbackEx2 = document.getElementById('feedback-ex2');
        compInfoListContainer = document.getElementById('comp-info-list');
        
        if (!validateEx2Btn || !feedbackEx2 || !compInfoListContainer) {
            console.error("Un ou plusieurs éléments de l'exercice 2 sont manquants.");
            return;
        }

        dropzonesCompInfo = document.querySelectorAll('.dropzone-comp-info');
        draggablesCompInfo = compInfoListContainer.querySelectorAll('.draggable-comp-info');
        draggedCompInfo = null;
        validatedEx2Info = false;
        scoreEx2 = 0;

        draggablesCompInfo?.forEach(d => {
            compInfoListContainer.appendChild(d);
            d.classList.remove('correct', 'incorrect', 'dragging');
            d.setAttribute('draggable','true');
            d.style.cursor = 'grab';
        });
        dropzonesCompInfo?.forEach(dz => {
            Array.from(dz.querySelectorAll('.draggable-comp-info')).forEach(child => compInfoListContainer.appendChild(child));
            dz.classList.remove('over');
        });
        
        feedbackEx2.innerHTML = '';
        feedbackEx2.className = 'feedback';
        
        validateEx2Btn.disabled = false;
        validateEx2Btn.removeEventListener('click', handleValidateEx2Info);
        validateEx2Btn.addEventListener('click', handleValidateEx2Info);
        
        if (exercise2Section && validateEx2Btn) {
            if (!nextEx3BtnInfo) {
                nextEx3BtnInfo = document.createElement('button');
                nextEx3BtnInfo.id = 'next-ex3-info';
                nextEx3BtnInfo.textContent = "Passer à l'exercice 3";
                nextEx3BtnInfo.style.marginLeft = "10px";
                validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnInfo);
                nextEx3BtnInfo.addEventListener('click', handleNextEx3ClickInfo);
            }
            nextEx3BtnInfo.classList.add('hidden');
        }
        addDragListenersEx2Info();
    }

    function initExercise3() {
        console.log("Init Ex3 Mod5");
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        qcmInfoForm = document.getElementById('qcm-info-form');

        if (!validateEx3Btn || !feedbackEx3 || !qcmInfoForm) {
            console.error("Un ou plusieurs éléments de l'exercice 3 sont manquants.");
            return;
        }
        
        validatedEx3Info = false;
        scoreEx3 = 0;
        qcmInfoForm.reset();
        qcmInfoForm.querySelectorAll('input[type="radio"]').forEach(r => {
            r.disabled = false;
            const label = r.closest('label');
            if(label) {
                label.classList.remove('correct-answer', 'incorrect-answer');
                label.style.backgroundColor='';
                label.style.fontWeight='';
                label.style.outline = 'none';
            }
        });
        
        feedbackEx3.innerHTML = '';
        feedbackEx3.className = 'feedback';
        
        validateEx3Btn.disabled = false;
        validateEx3Btn.removeEventListener('click', handleValidateEx3Info);
        validateEx3Btn.addEventListener('click', handleValidateEx3Info);
        
        if (moduleResultsDiv) moduleResultsDiv.classList.add('hidden');
        if (showLessonBtn) showLessonBtn.classList.add('hidden');
        if (microCoursArticle) microCoursArticle.classList.add('hidden');
    }


    // --- Handler pour bouton Commencer ---
    function handleStartClick() {
        console.log(">>> Clic sur 'Commencer les exercices' DÉTECTÉ <<<");
        if (startExercisesBtn) {
            startExercisesBtn.disabled = true;
        }
        if (introductionSection) {
            introductionSection.classList.add('hidden');
        } else {
            console.warn("Section introduction non trouvée pour la cacher.");
        }

        if (exercise1Section) {
            showSection(exercise1Section);
            initExercise1(); // initExercise1 doit être robuste
        } else {
            console.error("ERREUR: Section Exercice 1 (exercise1Section) non trouvée lors du clic sur Commencer.");
        }
    }

    // --- Handler pour bouton Suivant (Ex1 -> Ex2) ---
    function handleNextEx2ClickInfo() {
        if (exercise2Section) {
            showSection(exercise2Section);
            initExercise2();
        } else {
            console.error("Section Exercice 2 non trouvée pour y passer.");
        }
        if (nextEx2BtnInfo) {
            nextEx2BtnInfo.classList.add('hidden');
        }
    }
     // --- Handler pour bouton Suivant (Ex2 -> Ex3) ---
     function handleNextEx3ClickInfo() {
        if (exercise3Section) {
            showSection(exercise3Section);
            initExercise3();
        } else {
            console.error("Section Exercice 3 non trouvée pour y passer.");
        }
        if (nextEx3BtnInfo) {
            nextEx3BtnInfo.classList.add('hidden');
        }
    }

    // --- Définitions des Handlers et Logique des Exercices ---

    // == Exercice 1 ==
    function handleEtiquetteInfoDragStart(e) { draggedEtiquetteInfo = e.target.closest('.etiquette-info'); if(draggedEtiquetteInfo){ setTimeout(() => { if(draggedEtiquetteInfo) draggedEtiquetteInfo.classList.add('dragging'); }, 0); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', draggedEtiquetteInfo.dataset.function || 'etiquette'); } catch(err) {} } else {e.preventDefault();} }
    function handleEtiquetteInfoDragEnd() { if (draggedEtiquetteInfo) { draggedEtiquetteInfo.classList.remove('dragging'); } draggedEtiquetteInfo = null; }
    function handleZoneInfoDragEnter(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
    function handleZoneInfoDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
    function handleZoneInfoDragLeave(e) { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.classList.remove('over'); } else if (!e.relatedTarget) { e.currentTarget.classList.remove('over'); } }
    function handleZoneInfoDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('over'); if (draggedEtiquetteInfo) { const targetZone = e.currentTarget; const existingEtiquette = targetZone.querySelector('.etiquette-info'); if (targetZone === etiquettesInfoContainer || (targetZone.classList.contains('drop-zone-info') && !existingEtiquette)) { targetZone.appendChild(draggedEtiquetteInfo); } else if (targetZone.classList.contains('drop-zone-info') && existingEtiquette && existingEtiquette !== draggedEtiquetteInfo) { etiquettesInfoContainer?.appendChild(existingEtiquette); targetZone.appendChild(draggedEtiquetteInfo); } } }
    function addDragListenersEx1Info() { if (!etiquettesInfo || !dropZonesInfo || !etiquettesInfoContainer) return; etiquettesInfo.forEach(et => { et.setAttribute('draggable', 'true'); et.style.cursor = 'grab'; et.removeEventListener('dragstart', handleEtiquetteInfoDragStart); et.removeEventListener('dragend', handleEtiquetteInfoDragEnd); et.addEventListener('dragstart', handleEtiquetteInfoDragStart); et.addEventListener('dragend', handleEtiquetteInfoDragEnd); }); const allTargets = [...dropZonesInfo, etiquettesInfoContainer]; allTargets.forEach(t => { if(!t) return; t.removeEventListener('dragenter', handleZoneInfoDragEnter); t.removeEventListener('dragover', handleZoneInfoDragOver); t.removeEventListener('dragleave', handleZoneInfoDragLeave); t.removeEventListener('drop', handleZoneInfoDrop); t.addEventListener('dragenter', handleZoneInfoDragEnter); t.addEventListener('dragover', handleZoneInfoDragOver); t.addEventListener('dragleave', handleZoneInfoDragLeave); t.addEventListener('drop', handleZoneInfoDrop); }); console.log("Listeners D&D Ex1 Info activés."); }
    function removeDragListenersEx1Info() { if (!etiquettesInfo || !dropZonesInfo || !etiquettesInfoContainer) return; etiquettesInfo.forEach(et => { et.setAttribute('draggable', 'false'); et.style.cursor = 'default'; et.removeEventListener('dragstart', handleEtiquetteInfoDragStart); et.removeEventListener('dragend', handleEtiquetteInfoDragEnd); }); const allTargets = [...dropZonesInfo, etiquettesInfoContainer]; allTargets.forEach(t => { if(!t) return; t.removeEventListener('dragenter', handleZoneInfoDragEnter); t.removeEventListener('dragover', handleZoneInfoDragOver); t.removeEventListener('dragleave', handleZoneInfoDragLeave); t.removeEventListener('drop', handleZoneInfoDrop); }); console.log("Listeners D&D Ex1 Info désactivés."); }
    
    function handleValidateEx1Info() {
        if (!dropZonesInfo || !feedbackEx1 || !validateEx1Btn) {
            console.error("Éléments manquants pour la validation de l'Ex1.");
            return;
        }
        scoreEx1 = 0;
        let allOk = true;
        let feedback = "Correction Exercice 1:<br>";
        let allZonesFilled = true;
    
        dropZonesInfo.forEach(zone => {
            const etiq = zone.querySelector('.etiquette-info');
            if (!etiq) {
                allZonesFilled = false;
            } else {
                etiq.classList.remove('correct', 'incorrect');
            }
        });
    
        if (!allZonesFilled) {
            feedbackEx1.innerHTML = "⚠️ Veuillez placer une fonction dans chaque case.";
            feedbackEx1.className = 'feedback incorrect';
            return;
        }
    
        dropZonesInfo.forEach(zone => {
            const etiq = zone.querySelector('.etiquette-info');
            const correctFunction = zone.dataset.correctFunction;
            const placedFunction = etiq.dataset.function;
            const isOk = placedFunction === correctFunction;
    
            if (isOk) {
                scoreEx1++;
                etiq.classList.add('correct');
            } else {
                allOk = false;
                etiq.classList.add('incorrect');
            }
            const zoneName = zone.id.replace('drop-','').toUpperCase();
            feedback += `- Zone <strong>${zoneName}</strong> : Vous avez placé "${etiq.textContent}". Attendu : "${correctFunction.toUpperCase()}". ${isOk ? '<span class="emoji-correct">✔️</span>' : '<span class="emoji-incorrect">❌</span>'}<br>`;
        });
    
        etiquettesInfoContainer?.querySelectorAll('.etiquette-info').forEach(etiq => {
            etiq.setAttribute('draggable', 'false');
            etiq.style.cursor = 'default';
        });

        feedbackEx1.innerHTML = feedback + `<p><strong>Votre score pour cet exercice : ${scoreEx1}/${maxScoreEx1}</strong></p>`;
        feedbackEx1.className = 'feedback ' + (allOk && scoreEx1 === maxScoreEx1 ? 'correct' : 'incorrect');
    
        validateEx1Btn.disabled = true;
        removeDragListenersEx1Info();
    
        if (nextEx2BtnInfo) {
            nextEx2BtnInfo.classList.remove('hidden');
        } else {
            console.warn("Bouton nextEx2BtnInfo non trouvé pour l'afficher.");
        }
    }


    // == Exercice 2 ==
    const correctMatchesCompInfo = { 'comp-info-elec': 'comp-func-acq', 'comp-info-micro': 'comp-func-trait', 'comp-info-hp': 'comp-func-comm-voc', 'comp-info-leds': 'comp-func-comm-vis'};
    function handleCompInfoDragStart(e) { draggedCompInfo = e.target.closest('.draggable-comp-info'); if(draggedCompInfo){ setTimeout(() => { if(draggedCompInfo) draggedCompInfo.classList.add('dragging'); }, 0); e.dataTransfer.effectAllowed = 'move'; try{e.dataTransfer.setData('text/plain', draggedCompInfo.id);}catch(err){} } else {e.preventDefault();} }
    function handleCompInfoDragEnd() { if(draggedCompInfo) draggedCompInfo.classList.remove('dragging'); draggedCompInfo = null; }
    function handleCompInfoZoneDragEnter(e) { e.preventDefault(); e.currentTarget.classList.add('over');}
    function handleCompInfoZoneDragOver(e) { e.preventDefault(); const targetZone = e.currentTarget; const existing = targetZone.querySelector('.draggable-comp-info'); if(targetZone === compInfoListContainer || !existing || existing === draggedCompInfo) { e.dataTransfer.dropEffect='move';} else {e.dataTransfer.dropEffect='none';} }
    function handleCompInfoZoneDragLeave(e) { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.classList.remove('over'); } else if (!e.relatedTarget) { e.currentTarget.classList.remove('over'); } }
    function handleCompInfoZoneDrop(e) { e.preventDefault(); if(draggedCompInfo) { const targetZone = e.currentTarget; const existing = targetZone.querySelector('.draggable-comp-info'); if (targetZone.classList.contains('dropzone-comp-info')) { while (targetZone.firstChild && targetZone.firstChild.nodeName !== 'P') { targetZone.removeChild(targetZone.firstChild); } } else if (targetZone === compInfoListContainer) { /* no special removal needed */ } if(targetZone.classList.contains('dropzone-comp-info') && existing && existing !== draggedCompInfo){ compInfoListContainer?.appendChild(existing); } targetZone.appendChild(draggedCompInfo); } e.currentTarget.classList.remove('over'); }
    function addDragListenersEx2Info() { if (!compInfoListContainer || !dropzonesCompInfo) return; draggablesCompInfo = document.querySelectorAll('#comp-info-list .draggable-comp-info, .dropzone-comp-info .draggable-comp-info'); draggablesCompInfo.forEach(d => { d.setAttribute('draggable','true'); d.style.cursor='grab'; d.removeEventListener('dragstart', handleCompInfoDragStart); d.removeEventListener('dragend', handleCompInfoDragEnd); d.addEventListener('dragstart', handleCompInfoDragStart); d.addEventListener('dragend', handleCompInfoDragEnd); }); const allTargets = [...dropzonesCompInfo, compInfoListContainer]; allTargets.forEach(t => { if(!t) return; t.removeEventListener('dragenter', handleCompInfoZoneDragEnter); t.removeEventListener('dragover', handleCompInfoZoneDragOver); t.removeEventListener('dragleave', handleCompInfoZoneDragLeave); t.removeEventListener('drop', handleCompInfoZoneDrop); t.addEventListener('dragenter', handleCompInfoZoneDragEnter); t.addEventListener('dragover', handleCompInfoZoneDragOver); t.addEventListener('dragleave', handleCompInfoZoneDragLeave); t.addEventListener('drop', handleCompInfoZoneDrop); }); console.log("Listeners D&D Ex2 Info activés."); }
    function removeDragListenersEx2Info() { if (!compInfoListContainer || !dropzonesCompInfo) return; draggablesCompInfo = document.querySelectorAll('#comp-info-list .draggable-comp-info, .dropzone-comp-info .draggable-comp-info'); draggablesCompInfo.forEach(d => { d.setAttribute('draggable','false'); d.style.cursor='default'; d.removeEventListener('dragstart', handleCompInfoDragStart); d.removeEventListener('dragend', handleCompInfoDragEnd); }); const allTargets = [...dropzonesCompInfo, compInfoListContainer]; allTargets.forEach(t => { if(!t) return; t.removeEventListener('dragenter', handleCompInfoZoneDragEnter); t.removeEventListener('dragover', handleCompInfoZoneDragOver); t.removeEventListener('dragleave', handleCompInfoZoneDragLeave); t.removeEventListener('drop', handleCompInfoZoneDrop); }); console.log("Listeners D&D Ex2 Info désactivés."); }
    
    function handleValidateEx2Info() {
        if (!dropzonesCompInfo || !feedbackEx2 || !validateEx2Btn) {
            console.error("Éléments manquants pour la validation de l'Ex2.");
            return;
        }
        let currentAttemptScoreEx2 = 0;
        let feedbackHtml = 'Correction Exercice 2:<br>';
        let allPlaced = true;
        let perfect = true;
        
        if (compInfoListContainer?.querySelectorAll('.draggable-comp-info').length > 0) {
            allPlaced = false;
        }
        dropzonesCompInfo.forEach(zone => {
            if (!zone.querySelector('.draggable-comp-info')) allPlaced = false;
        });

        if (!allPlaced) {
            feedbackEx2.innerHTML = "⚠️ Veuillez associer tous les composants à une fonction.";
            feedbackEx2.className = 'feedback incorrect';
            return;
        }

        dropzonesCompInfo.forEach(zone => {
            const comp = zone.querySelector('.draggable-comp-info');
            const correctCompId = zone.dataset.correctComp;
            const placedId = comp.id;
            const isOk = placedId === correctCompId;
            if (isOk) {
                currentAttemptScoreEx2++;
                comp.classList.add('correct');
            } else {
                perfect = false;
                comp.classList.add('incorrect');
            }
            const expectedCompText = document.getElementById(correctCompId)?.textContent || 'Composant inconnu';
            feedbackHtml += `- ${zone.querySelector('p strong').textContent.replace('Fonction :','').trim()} : Vous avez associé "${comp.textContent}". Attendu : "${expectedCompText}". ${isOk ? '<span class="emoji-correct">✔️</span>':'<span class="emoji-incorrect">❌</span>'}<br>`;
        });
        
        if (!validatedEx2Info) {
            scoreEx2 = currentAttemptScoreEx2;
            validatedEx2Info = true;
        }
        
        feedbackEx2.innerHTML = feedbackHtml + `<p><strong>Score: ${scoreEx2}/${maxScoreEx2}</strong></p>`;
        feedbackEx2.className = 'feedback ' + (perfect && scoreEx2 === maxScoreEx2 ? 'correct' : 'incorrect');
        
        validateEx2Btn.disabled = true;
        removeDragListenersEx2Info();
        if (nextEx3BtnInfo) {
            nextEx3BtnInfo.classList.remove('hidden');
        } else {
            console.warn("Bouton nextEx3BtnInfo non trouvé pour l'afficher.");
        }
    }


    // == Exercice 3 ==
    function handleValidateEx3Info() {
        if (!qcmInfoForm || !feedbackEx3 || !validateEx3Btn) {
            console.error("Éléments manquants pour la validation de l'Ex3.");
            return;
        }
        scoreEx3 = 0;
        let allOk = true;
        let feedback = "Correction Exercice 3:<br>";
        let allAnswered = true;
        const questionsData = [
            { name: "q3_1", questionText: "Nature du signal capté par les électrodes" },
            { name: "q3_2", questionText: "Nature de l'information traitée par le microcontrôleur" },
            { name: "q3_3", questionText: "Nature de l'information communiquée par le haut-parleur" }
        ];
            
        questionsData.forEach(qData => {
            const selected = qcmInfoForm.querySelector(`input[name="${qData.name}"]:checked`);
            qcmInfoForm.querySelectorAll(`input[name="${qData.name}"]`).forEach(r => {
                const label = r.closest('label');
                if (label) {
                    label.classList.remove('correct-answer', 'incorrect-answer');
                    label.style.backgroundColor = '';
                    label.style.fontWeight = '';
                }
            });
            if (!selected) {
                allAnswered = false;
            }
        });
    
        if (!allAnswered) {
            feedbackEx3.innerHTML = "⚠️ Veuillez répondre à toutes les questions.";
            feedbackEx3.className = 'feedback incorrect';
            return;
        }
    
        questionsData.forEach((qData, index) => {
            const selected = qcmInfoForm.querySelector(`input[name="${qData.name}"]:checked`);
            const radios = qcmInfoForm.querySelectorAll(`input[name="${qData.name}"]`);
            const correctRadio = qcmInfoForm.querySelector(`input[name="${qData.name}"][data-correct="true"]`);
            const selectedLabel = selected.closest('label');
            const correctLabel = correctRadio?.closest('label'); // Peut être null si data-correct n'est pas sur un radio
    
            const isOk = selected.dataset.correct === 'true';
    
            if (isOk) {
                scoreEx3++;
                if(selectedLabel) selectedLabel.classList.add('correct-answer');
            } else {
                allOk = false;
                if(selectedLabel) selectedLabel.classList.add('incorrect-answer');
                if (correctLabel) correctLabel.classList.add('correct-answer');
            }
    
            feedback += `- Question "${qData.questionText}" : Vous avez répondu "${selectedLabel?.textContent.trim() || 'Réponse non trouvée'}". ${isOk ? '<span class="emoji-correct">✔️</span>' : '<span class="emoji-incorrect">❌</span> La bonne réponse était : "' + (correctLabel?.textContent.trim() || 'Bonne réponse non spécifiée') + '"'}.<br>`;
            radios.forEach(r => r.disabled = true);
        });
    
        feedbackEx3.innerHTML = feedback + `<p><strong>Score: ${scoreEx3}/${maxScoreEx3}</strong></p>`;
        feedbackEx3.className = 'feedback ' + (allOk ? 'correct' : 'incorrect');
        validatedEx3Info = true;
        validateEx3Btn.disabled = true;
        displayModuleResults();
    }


    // == Affichage Leçon ==
    if (showLessonBtn) {
        showLessonBtn.addEventListener('click', () => {
            if (microCoursArticle) {
                 microCoursArticle.classList.toggle('hidden');
                 showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
                 console.log("Bouton Leçon cliqué, état hidden leçon:", microCoursArticle.classList.contains('hidden'));
            } else {
                console.warn("Article micro-cours non trouvé.");
            }
        });
    } else {
        console.warn("Bouton 'show-lesson-btn' non trouvé.");
    }


    // == Initialisation Finale de la Page ==
    if (introductionSection) {
        showSection(introductionSection);
    } else {
        console.error("Section introduction (introductionSection) non trouvée à l'initialisation. Impossible d'afficher la page correctement.");
        // Option: afficher un message d'erreur à l'utilisateur dans le body.
        document.body.innerHTML = "<p style='color:red; text-align:center; font-size:1.2em;'>Erreur critique: Impossible de charger le contenu principal du module. Veuillez vérifier la console.</p>";
    }

    if (startExercisesBtn) {
        console.log("Attachement du listener au bouton 'startExercisesBtn'.");
        startExercisesBtn.removeEventListener('click', handleStartClick); // Bonne pratique de nettoyer
        startExercisesBtn.addEventListener('click', handleStartClick);
    } else {
         console.error("Bouton 'start-exercises' (startExercisesBtn) NON TROUVÉ. Le démarrage des exercices est impossible via ce bouton.");
         // Si le bouton start n'est pas là, il ne faut PAS essayer de lancer l'exo 1 automatiquement
         // car cela masque le fait que le bouton principal est manquant.
         // L'utilisateur verra le message d'erreur dans la console.
    }

    // --- Ajout Emojis CSS via JS ---
     if (!document.getElementById('emoji-styles') && typeof document.styleSheets !== 'undefined' && document.styleSheets.length > 0) {
        const styleSheet = document.styleSheets[0];
         try {
            if (styleSheet && !Array.from(styleSheet.cssRules).some(rule => rule.selectorText === '.emoji-correct')) {
                styleSheet.insertRule('.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }', styleSheet.cssRules.length);
            }
            if (styleSheet && !Array.from(styleSheet.cssRules).some(rule => rule.selectorText === '.emoji-incorrect')) {
                styleSheet.insertRule('.emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }', styleSheet.cssRules.length);
            }
         } catch (e) {
             console.warn("Impossible d'insérer les règles CSS pour les emojis via insertRule: ", e);
              const style = document.createElement('style'); style.id = 'emoji-styles'; style.innerHTML = `.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; } .emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }`; document.head.appendChild(style);
         }
     } else if (!document.getElementById('emoji-styles')) {
          const style = document.createElement('style'); style.id = 'emoji-styles'; style.innerHTML = `.emoji-correct { color: green; margin-right: 5px; font-size: 1.1em; vertical-align: middle; } .emoji-incorrect { color: red; margin-right: 5px; font-size: 1.1em; vertical-align: middle; }`; document.head.appendChild(style);
     }

}); // Fin DOMContentLoaded