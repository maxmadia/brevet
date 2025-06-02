document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 4 ---");

    // --- Configuration et Références DOM ---
    const moduleId = 'module_4_energie';
    const maxScoreEx1 = 5, maxScoreEx2 = 4, maxScoreEx3 = 8; // maxScoreEx1 = 5 car il y a 5 zones à remplir
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

    if (!introductionSection || !startExercisesBtn || !exercise1Section || !exercise2Section || !exercise3Section) {
        console.error("ERREUR CRITIQUE: Éléments de section manquants.");
        return;
    }
    console.log("Elements de section principaux trouvés.");

    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv]
            .forEach(s => s?.classList.add('hidden'));
        sectionToShow?.classList.remove('hidden');
    }

    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        moduleResultsDiv?.classList.remove('hidden');
        showLessonBtn?.classList.remove('hidden');
        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else { console.error("Fonction enregistrerScore non trouvée."); }
    }

    startExercisesBtn?.addEventListener('click', () => {
        console.log("Bouton 'Commencer les exercices' cliqué");
        showSection(exercise1Section);
        initExercise1();
    });

    // --- Logique Exercice 1 ---
    let validateEx1Btn, nextEx2Btn, feedbackEx1, schemaContainer, etiquettesContainer, dropZonesEnergie, etiquettesEnergie, draggedEtiquette;
    
    function initExercise1() { 
        console.log("Initialisation Exercice 1..."); 
        validateEx1Btn = document.getElementById('validate-ex1'); 
        nextEx2Btn = document.getElementById('next-ex2-btn');
        feedbackEx1 = document.getElementById('feedback-ex1'); 
        schemaContainer = document.getElementById('chaine-energie-schema-container'); 
        etiquettesContainer = document.getElementById('etiquettes-energie-container'); 
        dropZonesEnergie = schemaContainer?.querySelectorAll('.drop-zone-energie'); 
        etiquettesEnergie = etiquettesContainer?.querySelectorAll('.etiquette-energie'); 
        draggedEtiquette = null; 
        scoreEx1 = 0; 

        etiquettesEnergie?.forEach(etiquette => {
            etiquettesContainer?.appendChild(etiquette);
            etiquette.classList.remove('correct', 'incorrect', 'dragging');
        });
        dropZonesEnergie?.forEach(zone => {
            while (zone.firstChild) {
                zone.removeChild(zone.firstChild);
            }
            zone.classList.remove('over');
        });

        if(validateEx1Btn) { 
            validateEx1Btn.disabled = false; 
            validateEx1Btn.removeEventListener('click', handleValidateEx1); 
            validateEx1Btn.addEventListener('click', handleValidateEx1); 
        } else { 
            console.error("Bouton Valider Ex1 non trouvé"); 
        } 
        if(nextEx2Btn) {
            nextEx2Btn.classList.add('hidden'); 
            nextEx2Btn.removeEventListener('click', handleNextEx2Click);
            nextEx2Btn.addEventListener('click', handleNextEx2Click);
        }
        if(feedbackEx1) feedbackEx1.innerHTML = "";

        addDragListenersEx1(); 
    }
    
    function handleEtiquetteDragStart(e) { 
        draggedEtiquette = e.target.closest('span.etiquette-energie'); 
        if(draggedEtiquette){ 
            setTimeout(() => { 
                if(draggedEtiquette) draggedEtiquette.classList.add('dragging'); 
            }, 0); 
            e.dataTransfer.effectAllowed = 'move'; 
            try { 
                e.dataTransfer.setData('text/plain', draggedEtiquette.dataset.function || 'etiquette'); 
            } catch(err) {} 
        } else {
            e.preventDefault();
        } 
        console.log("Drag Start Ex1:", draggedEtiquette?.textContent); 
    }
    
    function handleEtiquetteDragEnd(e) { 
        console.log("Drag End Ex1:", e.target?.textContent); 
        if (draggedEtiquette) { 
            draggedEtiquette.classList.remove('dragging'); 
        } 
        draggedEtiquette = null; 
    }
    
    function handleZoneDragEnter(e) { 
        e.preventDefault(); 
        e.currentTarget.classList.add('over'); 
    }
    
    function handleZoneDragOver(e) { 
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move'; 
    }
    
    function handleZoneDragLeave(e) { 
        e.currentTarget.classList.remove('over'); 
    }
    
    function handleZoneDrop(e) { 
        e.preventDefault(); 
        const targetZone = e.currentTarget;
        targetZone.classList.remove('over'); 
        if (draggedEtiquette) { 
            const existingEtiquette = targetZone.querySelector('.etiquette-energie'); 
            if (targetZone === etiquettesContainer || (targetZone.classList.contains('drop-zone-energie') && !existingEtiquette)) { 
                targetZone.appendChild(draggedEtiquette); 
            } 
            else if (targetZone.classList.contains('drop-zone-energie') && existingEtiquette && existingEtiquette !== draggedEtiquette) { 
                etiquettesContainer?.appendChild(existingEtiquette); 
                targetZone.appendChild(draggedEtiquette); 
            } 
        } else { 
            console.warn("Drop event Ex1 sans draggedEtiquette valide."); 
        } 
    }
    
    function addDragListenersEx1() { 
        etiquettesEnergie?.forEach(etiquette => { 
            etiquette.setAttribute('draggable', 'true'); 
            etiquette.style.cursor = 'grab'; 
            etiquette.removeEventListener('dragstart', handleEtiquetteDragStart); 
            etiquette.removeEventListener('dragend', handleEtiquetteDragEnd); 
            etiquette.addEventListener('dragstart', handleEtiquetteDragStart); 
            etiquette.addEventListener('dragend', handleEtiquetteDragEnd); 
        }); 
        
        const allDropTargetsEx1 = [...(dropZonesEnergie || []), etiquettesContainer]; 
        allDropTargetsEx1.forEach(target => { 
            if (!target) return; 
            target.removeEventListener('dragenter', handleZoneDragEnter); 
            target.removeEventListener('dragover', handleZoneDragOver); 
            target.removeEventListener('dragleave', handleZoneDragLeave); 
            target.removeEventListener('drop', handleZoneDrop); 
            target.addEventListener('dragenter', handleZoneDragEnter); 
            target.addEventListener('dragover', handleZoneDragOver); 
            target.addEventListener('dragleave', handleZoneDragLeave); 
            target.addEventListener('drop', handleZoneDrop); 
        }); 
        console.log("Listeners D&D Ex1 activés."); 
    }
    
    function removeDragListenersEx1() { 
        etiquettesEnergie?.forEach(etiquette => { 
            etiquette.setAttribute('draggable', 'false'); 
            etiquette.style.cursor = 'default'; 
            etiquette.removeEventListener('dragstart', handleEtiquetteDragStart); 
            etiquette.removeEventListener('dragend', handleEtiquetteDragEnd); 
        }); 
        
        const allDropTargetsEx1 = [...(dropZonesEnergie || []), etiquettesContainer]; 
        allDropTargetsEx1.forEach(target => { 
            if (!target) return; 
            target.removeEventListener('dragenter', handleZoneDragEnter); 
            target.removeEventListener('dragover', handleZoneDragOver); 
            target.removeEventListener('dragleave', handleZoneDragLeave); 
            target.removeEventListener('drop', handleZoneDrop); 
        }); 
        console.log("Listeners D&D Ex1 désactivés."); 
    }
    
    function handleValidateEx1() {
        console.log("Clic sur 'Valider Exercice 1'");
        scoreEx1 = 0;
        let feedbackHtml = '<b>Vos réponses :</b><br>';
        let perfectAttempt = true;
        const userPlacements = new Map();

        dropZonesEnergie?.forEach(zone => {
            const etiquette = zone.querySelector('.etiquette-energie');
            userPlacements.set(zone.id, etiquette ? etiquette.dataset.function : null);
        });

        let allZonesFilledByUser = true;
        dropZonesEnergie?.forEach(zone => {
            if (!userPlacements.get(zone.id)) {
                allZonesFilledByUser = false;
            }
        });

        if (!allZonesFilledByUser && validateEx1Btn && !validateEx1Btn.disabled) {
            if (feedbackEx1) {
                feedbackEx1.innerHTML = '<span class="emoji-incorrect">⚠️</span> Veuillez placer une fonction dans chaque case.';
                feedbackEx1.className = 'feedback incorrect';
            }
            return;
        }

        dropZonesEnergie?.forEach((zone) => {
            const correctFunction = zone.dataset.correctFunction;
            const placedFunction = userPlacements.get(zone.id);
            const zoneName = zone.id.replace('drop-', '').toUpperCase();

            if (placedFunction) {
                if (placedFunction === correctFunction) {
                    scoreEx1++;
                    feedbackHtml += `- Zone ${zoneName}: ✔️ Correct (vous avez mis "${placedFunction.toUpperCase()}").<br>`;
                } else {
                    perfectAttempt = false;
                    feedbackHtml += `- Zone ${zoneName}: ❌ Incorrect (vous avez mis "${placedFunction.toUpperCase()}", attendu: "${correctFunction.toUpperCase()}").<br>`;
                }
            } else { 
                perfectAttempt = false;
                feedbackHtml += `- Zone ${zoneName}: ⚠️ Vide. Attendu: "${correctFunction.toUpperCase()}".<br>`;
            }
        });

        // Vérifier s'il reste des étiquettes non utilisées dans le conteneur.
        // S'il n'y a pas d'intrus, le conteneur devrait être vide si tout est correct.
        const remainingEtiquettes = etiquettesContainer?.querySelectorAll('.etiquette-energie').length;
        if (remainingEtiquettes > 0 && perfectAttempt) {
            // Cela ne devrait pas arriver si toutes les étiquettes sont utilisées et toutes les zones sont remplies.
            // Pour ce scénario (pas d'intrus), on s'attend à 0 étiquette restante.
        } else if (remainingEtiquettes > 0 && !perfectAttempt) {
            // L'utilisateur n'a pas tout placé correctement, normal qu'il en reste.
        }

        if (feedbackEx1) {
            feedbackEx1.innerHTML = feedbackHtml + `<strong>Votre score pour l'exercice 1 : ${scoreEx1} / ${maxScoreEx1}</strong><br><hr><b>Correction :</b><br>`;
            feedbackEx1.className = 'feedback ' + (perfectAttempt ? 'correct' : 'incorrect');
        }

        dropZonesEnergie?.forEach(zone => {
            while (zone.firstChild) { zone.removeChild(zone.firstChild); }
        });
        etiquettesEnergie?.forEach(etiquette => {
            etiquettesContainer?.appendChild(etiquette);
            etiquette.classList.remove('correct', 'incorrect');
        });

        dropZonesEnergie?.forEach(zone => {
            const correctFunctionName = zone.dataset.correctFunction;
            if (correctFunctionName) {
                const etiquetteCorrecte = Array.from(etiquettesEnergie).find(e => e.dataset.function === correctFunctionName);
                if (etiquetteCorrecte) {
                    const clone = etiquetteCorrecte.cloneNode(true);
                    clone.classList.add('correct');
                    zone.appendChild(clone);
                    feedbackEx1.innerHTML += `- Zone ${zone.id.replace('drop-','').toUpperCase()}: Contient "${correctFunctionName.toUpperCase()}".<br>`;
                } else { // Fallback si l'étiquette est introuvable (ne devrait pas arriver)
                    zone.textContent = correctFunctionName.toUpperCase();
                    zone.classList.add('correct-text-fallback');
                    feedbackEx1.innerHTML += `- Zone ${zone.id.replace('drop-','').toUpperCase()}: Contient "${correctFunctionName.toUpperCase()}".<br>`;
                }
            }
        });
        
        // S'il y avait des étiquettes en trop (qui ne correspondent à aucune zone), elles resteraient dans le conteneur.
        // Ici, toutes les étiquettes doivent être utilisées.
        const finalRemainingEtiquettes = etiquettesContainer?.querySelectorAll('.etiquette-energie');
        if (finalRemainingEtiquettes && finalRemainingEtiquettes.length > 0) {
             feedbackEx1.innerHTML += `- Note: ${finalRemainingEtiquettes.length} étiquette(s) non placée(s) et non attendue(s) dans la liste.<br>`;
        }


        if(validateEx1Btn) validateEx1Btn.disabled = true;
        removeDragListenersEx1();

        if (nextEx2Btn) {
            nextEx2Btn.classList.remove('hidden');
        }
    }

    function handleNextEx2Click() {
        console.log("Bouton 'Passer à l'exercice 2' cliqué");
        showSection(exercise2Section);
        initExercise2();
    }


    // --- Logique Exercice 2 ---
    let validateEx2Btn, feedbackEx2, compListContainer, dropzonesComp, draggablesComp, draggedComp, nextEx3BtnEx2, validatedEx2; 
    
    function initExercise2() { 
        console.log("Initialisation Exercice 2..."); 
        validateEx2Btn = document.getElementById('validate-ex2'); 
        feedbackEx2 = document.getElementById('feedback-ex2'); 
        compListContainer = document.getElementById('comp-list'); 
        dropzonesComp = document.querySelectorAll('.dropzone-comp'); 
        draggablesComp = compListContainer?.querySelectorAll('.draggable-comp'); // Doit être querySelectorAll sur compListContainer pour les trouver
        
        // S'assurer que draggablesComp est bien une liste d'éléments avant de l'utiliser
        if (!draggablesComp || draggablesComp.length === 0) {
             // Tenter de les retrouver dans tout le document au cas où ils auraient été mal initialisés ou déplacés
             draggablesComp = document.querySelectorAll('#matching-comp-container .draggable-comp');
        }

        validatedEx2 = false; 
        scoreEx2 = 0; 

        draggablesComp?.forEach(d => { 
            d.setAttribute('draggable', 'true'); 
            d.style.cursor = 'grab'; 
            compListContainer.appendChild(d); 
            d.classList.remove('dragging', 'correct', 'incorrect');
        }); 
        
        dropzonesComp?.forEach(dz => { 
            const child = dz.querySelector('.draggable-comp'); 
            if (child) dz.removeChild(child); 
            dz.classList.remove('over');
        }); 
        
        if(feedbackEx2) feedbackEx2.innerHTML = "";

        if(validateEx2Btn) { 
            validateEx2Btn.disabled = false; 
            validateEx2Btn.removeEventListener('click', handleValidateEx2); 
            validateEx2Btn.addEventListener('click', handleValidateEx2); 
        } else { 
            console.error("Bouton Valider Ex2 non trouvé"); 
        } 
        
        nextEx3BtnEx2 = document.getElementById('next-ex3-btn-ex2'); 
        if (!nextEx3BtnEx2 && exercise2Section && validateEx2Btn) { 
            nextEx3BtnEx2 = document.createElement('button'); 
            nextEx3BtnEx2.id = 'next-ex3-btn-ex2'; 
            nextEx3BtnEx2.textContent = "Passer à l'exercice 3"; 
            nextEx3BtnEx2.style.marginLeft = "10px"; 
            validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnEx2); 
            nextEx3BtnEx2.removeEventListener('click', handleNextEx3Click); 
            nextEx3BtnEx2.addEventListener('click', handleNextEx3Click); 
        } 
        
        if (nextEx3BtnEx2) nextEx3BtnEx2.classList.add('hidden'); 
        addDragListenersEx2(); 
    }

    function handleNextEx3Click() { 
        console.log("Bouton 'Passer à l'exercice 3' cliqué depuis Ex2");
        showSection(exercise3Section);
        initExercise3();
    }
    
    function handleCompDragStart(e) { 
        draggedComp = e.target.closest('.draggable-comp'); 
        if(draggedComp) { 
            setTimeout(() => { 
                if(draggedComp) draggedComp.classList.add('dragging');
            }, 0); 
            e.dataTransfer.effectAllowed = 'move'; 
            try{
                e.dataTransfer.setData('text/plain', draggedComp.id);
            }catch(err){} 
        } else {
            e.preventDefault();
        } 
    }
    
    function handleCompDragEnd() { 
        if(draggedComp) draggedComp.classList.remove('dragging'); 
        draggedComp = null; 
    }
    
    function handleCompZoneDragOver(e) { 
        e.preventDefault(); 
        const targetZone = e.currentTarget; 
        const existing = targetZone.querySelector('.draggable-comp'); 
        if(targetZone === compListContainer || (targetZone.classList.contains('dropzone-comp') && (!existing || existing === draggedComp))) { 
            targetZone.classList.add('over'); 
            e.dataTransfer.dropEffect='move';
        } else {
            e.dataTransfer.dropEffect='none'; 
            targetZone.classList.remove('over'); 
        } 
    }

    function handleCompZoneDragLeave(e) { 
        e.currentTarget.classList.remove('over');
    }
    
    function handleCompZoneDrop(e) { 
        e.preventDefault(); 
        const targetZone = e.currentTarget;
        targetZone.classList.remove('over'); 
        if(draggedComp) { 
            const existing = targetZone.querySelector('.draggable-comp'); 
            if(targetZone.classList.contains('dropzone-comp') && existing && existing !== draggedComp){ 
                compListContainer?.appendChild(existing); 
            } 
            targetZone.appendChild(draggedComp); 
        } 
    }
    
    function addDragListenersEx2() { 
        // S'assurer que draggablesComp est à jour
        draggablesComp = document.querySelectorAll('#matching-comp-container .draggable-comp');

        draggablesComp?.forEach(d => { 
            d.removeEventListener('dragstart', handleCompDragStart); 
            d.removeEventListener('dragend', handleCompDragEnd); 
            d.addEventListener('dragstart', handleCompDragStart); 
            d.addEventListener('dragend', handleCompDragEnd); 
        }); 
        
        const allTargets = [...(dropzonesComp || []), compListContainer]; 
        allTargets.forEach(t => { 
            if(!t) return; 
            t.removeEventListener('dragover', handleCompZoneDragOver); 
            t.removeEventListener('dragleave', handleCompZoneDragLeave); 
            t.removeEventListener('drop', handleCompZoneDrop); 
            t.addEventListener('dragover', handleCompZoneDragOver); 
            t.addEventListener('dragleave', handleCompZoneDragLeave); 
            t.addEventListener('drop', handleCompZoneDrop); 
        }); 
        console.log("Listeners D&D Ex2 activés.");
    }
    
    function removeDragListenersEx2() { 
        draggablesComp?.forEach(d => { 
            d.setAttribute('draggable','false'); 
            d.style.cursor='default'; 
            d.removeEventListener('dragstart', handleCompDragStart); 
            d.removeEventListener('dragend', handleCompDragEnd); 
        }); 
        
        const allTargets = [...(dropzonesComp || []), compListContainer]; 
        allTargets.forEach(t => { 
            if(!t) return; 
            t.removeEventListener('dragover', handleCompZoneDragOver); 
            t.removeEventListener('dragleave', handleCompZoneDragLeave); 
            t.removeEventListener('drop', handleCompZoneDrop); 
        }); 
        console.log("Listeners D&D Ex2 désactivés.");
    }
        
    function handleValidateEx2() { 
        let currentAttemptScoreEx2 = 0; 
        let feedbackHtml = 'Résultats :<br>'; 
        let allComponentsPlacedInDropzones = true; 
        let perfect = true; 
        
        if (compListContainer?.querySelectorAll('.draggable-comp').length > 0) { 
            allComponentsPlacedInDropzones = false; 
        } 
        
        dropzonesComp.forEach(zone => { 
            const comp = zone.querySelector('.draggable-comp'); 
            const correctCompId = zone.dataset.correctComp; 
            if (comp) { 
                const isCorrect = comp.id === correctCompId; 
                if (isCorrect) { 
                    currentAttemptScoreEx2++; 
                    comp.classList.add('correct'); 
                } else { 
                    perfect = false; 
                    comp.classList.add('incorrect'); 
                } 
                feedbackHtml += `- ${zone.querySelector('p strong').textContent.replace('Fonction :', '').trim()} : ${isCorrect ? '✔️ Correct' : '❌ Incorrect'} (vous avez mis : ${comp.textContent})<br>`; 
            } else { 
                allComponentsPlacedInDropzones = false;
                perfect = false; 
                feedbackHtml += `- ${zone.querySelector('p strong').textContent.replace('Fonction :', '').trim()} : ⚠️ Vide.<br>`; 
            } 
        }); 
        
        if (!allComponentsPlacedInDropzones) { 
            if(feedbackEx2) { 
                feedbackEx2.innerHTML = '⚠️ Veuillez associer tous les composants aux fonctions.'; 
                feedbackEx2.className = 'feedback incorrect'; 
            } 
            return; 
        } 
        
        if (!validatedEx2) { 
            scoreEx2 = currentAttemptScoreEx2; 
            validatedEx2 = true; 
        } 
        
        if (feedbackEx2) { 
            feedbackEx2.innerHTML = feedbackHtml + `<strong>Score Exercice 2 : ${scoreEx2} / ${maxScoreEx2}</strong>`; 
            feedbackEx2.className = 'feedback ' + (perfect ? 'correct' : 'incorrect'); 
        } 
        
        if(validateEx2Btn) validateEx2Btn.disabled = true; 
        removeDragListenersEx2(); 
        if(nextEx3BtnEx2) nextEx3BtnEx2.classList.remove('hidden'); 
    }

    // --- Logique Exercice 3 ---
    let validateEx3Btn, feedbackEx3, formEx3, selectsEx3, validatedEx3;
    
    function initExercise3() { 
        console.log("Initialisation Exercice 3..."); 
        validateEx3Btn = document.getElementById('validate-ex3'); 
        feedbackEx3 = document.getElementById('feedback-ex3'); 
        formEx3 = document.getElementById('form-ex3'); 
        selectsEx3 = formEx3?.querySelectorAll('select'); 
        validatedEx3 = false; 
        scoreEx3 = 0; 
        
        selectsEx3?.forEach(select => { 
            select.disabled = false; 
            select.value = ""; 
            select.classList.remove('correct-answer', 'incorrect-answer'); 
        }); 
        
        if(feedbackEx3) feedbackEx3.innerHTML = "";

        if(validateEx3Btn) { 
            validateEx3Btn.disabled = false; 
            validateEx3Btn.removeEventListener('click', handleValidateEx3); 
            validateEx3Btn.addEventListener('click', handleValidateEx3); 
        } else { 
            console.error("Bouton Valider Ex3 non trouvé"); 
        } 
        
        if (moduleResultsDiv) moduleResultsDiv.classList.add('hidden'); 
    }
    
    function handleValidateEx3() { 
        console.log("Validation exercice 3"); 
        if (!formEx3 || !validateEx3Btn || !selectsEx3) return;
        
        const allAnswered = [...selectsEx3].every(select => select.value !== "");
        if (!allAnswered) {
            if (feedbackEx3) {
                feedbackEx3.innerHTML = "⚠️ Veuillez répondre à toutes les questions.";
                feedbackEx3.className = 'feedback incorrect';
            }
            return;
        }
        
        let scoreEx3Calculated = 0;
        let feedbackHtml = 'Résultats :<br>';
        
        selectsEx3.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            const isCorrect = selectedOption.dataset.correct === "true";
            select.classList.remove('correct-answer', 'incorrect-answer'); 
            select.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');
            if (isCorrect) scoreEx3Calculated++;
            
            const questionRow = select.closest('tr');
            const questionLabel = questionRow ? questionRow.cells[0].textContent.trim() : select.name;

            const selectedText = selectedOption.text;
            const correctOption = [...select.options].find(opt => opt.dataset.correct === "true");
            const correctText = correctOption ? correctOption.text : "Non défini";
            
            feedbackHtml += `- ${questionLabel} (${select.name.includes('_in') ? 'Entrée' : 'Sortie'}) : ${isCorrect ? '✔️ Correct' : `❌ Incorrect (vous avez mis : ${selectedText}, réponse attendue : ${correctText})`}<br>`;
        });
        
        if (!validatedEx3) {
            scoreEx3 = scoreEx3Calculated;
            validatedEx3 = true;
        }
        
        const isPerfect = scoreEx3 === maxScoreEx3;
        
        if (feedbackEx3) {
            feedbackEx3.innerHTML = feedbackHtml + `<strong>Score Exercice 3 : ${scoreEx3} / ${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (isPerfect ? 'correct' : 'incorrect');
        }
        
        validateEx3Btn.disabled = true;
        selectsEx3.forEach(select => select.disabled = true);
        
        displayModuleResults();
    }

    // == Affichage Leçon ==
    showLessonBtn?.addEventListener('click', () => {
        if (microCoursArticle) {
             microCoursArticle.classList.toggle('hidden');
             showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
        }
    });

    // == Initialisation Finale de la Page ==
    showSection(introductionSection);

    if (!document.getElementById('emoji-styles')) {
        const emojiStyles = document.createElement('style');
        emojiStyles.id = 'emoji-styles';
        emojiStyles.textContent = `
            .emoji-correct { color: #28a745; font-weight: bold; margin-right: 0.3em; }
            .emoji-incorrect { color: #dc3545; font-weight: bold; margin-right: 0.3em; }
            .feedback { margin-top: 15px; padding: 10px; border-radius: 5px; }
            .feedback.correct { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .feedback.incorrect { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
            .energy-form-table select.correct-answer { border: 2px solid green !important; background-color: #d1e7dd !important; }
            .energy-form-table select.incorrect-answer { border: 2px solid red !important; background-color: #f8d7da !important; }
            .etiquette-energie.correct, .draggable-comp.correct { border: 2px solid green !important; background-color: #d1e7dd !important; color: #0f5132 !important; }
            .etiquette-energie.incorrect, .draggable-comp.incorrect { border: 2px solid red !important; background-color: #f8d7da !important; color: #842029 !important;}
            .drop-zone-energie .etiquette-energie.correct { font-weight: bold; } 
        `;
        document.head.appendChild(emojiStyles);
    }

}); // Fin DOMContentLoaded