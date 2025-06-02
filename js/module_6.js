document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 6 ---");

    const moduleId = 'module_6_diagnostic';
    const maxScoreEx1 = 1; // QCM unique
    const maxScoreEx2 = 4; // 4 associations
    const maxScoreEx3 = 4; // 4 Vrai/Faux
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

    let validateEx1Btn, feedbackEx1, qcmDiag1Form, nextEx2BtnDiag;
    let validateEx2Btn, feedbackEx2, draggablesDiag, dropzonesDiag, problemListDiag, draggedDiagItem, nextEx3BtnDiag;
    let validatedEx2Diag = false;
    let validateEx3Btn, feedbackEx3, tfDiagForm;
    let validatedEx3Diag = false;

    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv, microCoursArticle].forEach(s => s?.classList.add('hidden'));
        sectionToShow?.classList.remove('hidden');
    }

    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod6: Score=${currentScore}/${totalMaxScore}`);
        if (moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if (moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        moduleResultsDiv?.classList.remove('hidden');
        showLessonBtn?.classList.remove('hidden');
        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
            console.error("Fonction enregistrerScore non trouvée.");
        }
    }

    function initExercise1() {
        console.log("Init Ex1 Mod6 (QCM)");
        qcmDiag1Form = document.getElementById('qcm-diag-1');
        validateEx1Btn = document.getElementById('validate-ex1');
        feedbackEx1 = document.getElementById('feedback-ex1');
        scoreEx1 = 0;

        qcmDiag1Form?.reset();
        qcmDiag1Form?.querySelectorAll('input[type="radio"]').forEach(r => {
            r.disabled = false;
            const label = r.closest('label');
            if (label) label.classList.remove('correct-answer', 'incorrect-answer');
        });

        if (feedbackEx1) {
            feedbackEx1.innerHTML = '';
            feedbackEx1.className = 'feedback';
        }
        if (validateEx1Btn) {
            validateEx1Btn.disabled = false;
            validateEx1Btn.removeEventListener('click', handleValidateEx1Diag);
            validateEx1Btn.addEventListener('click', handleValidateEx1Diag);
        }
        if (nextEx2BtnDiag) nextEx2BtnDiag.classList.add('hidden');
    }

    function initExercise2() {
        console.log("Init Ex2 Mod6 (Associer)");
        validateEx2Btn = document.getElementById('validate-ex2');
        feedbackEx2 = document.getElementById('feedback-ex2');
        draggablesDiag = document.querySelectorAll('.draggable-diag');
        dropzonesDiag = document.querySelectorAll('.dropzone-diag');
        problemListDiag = document.querySelector('.problem-list-diag');
        draggedDiagItem = null;
        validatedEx2Diag = false;
        scoreEx2 = 0;

        draggablesDiag.forEach(d => {
            problemListDiag.appendChild(d);
            d.classList.remove('dragging', 'correct', 'incorrect');
            d.setAttribute('draggable', 'true');
            d.style.cursor = 'grab';
        });
        dropzonesDiag.forEach(dz => {
            const existingP = dz.querySelector('p'); // Conserver le <p><strong>Action :</strong>...</p>
            dz.innerHTML = ''; 
            if (existingP) dz.appendChild(existingP);
            dz.classList.remove('over');
        });

        if (feedbackEx2) {
            feedbackEx2.innerHTML = '';
            feedbackEx2.className = 'feedback';
        }
        if (validateEx2Btn) {
            validateEx2Btn.disabled = false;
            validateEx2Btn.removeEventListener('click', handleValidateEx2Diag);
            validateEx2Btn.addEventListener('click', handleValidateEx2Diag);
        }
        addDragListenersEx2Diag();
        if (nextEx3BtnDiag) nextEx3BtnDiag.classList.add('hidden');
    }

    function initExercise3() {
        console.log("Init Ex3 Mod6 (Vrai/Faux)");
        tfDiagForm = document.getElementById('tf-diag-form');
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        validatedEx3Diag = false;
        scoreEx3 = 0;

        tfDiagForm?.reset();
        tfDiagForm?.querySelectorAll('input[type="radio"]').forEach(r => {
            r.disabled = false;
            const label = r.closest('label');
            if (label) label.classList.remove('correct-answer', 'incorrect-answer');
        });
        if (feedbackEx3) {
            feedbackEx3.innerHTML = '';
            feedbackEx3.className = 'feedback';
        }
        if (validateEx3Btn) {
            validateEx3Btn.disabled = false;
            validateEx3Btn.removeEventListener('click', handleValidateEx3Diag);
            validateEx3Btn.addEventListener('click', handleValidateEx3Diag);
        }
        if (moduleResultsDiv) moduleResultsDiv.classList.add('hidden');
        showLessonBtn?.classList.add('hidden');
        microCoursArticle?.classList.add('hidden');
    }

    function handleStartClick() {
        if (startExercisesBtn) startExercisesBtn.disabled = true;
        if (introductionSection) introductionSection.classList.add('hidden');
        if (exercise1Section) {
            showSection(exercise1Section);
            initExercise1();
        }
    }

    function handleNextEx2ClickDiag() {
        if (nextEx2BtnDiag) nextEx2BtnDiag.classList.add('hidden');
        showSection(exercise2Section);
        initExercise2();
    }
    
    function handleNextEx3ClickDiag() {
        if (nextEx3BtnDiag) nextEx3BtnDiag.classList.add('hidden');
        showSection(exercise3Section);
        initExercise3();
    }

    function handleValidateEx1Diag() {
        scoreEx1 = 0;
        let feedbackHtml = "Résultat Ex 1:<br>";
        let allOk = true;
        const selectedRadio = qcmDiag1Form.querySelector('input[name="q1_diag"]:checked');

        if (!selectedRadio) {
            if (feedbackEx1) {
                feedbackEx1.innerHTML = "⚠️ Veuillez sélectionner une réponse.";
                feedbackEx1.className = 'feedback incorrect';
            }
            return;
        }

        const isCorrect = selectedRadio.dataset.correct === 'true';
        const selectedLabel = selectedRadio.closest('label');

        if (isCorrect) {
            scoreEx1++;
            feedbackHtml += `<span class="emoji-correct">✔️</span> Bonne réponse !`;
            if (selectedLabel) selectedLabel.classList.add('correct-answer');
        } else {
            allOk = false;
            const correctRadio = qcmDiag1Form.querySelector('input[name="q1_diag"][data-correct="true"]');
            const correctLabelText = correctRadio ? correctRadio.closest('label').textContent : "N/A";
            feedbackHtml += `<span class="emoji-incorrect">❌</span> Mauvaise réponse. La bonne réponse était : "${correctLabelText}"`;
            if (selectedLabel) selectedLabel.classList.add('incorrect-answer');
            if (correctRadio && correctRadio.closest('label')) correctRadio.closest('label').classList.add('correct-answer');
        }

        qcmDiag1Form.querySelectorAll('input[name="q1_diag"]').forEach(r => r.disabled = true);
        if (feedbackEx1) {
            feedbackEx1.innerHTML = feedbackHtml + `<br><strong>Score: ${scoreEx1}/${maxScoreEx1}</strong>`;
            feedbackEx1.className = 'feedback ' + (allOk ? 'correct' : 'incorrect');
        }
        validateEx1Btn.disabled = true;

        if (!nextEx2BtnDiag) {
            nextEx2BtnDiag = document.createElement('button');
            nextEx2BtnDiag.id = 'next-ex2-diag-btn';
            nextEx2BtnDiag.textContent = "Passer à l'exercice 2";
            nextEx2BtnDiag.style.marginLeft = "10px";
            nextEx2BtnDiag.addEventListener('click', handleNextEx2ClickDiag);
            validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnDiag);
        }
        nextEx2BtnDiag.classList.remove('hidden');
    }

    function handleDiagDragStart(e) {
        draggedDiagItem = e.target.closest('.draggable-diag');
        if (draggedDiagItem) {
            setTimeout(() => { if (draggedDiagItem) draggedDiagItem.classList.add('dragging'); }, 0);
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', draggedDiagItem.id); } catch (err) {}
        } else { e.preventDefault(); }
    }
    function handleDiagDragEnd() {
        if (draggedDiagItem) draggedDiagItem.classList.remove('dragging');
        draggedDiagItem = null;
    }
    function handleDiagZoneDragEnter(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
    function handleDiagZoneDragOver(e) {
        e.preventDefault();
        const targetZone = e.currentTarget;
        const existingItem = targetZone.querySelector('.draggable-diag');
        if (targetZone === problemListDiag || (targetZone.classList.contains('dropzone-diag') && (!existingItem || existingItem === draggedDiagItem))) {
            e.dataTransfer.dropEffect = 'move';
        } else { e.dataTransfer.dropEffect = 'none'; }
    }
    function handleDiagZoneDragLeave(e) {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget) || !e.relatedTarget) {
            e.currentTarget.classList.remove('over');
        }
    }
    function handleDiagZoneDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('over');
        if (draggedDiagItem) {
            const targetZone = e.currentTarget;
            const existingItemInTarget = targetZone.querySelector('.draggable-diag');

            if (targetZone.classList.contains('dropzone-diag')) {
                if (existingItemInTarget && existingItemInTarget !== draggedDiagItem) {
                    problemListDiag.appendChild(existingItemInTarget); // Renvoyer l'ancien item
                }
                targetZone.appendChild(draggedDiagItem); // Placer le nouveau
            } else if (targetZone === problemListDiag) {
                targetZone.appendChild(draggedDiagItem); // Retour à la source
            }
        }
    }
    function addDragListenersEx2Diag() {
        draggablesDiag.forEach(d => {
            d.removeEventListener('dragstart', handleDiagDragStart); d.addEventListener('dragstart', handleDiagDragStart);
            d.removeEventListener('dragend', handleDiagDragEnd); d.addEventListener('dragend', handleDiagDragEnd);
        });
        const allTargets = [...dropzonesDiag, problemListDiag];
        allTargets.forEach(t => {
            if (!t) return;
            t.removeEventListener('dragenter', handleDiagZoneDragEnter); t.addEventListener('dragenter', handleDiagZoneDragEnter);
            t.removeEventListener('dragover', handleDiagZoneDragOver); t.addEventListener('dragover', handleDiagZoneDragOver);
            t.removeEventListener('dragleave', handleDiagZoneDragLeave); t.addEventListener('dragleave', handleDiagZoneDragLeave);
            t.removeEventListener('drop', handleDiagZoneDrop); t.addEventListener('drop', handleDiagZoneDrop);
        });
    }
    function removeDragListenersEx2Diag() {
        draggablesDiag.forEach(d => {
            d.setAttribute('draggable', 'false'); d.style.cursor = 'default';
            d.removeEventListener('dragstart', handleDiagDragStart); d.removeEventListener('dragend', handleDiagDragEnd);
        });
        const allTargets = [...dropzonesDiag, problemListDiag];
        allTargets.forEach(t => {
            if (!t) return;
            t.removeEventListener('dragenter', handleDiagZoneDragEnter); t.removeEventListener('dragover', handleDiagZoneDragOver);
            t.removeEventListener('dragleave', handleDiagZoneDragLeave); t.removeEventListener('drop', handleDiagZoneDrop);
        });
    }

    function handleValidateEx2Diag() {
        let currentAttemptScoreEx2 = 0;
        let feedbackHtml = 'Résultats Ex 2:<br>';
        let allPlacedCorrectly = true;
        let allZonesFilled = true;

        dropzonesDiag.forEach(zone => {
            if (!zone.querySelector('.draggable-diag')) allZonesFilled = false;
        });

        if (!allZonesFilled) {
            if (feedbackEx2) {
                feedbackEx2.innerHTML = "⚠️ Veuillez associer chaque problème à une action.";
                feedbackEx2.className = 'feedback incorrect';
            }
            return;
        }

        dropzonesDiag.forEach(zone => {
            const problem = zone.querySelector('.draggable-diag');
            if(problem) problem.classList.remove('correct', 'incorrect');

            const correctProblemId = zone.dataset.correctProblem;
            const placedProblemId = problem ? problem.id : null;
            const solutionText = zone.querySelector('p strong').textContent;

            const isOk = placedProblemId === correctProblemId;
            if (isOk) {
                currentAttemptScoreEx2++;
                if(problem) problem.classList.add('correct');
            } else {
                allPlacedCorrectly = false;
                if(problem) problem.classList.add('incorrect');
            }
            const problemText = problem ? `"${document.getElementById(placedProblemId).textContent.substring(0,30)}..."` : "Aucun";
            feedbackHtml += `- ${solutionText} : ${isOk ? '✔️':'❌'} Associé à ${problemText}.<br>`;
        });
        
        if (!validatedEx2Diag) {
            scoreEx2 = currentAttemptScoreEx2;
            validatedEx2Diag = true;
        }
        if (feedbackEx2) {
            feedbackEx2.innerHTML = feedbackHtml + `<strong>Score: ${scoreEx2}/${maxScoreEx2}</strong>`;
            feedbackEx2.className = 'feedback ' + (allPlacedCorrectly && scoreEx2 === maxScoreEx2 ? 'correct' : 'incorrect');
        }
        validateEx2Btn.disabled = true;
        removeDragListenersEx2Diag();
        
        if (!nextEx3BtnDiag) {
            nextEx3BtnDiag = document.createElement('button');
            nextEx3BtnDiag.id = 'next-ex3-diag-btn';
            nextEx3BtnDiag.textContent = "Passer à l'exercice 3";
            nextEx3BtnDiag.style.marginLeft = "10px";
            nextEx3BtnDiag.addEventListener('click', handleNextEx3ClickDiag);
            validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnDiag);
        }
        nextEx3BtnDiag.classList.remove('hidden');
    }

    function handleValidateEx3Diag() {
        scoreEx3 = 0;
        let allOk = true;
        let feedback = "Résultats Ex 3:<br>";
        let allAnswered = true;
        const questions = tfDiagForm ? Array.from(new Set(Array.from(tfDiagForm.querySelectorAll('input[type="radio"]')).map(r => r.name))) : [];

        if (!tfDiagForm) return;
        questions.forEach(name => {
            const selected = tfDiagForm.querySelector(`input[name="${name}"]:checked`);
            tfDiagForm.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                const label = r.closest('label');
                if (label) label.classList.remove('correct-answer', 'incorrect-answer');
            });
            if (!selected) allAnswered = false;
        });

        if (!allAnswered) {
            if (feedbackEx3) {
                feedbackEx3.innerHTML = "⚠️ Veuillez répondre à toutes les questions.";
                feedbackEx3.className = 'feedback incorrect';
            }
            return;
        }

        questions.forEach((name) => {
            const statementP = tfDiagForm.querySelector(`input[name="${name}"]`).closest('.tf-statement').querySelector('p').textContent;
            const selected = tfDiagForm.querySelector(`input[name="${name}"]:checked`);
            const correctRadio = tfDiagForm.querySelector(`input[name="${name}"][data-correct="true"]`);
            const selectedLabel = selected.closest('label');
            const correctLabel = correctRadio.closest('label');

            const isCorrect = selected.dataset.correct === 'true';
            if (isCorrect) {
                scoreEx3++;
                if(selectedLabel) selectedLabel.classList.add('correct-answer');
            } else {
                allOk = false;
                if(selectedLabel) selectedLabel.classList.add('incorrect-answer');
                if(correctLabel) correctLabel.classList.add('correct-answer');
            }
            feedback += `- ${statementP.substring(3,50)}... : ${isCorrect ? '✔️ Correct':'❌ Incorrect'}<br>`; // substring(3) pour enlever "X. "
            tfDiagForm.querySelectorAll(`input[name="${name}"]`).forEach(r => r.disabled = true);
        });

        if (feedbackEx3) {
            feedbackEx3.innerHTML = feedback + `<strong>Score: ${scoreEx3}/${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback ' + (allOk ? 'correct' : 'incorrect');
        }
        validatedEx3Diag = true;
        validateEx3Btn.disabled = true;
        displayModuleResults();
    }

    showLessonBtn?.addEventListener('click', () => {
        microCoursArticle?.classList.remove('hidden');
        showLessonBtn.classList.add('hidden');
    });

    showSection(introductionSection);
    if (startExercisesBtn) {
        startExercisesBtn.removeEventListener('click', handleStartClick);
        startExercisesBtn.addEventListener('click', handleStartClick);
    }

    if (!document.getElementById('emoji-styles')) {
        const style = document.createElement('style');
        style.id = 'emoji-styles';
        style.innerHTML = `
            .emoji-correct { color: green; }
            .emoji-incorrect { color: red; }
            label.correct-answer { background-color: #d1e7dd !important; font-weight: bold; border: 1px solid green; padding: 2px 4px; border-radius:3px;}
            label.incorrect-answer { background-color: #f8d7da !important; border: 1px solid darkred; padding: 2px 4px; border-radius:3px;}
        `;
        document.head.appendChild(style);
    }
});