document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 11 ---");

    // --- Configuration ---
    const moduleId = 'module_11_materiaux';
    const maxScoreEx1 = 1; // QCM Propriétés
    const maxScoreEx2 = 4; // 4 associations Matériau/Fonction
    const maxScoreEx3 = 3; // 3 affirmations correctes sur 5 pour le QCM Impact
    const totalMaxScore = maxScoreEx1 + maxScoreEx2 + maxScoreEx3;
    let scoreEx1 = 0, scoreEx2 = 0, scoreEx3 = 0;

    // --- Références DOM ---
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
    let validateEx1Btn, feedbackEx1, qcmMat1Form, nextEx2BtnMat;
    // Ex2
    let validateEx2Btn, feedbackEx2, materialList, dropzonesComponent, draggablesMat, draggedMatItem, validatedEx2Mat = false, nextEx3BtnMat;
    // Ex3
    let validateEx3Btn, feedbackEx3, qcmMatImpactForm;

    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        
        const allSections = [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv];
        
        allSections.forEach(s => {
            if (s) { // Vérifie si la section existe dans le DOM
                if (s === sectionToShow) {
                    s.classList.remove('hidden');
                } else {
                    // Condition spéciale: si on affiche moduleResultsDiv, exercise3Section ne doit pas être cachée.
                    if (sectionToShow === moduleResultsDiv && s === exercise3Section) {
                        s.classList.remove('hidden'); // Assure que l'exo 3 reste visible
                    } else {
                        s.classList.add('hidden');
                    }
                }
            }
        });

        // Gérer la visibilité du bouton "Voir la leçon"
        // Ce bouton est structurellement DANS moduleResultsDiv (ou logiquement lié)
        if (moduleResultsDiv && !moduleResultsDiv.classList.contains('hidden')) {
            showLessonBtn?.classList.remove('hidden');
        } else {
            showLessonBtn?.classList.add('hidden');
        }
    }

    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod11: Score=${currentScore}/${totalMaxScore}`);
        if (moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if (moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        
        showSection(moduleResultsDiv); // Ceci va maintenant aussi garder exercise3Section visible.
        
        if (microCoursArticle?.classList.contains('hidden')) {
            if (showLessonBtn) showLessonBtn.textContent = 'Voir la leçon';
        } else {
            if (showLessonBtn) showLessonBtn.textContent = 'Cacher la leçon';
        }
        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
            console.error("Fonction enregistrerScore non trouvée.");
        }
    }

    // --- Initialisation Différée ---
    function initExercise1() {
        console.log("Init Ex1 Mod11");
        validateEx1Btn = document.getElementById('validate-ex1');
        feedbackEx1 = document.getElementById('feedback-ex1');
        qcmMat1Form = document.getElementById('qcm-mat-1');
        scoreEx1 = 0;
        qcmMat1Form?.reset();
        qcmMat1Form?.querySelectorAll('input').forEach(r => {
            r.disabled = false;
            r.closest('label')?.classList.remove('correct-answer', 'incorrect-answer');
        });
        if (feedbackEx1) {
            feedbackEx1.innerHTML = '';
            feedbackEx1.className = 'feedback';
        }
        if (validateEx1Btn) {
            validateEx1Btn.disabled = false;
            validateEx1Btn.removeEventListener('click', handleValidateEx1Mat);
            validateEx1Btn.addEventListener('click', handleValidateEx1Mat);
        }
        if (nextEx2BtnMat) {
            nextEx2BtnMat.classList.add('hidden');
        }
    }

    function initExercise2() {
        console.log("Init Ex2 Mod11");
        validateEx2Btn = document.getElementById('validate-ex2');
        feedbackEx2 = document.getElementById('feedback-ex2');
        materialList = document.getElementById('material-list');
        dropzonesComponent = document.querySelectorAll('.dropzone-mat');
        
        if (materialList) {
            draggablesMat = materialList.querySelectorAll('.draggable-mat');
            draggablesMat?.forEach(d => {
                materialList.appendChild(d);
                d.classList.remove('correct', 'incorrect', 'dragging');
                d.setAttribute('draggable', 'true');
                d.style.cursor = 'grab';
            });
        }

        validatedEx2Mat = false;
        scoreEx2 = 0;

        dropzonesComponent?.forEach(dz => {
            const child = dz.querySelector('.draggable-mat');
            if (child) dz.removeChild(child);
            dz.classList.remove('over');
            const p = dz.querySelector('p');
            dz.innerHTML = '';
            if (p) dz.appendChild(p);
        });

        if (feedbackEx2) {
            feedbackEx2.innerHTML = '';
            feedbackEx2.className = 'feedback';
        }
        if (validateEx2Btn) {
            validateEx2Btn.disabled = false;
            validateEx2Btn.removeEventListener('click', handleValidateEx2Mat);
            validateEx2Btn.addEventListener('click', handleValidateEx2Mat);
        }

        if (!nextEx3BtnMat && exercise2Section && validateEx2Btn) {
            nextEx3BtnMat = document.createElement('button');
            nextEx3BtnMat.id = 'next-ex3-mat';
            nextEx3BtnMat.textContent = "Passer à l'exercice 3";
            nextEx3BtnMat.classList.add('hidden');
            nextEx3BtnMat.style.marginLeft = "10px";
            validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnMat);
            nextEx3BtnMat.addEventListener('click', () => {
                showSection(exercise3Section);
                initExercise3();
                nextEx3BtnMat.classList.add('hidden');
            });
        }
        if (nextEx3BtnMat) {
            nextEx3BtnMat.classList.add('hidden');
        }
        addDragListenersEx2Mat();
    }

    function initExercise3() {
        console.log("Init Ex3 Mod11");
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        qcmMatImpactForm = document.getElementById('qcm-mat-impact');
        scoreEx3 = 0;
        qcmMatImpactForm?.reset();
        qcmMatImpactForm?.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.disabled = false;
            cb.closest('label')?.classList.remove('correct-answer', 'incorrect-answer');
        });
        if (feedbackEx3) {
            feedbackEx3.innerHTML = '';
            feedbackEx3.className = 'feedback';
        }
        if (validateEx3Btn) {
            validateEx3Btn.disabled = false;
            validateEx3Btn.removeEventListener('click', handleValidateEx3Mat);
            validateEx3Btn.addEventListener('click', handleValidateEx3Mat);
        }
        // Important: Cache la section des résultats si on réinitialise l'exercice 3
        // et que l'utilisateur n'a pas encore validé à nouveau.
        if (moduleResultsDiv) moduleResultsDiv.classList.add('hidden');
        showLessonBtn?.classList.add('hidden'); // Le bouton leçon est lié aux résultats
        microCoursArticle?.classList.add('hidden');
    }

    // --- Handlers ---
    function handleStartClick() {
        if (startExercisesBtn) startExercisesBtn.disabled = true;
        introductionSection?.classList.add('hidden');
        showSection(exercise1Section);
        initExercise1();
    }

    // == Exercice 1 ==
    function handleValidateEx1Mat() {
        const selected = qcmMat1Form?.querySelector('input[name="q1_mat"]:checked');
        if (!selected) {
            if (feedbackEx1) {
                feedbackEx1.textContent = "Veuillez choisir une réponse.";
                feedbackEx1.className = "feedback incorrect";
            }
            return;
        }
        const isOk = selected.dataset.correct === 'true';
        scoreEx1 = isOk ? maxScoreEx1 : 0;
        if (feedbackEx1) {
            feedbackEx1.innerHTML = `${isOk ? '<span class="emoji-correct">✔️</span> Correct' : '<span class="emoji-incorrect">❌</span> Incorrect'}. Le boîtier doit avant tout être isolant électriquement et résistant aux chocs.`;
            feedbackEx1.className = 'feedback ' + (isOk ? 'correct' : 'incorrect');
        }
        if(validateEx1Btn) validateEx1Btn.disabled = true;
        qcmMat1Form?.querySelectorAll('input').forEach(r => r.disabled = true);

        if (!nextEx2BtnMat && exercise1Section && validateEx1Btn) {
            nextEx2BtnMat = document.createElement('button');
            nextEx2BtnMat.id = 'next-ex2-mat';
            nextEx2BtnMat.textContent = "Passer à l'exercice 2";
            nextEx2BtnMat.style.marginLeft = "10px";
            nextEx2BtnMat.addEventListener('click', () => {
                showSection(exercise2Section);
                initExercise2();
                if (nextEx2BtnMat) nextEx2BtnMat.classList.add('hidden');
            });
            validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnMat);
        }
        if (nextEx2BtnMat) nextEx2BtnMat.classList.remove('hidden');
    }

    // == Exercice 2 ==
    const correctMatchesMat = { "mat_plastique": "comp_boitier", "mat_cuivre": "comp_circuits", "mat_lithium": "comp_batterie", "mat_gel": "comp_electrodes_contact" };

    function handleMatDragStart(e) {
        draggedMatItem = e.target.closest('.draggable-mat');
        if (draggedMatItem) {
            setTimeout(() => { if (draggedMatItem) draggedMatItem.classList.add('dragging'); }, 0);
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', draggedMatItem.id); } catch (err) { console.warn("setData error:", err); }
        } else {
            e.preventDefault();
        }
    }
    function handleMatDragEnd() {
        if (draggedMatItem) draggedMatItem.classList.remove('dragging');
        draggedMatItem = null;
    }
    function handleDropzoneMatDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('over');
    }
    function handleDropzoneMatDragOver(e) {
        e.preventDefault();
        const targetZone = e.currentTarget;
        const existingItem = targetZone.querySelector('.draggable-mat');
        if (targetZone === materialList || !existingItem || existingItem === draggedMatItem) {
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    }
    function handleDropzoneMatDragLeave(e) {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('over');
        } else if (!e.relatedTarget) {
            e.currentTarget.classList.remove('over');
        }
    }
    function handleDropzoneMatDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('over');
        if (draggedMatItem) {
            const targetZone = e.currentTarget;
            const existingItemInTarget = targetZone.querySelector('.draggable-mat');

            if (targetZone.classList.contains('dropzone-mat')) {
                if (existingItemInTarget && existingItemInTarget !== draggedMatItem) {
                    materialList?.appendChild(existingItemInTarget);
                }
                targetZone.appendChild(draggedMatItem);
            } else if (targetZone === materialList) {
                 materialList.appendChild(draggedMatItem);
            }
        }
    }

    function addDragListenersEx2Mat() {
        draggablesMat = materialList?.querySelectorAll('.draggable-mat');
        draggablesMat?.forEach(d => {
            d.setAttribute('draggable', 'true');
            d.style.cursor = 'grab';
            d.removeEventListener('dragstart', handleMatDragStart);
            d.addEventListener('dragstart', handleMatDragStart);
            d.removeEventListener('dragend', handleMatDragEnd);
            d.addEventListener('dragend', handleMatDragEnd);
        });
        const allDropTargets = [...(dropzonesComponent || []), materialList];
        allDropTargets.forEach(target => {
            if (!target) return;
            target.removeEventListener('dragenter', handleDropzoneMatDragEnter);
            target.addEventListener('dragenter', handleDropzoneMatDragEnter);
            target.removeEventListener('dragover', handleDropzoneMatDragOver);
            target.addEventListener('dragover', handleDropzoneMatDragOver);
            target.removeEventListener('dragleave', handleDropzoneMatDragLeave);
            target.addEventListener('dragleave', handleDropzoneMatDragLeave);
            target.removeEventListener('drop', handleDropzoneMatDrop);
            target.addEventListener('drop', handleDropzoneMatDrop);
        });
    }

    function removeDragListenersEx2Mat() {
        draggablesMat?.forEach(d => {
            d.setAttribute('draggable', 'false');
            d.style.cursor = 'default';
            d.removeEventListener('dragstart', handleMatDragStart);
            d.removeEventListener('dragend', handleMatDragEnd);
        });
        const allDropTargets = [...(dropzonesComponent || []), materialList];
        allDropTargets.forEach(target => {
            if (!target) return;
            target.removeEventListener('dragenter', handleDropzoneMatDragEnter);
            target.removeEventListener('dragover', handleDropzoneMatDragOver);
            target.removeEventListener('dragleave', handleDropzoneMatDragLeave);
            target.removeEventListener('drop', handleDropzoneMatDrop);
        });
    }

    function handleValidateEx2Mat() {
        scoreEx2 = 0;
        let perfect = true;
        let feedback = "Résultats de l'association Matériau/Fonction :<br>";
        let allFilled = true;

        dropzonesComponent.forEach(zone => {
            if (!zone.querySelector('.draggable-mat')) {
                allFilled = false;
            }
        });

        if (!allFilled) {
            if (feedbackEx2) {
                feedbackEx2.innerHTML = "⚠️ Veuillez associer tous les matériaux à une fonction.";
                feedbackEx2.className = "feedback incorrect";
            }
            return;
        }

        dropzonesComponent.forEach(zone => {
            const droppedMaterial = zone.querySelector('.draggable-mat');
            const zoneTextElement = zone.querySelector('p strong');
            const zoneText = zoneTextElement ? zoneTextElement.textContent : "Zone inconnue";
            
            if (droppedMaterial) {
                const isCorrect = correctMatchesMat[droppedMaterial.id] === zone.id;
                if (isCorrect) {
                    scoreEx2++;
                    droppedMaterial.classList.add('correct');
                    droppedMaterial.classList.remove('incorrect');
                    feedback += `- ${zoneText}: <span class="emoji-correct">✔️</span> Correct (${droppedMaterial.textContent}).<br>`;
                } else {
                    perfect = false;
                    droppedMaterial.classList.add('incorrect');
                    droppedMaterial.classList.remove('correct');
                    feedback += `- ${zoneText}: <span class="emoji-incorrect">❌</span> Incorrect (vous avez mis ${droppedMaterial.textContent}).<br>`;
                }
            } else {
                perfect = false;
                feedback += `- ${zoneText}: <span class="emoji-incorrect">❌</span> Vide.<br>`;
            }
        });

        if (feedbackEx2) {
            feedbackEx2.innerHTML = feedback + `<strong>Score: ${scoreEx2}/${maxScoreEx2}</strong>`;
            feedbackEx2.className = 'feedback ' + (perfect ? 'correct' : 'incorrect');
        }
        if(validateEx2Btn) validateEx2Btn.disabled = true;
        removeDragListenersEx2Mat();
        if (nextEx3BtnMat) nextEx3BtnMat.classList.remove('hidden');
    }


    // == Exercice 3 ==
    function handleValidateEx3Mat() {
        scoreEx3 = 0;
        let correctChecks = 0;
        let incorrectChecks = 0;
        let feedbackHtml = "Résultats de l'impact environnemental :<br>";
        const checkboxes = qcmMatImpactForm?.querySelectorAll('input[name="q3_impact"]');

        if (!checkboxes || !feedbackEx3 || !validateEx3Btn) return;

        checkboxes.forEach(cb => {
            const isCorrectChoice = cb.dataset.correct === 'true';
            const label = cb.closest('label');
            label?.classList.remove('correct-answer', 'incorrect-answer');
            const labelText = label ? label.textContent.trim() : "Option inconnue";

            if (cb.checked) {
                if (isCorrectChoice) {
                    correctChecks++;
                    label?.classList.add('correct-answer');
                    feedbackHtml += `- "${labelText}": <span class="emoji-correct">✔️</span> Correct.<br>`;
                } else {
                    incorrectChecks++;
                    label?.classList.add('incorrect-answer');
                    feedbackHtml += `- "${labelText}": <span class="emoji-incorrect">❌</span> Incorrect.<br>`;
                }
            } else {
                if (isCorrectChoice) {
                    feedbackHtml += `- "${labelText}": ⚠️ Non coché (était une bonne réponse).<br>`;
                    label?.classList.add('incorrect-answer');
                }
            }
            cb.disabled = true;
        });

        let pointsFromCorrect = correctChecks;
        let penalty = Math.floor(incorrectChecks / 2);
        
        scoreEx3 = Math.max(0, pointsFromCorrect - penalty);
        scoreEx3 = Math.min(scoreEx3, maxScoreEx3);

        // Afficher la correction et le score pour l'exercice 3
        feedbackEx3.innerHTML = feedbackHtml + `<strong>Score pour l'Exercice 3 : ${scoreEx3}/${maxScoreEx3}</strong>`;
        feedbackEx3.className = 'feedback ' + (scoreEx3 >= Math.ceil(maxScoreEx3 * 2/3) && incorrectChecks <= 1 ? 'correct' : 'incorrect');
        
        if(validateEx3Btn) validateEx3Btn.disabled = true;
        
        // Afficher les résultats globaux du module (qui apparaîtront sous l'exercice 3 car exercise3Section reste visible)
        displayModuleResults();
    }

    // == Affichage Leçon ==
    function toggleLessonVisibility() {
        if (microCoursArticle && showLessonBtn) {
            microCoursArticle.classList.toggle('hidden');
            showLessonBtn.textContent = microCoursArticle.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
        }
    }
    if (showLessonBtn && microCoursArticle) {
        showLessonBtn.removeEventListener('click', toggleLessonVisibility);
        showLessonBtn.addEventListener('click', toggleLessonVisibility);
    }

    // == Initialisation Finale ==
    showSection(introductionSection); // Affiche l'intro, cache le reste
    if (startExercisesBtn) {
        startExercisesBtn.removeEventListener('click', handleStartClick);
        startExercisesBtn.addEventListener('click', handleStartClick);
    }

}); // Fin DOMContentLoaded