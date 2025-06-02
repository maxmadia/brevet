document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 9 ---");

    // --- Configuration ---
    const moduleId = 'module_9_tests';
    const maxScoreEx1 = 1, maxScoreEx2 = 4, maxScoreEx3 = 7; // 1pt par étape bien placée
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
    let validateEx1Btn, feedbackEx1, qcmTest1Form, nextEx2BtnTest;
    // Ex2
    let validateEx2Btn, feedbackEx2, testTypeList, dropzonesTest, draggablesTest, draggedTestItem = null, validatedEx2Test = false, nextEx3BtnTest;
    // Ex3
    let validateEx3Btn, feedbackEx3, protocolStepList, draggedProtocolStep = null;

    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section, exercise3Section, moduleResultsDiv].forEach(s => s?.classList.add('hidden'));
        sectionToShow?.classList.remove('hidden');
        // Gérer la visibilité du bouton "Voir la leçon" uniquement si la section des résultats n'est pas celle affichée
        // Car showFinalResultsAndLessonButton s'en chargera spécifiquement pour la section des résultats.
        if (sectionToShow !== moduleResultsDiv) {
            showLessonBtn?.classList.add('hidden');
        }
    }

    function showFinalResultsAndLessonButton() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod9: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;

        moduleResultsDiv?.classList.remove('hidden'); // Afficher la section des résultats

        if (microCoursArticle?.classList.contains('hidden')) {
            if(showLessonBtn) showLessonBtn.textContent = 'Voir la leçon';
        } else {
            if(showLessonBtn) showLessonBtn.textContent = 'Cacher la leçon';
        }
        showLessonBtn?.classList.remove('hidden'); // Afficher le bouton "Voir la leçon"

        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
            console.error("Fonction enregistrerScore non trouvée.");
        }
    }

    // --- Initialisation Différée ---
    function initExercise1() {
        console.log("Init Ex1 Mod9");
        validateEx1Btn = document.getElementById('validate-ex1');
        feedbackEx1 = document.getElementById('feedback-ex1');
        qcmTest1Form = document.getElementById('qcm-test-1');
        scoreEx1 = 0;
        qcmTest1Form?.reset();
        qcmTest1Form?.querySelectorAll('input').forEach(r => {
            r.disabled = false;
            r.closest('label')?.classList.remove('correct-answer','incorrect-answer');
        });
        if(feedbackEx1) {
            feedbackEx1.innerHTML = '';
            feedbackEx1.className = 'feedback';
        }
        if(validateEx1Btn) {
            validateEx1Btn.disabled = false;
            validateEx1Btn.removeEventListener('click', handleValidateEx1Test);
            validateEx1Btn.addEventListener('click', handleValidateEx1Test);
        }

        if (nextEx2BtnTest) {
            nextEx2BtnTest.classList.add('hidden');
        } else {
            nextEx2BtnTest = document.createElement('button');
            nextEx2BtnTest.id = 'next-ex2-test';
            nextEx2BtnTest.textContent = "Passer à l'exercice 2";
            nextEx2BtnTest.style.marginLeft="10px";
            nextEx2BtnTest.classList.add('hidden');
            nextEx2BtnTest.addEventListener('click', () => {
                showSection(exercise2Section);
                initExercise2();
                nextEx2BtnTest.classList.add('hidden');
            });

            if (validateEx1Btn) {
                validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnTest);
            }
        }
    }

    function initExercise2() {
        console.log("Init Ex2 Mod9");
        validateEx2Btn = document.getElementById('validate-ex2');
        feedbackEx2 = document.getElementById('feedback-ex2');
        testTypeList = document.getElementById('test-type-list');
        dropzonesTest = document.querySelectorAll('.dropzone-test');
        draggablesTest = testTypeList?.querySelectorAll('.draggable-test');
        validatedEx2Test = false;
        scoreEx2 = 0;
        draggablesTest?.forEach(d => {
            testTypeList.appendChild(d);
            d.classList.remove('correct','incorrect','dragging');
            d.setAttribute('draggable','true');
            d.style.cursor='grab';
        });
        dropzonesTest?.forEach(dz => {
            const child = dz.querySelector('.draggable-test');
            if(child) dz.removeChild(child); // S'assurer que la dropzone est vide
            dz.classList.remove('over');
            // Restaurer le paragraphe de description s'il a été retiré
            const pOriginalText = dz.dataset.originalText; // On stockera le texte original dans un dataset
            if (pOriginalText && !dz.querySelector('p')) {
                const p = document.createElement('p');
                p.innerHTML = pOriginalText; // ou juste le contenu pertinent
                dz.appendChild(p);
            } else if (dz.children.length > 1 && dz.querySelector('.draggable-test')) {
                // S'il y a un draggable ET autre chose, on reconstruit proprement
                const pElement = dz.querySelector('p:first-child');
                dz.innerHTML = ''; // Vider
                if(pElement) dz.appendChild(pElement); // Remettre le p
            }

        });
        // Stocker le texte original des dropzones si pas déjà fait
        dropzonesTest?.forEach(dz => {
            if (!dz.dataset.originalText) {
                const p = dz.querySelector('p:first-child');
                if (p) dz.dataset.originalText = p.innerHTML;
            }
        });

        if(feedbackEx2) {
            feedbackEx2.innerHTML = '';
            feedbackEx2.className = 'feedback';
        }
        if(validateEx2Btn) {
            validateEx2Btn.disabled = false;
            validateEx2Btn.removeEventListener('click', handleValidateEx2Test);
            validateEx2Btn.addEventListener('click', handleValidateEx2Test);
        }

        if (nextEx3BtnTest) {
            nextEx3BtnTest.classList.add('hidden');
        } else {
            nextEx3BtnTest = document.createElement('button');
            nextEx3BtnTest.id = 'next-ex3-test';
            nextEx3BtnTest.textContent = "Passer à l'exercice 3";
            nextEx3BtnTest.classList.add('hidden');
            nextEx3BtnTest.style.marginLeft="10px";

            if (validateEx2Btn) {
                validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnTest);
            }

            nextEx3BtnTest.addEventListener('click', () => {
                showSection(exercise3Section);
                initExercise3();
                nextEx3BtnTest.classList.add('hidden');
            });
        }

        addDragListenersEx2Test();
    }

    function initExercise3() {
        console.log("Init Ex3 Mod9");
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        protocolStepList = document.getElementById('protocol-step-list');
        scoreEx3 = 0;
        if(protocolStepList) {
            // Mélanger les enfants de la liste
            const listItems = Array.from(protocolStepList.children);
            listItems.forEach(item => protocolStepList.removeChild(item)); // Retirer tous les items
            for (let i = listItems.length; i >= 0; i--) { // Remettre dans un ordre aléatoire
                 if(listItems.length > 0) protocolStepList.appendChild(listItems.splice(Math.random() * listItems.length | 0, 1)[0]);
            }
            Array.from(protocolStepList.children).forEach(li => {
                li.classList.remove('correct-step','incorrect-step','dragging');
                li.setAttribute('draggable','true');
                li.style.cursor='grab';
            });
        }
        if(feedbackEx3) {
            feedbackEx3.innerHTML = '';
            feedbackEx3.className = 'feedback';
        }
        if(validateEx3Btn) {
            validateEx3Btn.disabled = false;
            validateEx3Btn.removeEventListener('click', handleValidateEx3Test);
            validateEx3Btn.addEventListener('click', handleValidateEx3Test);
        }
        // Cacher les résultats du module et le bouton de leçon au début de l'exercice 3
        if (moduleResultsDiv) moduleResultsDiv.classList.add('hidden');
        showLessonBtn?.classList.add('hidden');
        microCoursArticle?.classList.add('hidden');
        addDragListenersEx3Test();
    }

    // --- Handlers ---
    function handleStartClick() {
        introductionSection?.classList.add('hidden');
        showSection(exercise1Section);
        initExercise1();
    }

    // == Exercice 1 ==
    function handleValidateEx1Test() {
        const selected = qcmTest1Form?.querySelector('input[name="q1_test"]:checked');
        if(!selected) {
            if(feedbackEx1) {
                feedbackEx1.textContent="Veuillez choisir une réponse.";
                feedbackEx1.className="feedback incorrect";
            }
            return;
        }
        const isOk = selected.dataset.correct === 'true';
        scoreEx1 = isOk ? maxScoreEx1 : 0;
        if(feedbackEx1) {
            feedbackEx1.innerHTML = isOk ? 'Correct ! La fiabilité, la sécurité et l\'efficacité sont primordiales.' : 'Incorrect. La raison principale est d\'assurer la fiabilité, la sécurité et l\'efficacité du DAE pour sauver des vies, conformément aux normes.';
            feedbackEx1.className = 'feedback '+(isOk?'correct':'incorrect');
        }
        validateEx1Btn.disabled = true;
        qcmTest1Form?.querySelectorAll('input').forEach(r => r.disabled = true);

        nextEx2BtnTest?.classList.remove('hidden');
    }

    // == Exercice 2 ==
    function handleTestDragStart(e) {
        draggedTestItem = e.target;
        if(draggedTestItem && draggedTestItem.classList.contains('draggable-test')) {
            setTimeout(() => {
                if(draggedTestItem) draggedTestItem.classList.add('dragging');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
            try {
                e.dataTransfer.setData('text/plain', draggedTestItem.id);
            } catch(err) {
                console.warn("Erreur setData (peut être normal sur certains navigateurs en mode fichier local):", err);
            }
        } else {
            e.preventDefault();
        }
    }

    function handleTestDragEnd(e) {
        if(draggedTestItem) draggedTestItem.classList.remove('dragging');
        draggedTestItem = null;
    }

    function handleDropzoneTestDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('over');
    }

    function handleDropzoneTestDragOver(e) {
        e.preventDefault();
        const targetZone = e.currentTarget;
        const existingItemInDropzone = targetZone.querySelector('.draggable-test');

        if (targetZone === testTypeList) { // Si on drague vers la liste de départ
             e.dataTransfer.dropEffect='move';
        } else if (targetZone.classList.contains('dropzone-test')) { // Si on drague vers une dropzone
            if (!existingItemInDropzone || existingItemInDropzone === draggedTestItem) {
                e.dataTransfer.dropEffect='move';
            } else {
                 e.dataTransfer.dropEffect='none'; // Zone déjà occupée par un autre item
            }
        } else {
            e.dataTransfer.dropEffect='none';
        }
    }

    function handleDropzoneTestDragLeave(e) {
        // S'assurer que l'élément quitté est bien le conteneur et non un enfant
        if (e.currentTarget.contains(e.relatedTarget)) return;
        e.currentTarget.classList.remove('over');
    }

    function handleDropzoneTestDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        if(draggedTestItem) {
            const targetZone = e.currentTarget; // Peut être une dropzone ou test-type-list
            const existingItemInDropzone = targetZone.querySelector('.draggable-test');

            if (targetZone.classList.contains('dropzone-test')) { // Si la cible est une dropzone
                if (existingItemInDropzone && existingItemInDropzone !== draggedTestItem) {
                    // Il y a déjà un item, on le renvoie à la liste
                    testTypeList?.appendChild(existingItemInDropzone);
                }
                // On retire le texte placeholder "Vérifie:" s'il n'y a que ça
                const pElement = targetZone.querySelector('p:first-child');
                if (pElement && targetZone.children.length === 1 && pElement.tagName === 'P') {
                     // Optionnel: cacher le p si on veut que seul l'item draggué soit visible
                }
                targetZone.appendChild(draggedTestItem);

            } else if (targetZone.id === 'test-type-list') { // Si la cible est la liste de départ
                targetZone.appendChild(draggedTestItem);
            }
        }
        e.currentTarget.classList.remove('over');
    }

    function addDragListenersEx2Test() {
        draggablesTest = document.querySelectorAll('#test-type-list .draggable-test, .dropzone-test .draggable-test');
        draggablesTest?.forEach(d => {
            d.setAttribute('draggable', 'true');
            d.style.cursor = 'grab';
            d.removeEventListener('dragstart', handleTestDragStart);
            d.addEventListener('dragstart', handleTestDragStart);
            d.removeEventListener('dragend', handleTestDragEnd);
            d.addEventListener('dragend', handleTestDragEnd);
        });

        const allDropTargets = [...(Array.from(dropzonesTest || [])), testTypeList];
        allDropTargets.forEach(t => {
            if(!t) return;
            t.removeEventListener('dragenter', handleDropzoneTestDragEnter);
            t.addEventListener('dragenter', handleDropzoneTestDragEnter);
            t.removeEventListener('dragover', handleDropzoneTestDragOver);
            t.addEventListener('dragover', handleDropzoneTestDragOver);
            t.removeEventListener('dragleave', handleDropzoneTestDragLeave);
            t.addEventListener('dragleave', handleDropzoneTestDragLeave);
            t.removeEventListener('drop', handleDropzoneTestDrop);
            t.addEventListener('drop', handleDropzoneTestDrop);
        });
    }

    function removeDragListenersEx2Test() {
        const currentDraggables = document.querySelectorAll('.draggable-test'); // Chercher partout
        currentDraggables?.forEach(d => {
            d.setAttribute('draggable','false');
            d.style.cursor='default';
            d.removeEventListener('dragstart', handleTestDragStart);
            d.removeEventListener('dragend', handleTestDragEnd);
        });
        const allDropTargets = [...(Array.from(dropzonesTest || [])), testTypeList];
        allDropTargets.forEach(t => {
            if(!t) return;
            t.removeEventListener('dragenter', handleDropzoneTestDragEnter);
            t.removeEventListener('dragover', handleDropzoneTestDragOver);
            t.removeEventListener('dragleave', handleDropzoneTestDragLeave);
            t.removeEventListener('drop', handleDropzoneTestDrop);
        });
    }

    const correctMatchesTest = {
        "test_ecg": "verif_ecg",
        "test_choc_ip": "verif_choc_ip",
        "test_autonomie": "verif_autonomie",
        "test_ergonomie": "verif_ergonomie"
    };

    function handleValidateEx2Test() {
        scoreEx2 = 0;
        let perfect = true;
        let feedbackContent = "Résultats Association Types de Tests :<br>";
        let allFilled = true;

        dropzonesTest.forEach(zone => {
            if(!zone.querySelector('.draggable-test')) allFilled = false;
        });

        if(!allFilled) {
            if(feedbackEx2) {
                feedbackEx2.innerHTML = "Veuillez associer tous les types de tests à une vérification.";
                feedbackEx2.className="feedback incorrect";
            }
            return;
        }

        dropzonesTest.forEach(zone => {
            const testItem = zone.querySelector('.draggable-test');
            const verificationTextElement = zone.querySelector('p strong');
            const verificationText = verificationTextElement ? verificationTextElement.textContent : `Zone ${zone.id}`;

            if(testItem && correctMatchesTest[testItem.id] === zone.id) {
                scoreEx2++;
                testItem.classList.add('correct');
                testItem.classList.remove('incorrect');
                feedbackContent += `- ${verificationText} : <strong>${testItem.textContent}</strong> (Correct)<br>`;
            } else if (testItem) {
                perfect = false;
                testItem.classList.add('incorrect');
                testItem.classList.remove('correct');
                feedbackContent += `- ${verificationText} : <strong>${testItem.textContent}</strong> (Incorrect)<br>`;
            } else { // Should not happen if allFilled is true
                perfect = false;
                feedbackContent += `- ${verificationText} : Vide (Incorrect)<br>`;
            }
        });

        if(feedbackEx2) {
            feedbackEx2.innerHTML = feedbackContent + `<br><strong>Votre score pour cet exercice : ${scoreEx2} / ${maxScoreEx2}</strong>`;
            feedbackEx2.className = 'feedback '+(perfect && scoreEx2 === maxScoreEx2 ? 'correct':'incorrect');
        }
        validateEx2Btn.disabled = true;
        removeDragListenersEx2Test();

        nextEx3BtnTest?.classList.remove('hidden');
    }

    // == Exercice 3 ==
    function getDragAfterElementProtocol(container, y) {
        const draggables = [...container.querySelectorAll('li:not(.dragging)')];
        return draggables.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function handleProtocolDragStart(e) {
        draggedProtocolStep = e.target.closest('li');
        if(draggedProtocolStep && draggedProtocolStep.getAttribute('draggable')==='true') {
            setTimeout(() => {
                if(draggedProtocolStep) draggedProtocolStep.classList.add('dragging');
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
            try {
                e.dataTransfer.setData('text/plain', draggedProtocolStep.dataset.protocolStep || 'step');
            } catch(err) {
                 console.warn("Erreur setData (peut être normal sur certains navigateurs en mode fichier local):", err);
            }
        } else {
            e.preventDefault();
        }
    }

    function handleProtocolDragEnd() {
        if(draggedProtocolStep) draggedProtocolStep.classList.remove('dragging');
        draggedProtocolStep = null;
    }

    function handleProtocolDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const container = protocolStepList;
        const afterElement = getDragAfterElementProtocol(container, e.clientY);
        if (draggedProtocolStep) {
            if (afterElement == null) {
                container.appendChild(draggedProtocolStep);
            } else {
                if (afterElement !== draggedProtocolStep) container.insertBefore(draggedProtocolStep, afterElement);
            }
        }
    }

    function addDragListenersEx3Test() {
        const items = protocolStepList?.querySelectorAll('li');
        if(!items) return;
        items.forEach(item => {
            item.setAttribute('draggable','true');
            item.style.cursor='grab';
            item.removeEventListener('dragstart', handleProtocolDragStart);
            item.addEventListener('dragstart', handleProtocolDragStart);
            item.removeEventListener('dragend', handleProtocolDragEnd);
            item.addEventListener('dragend', handleProtocolDragEnd);
        });
        if(protocolStepList) {
            protocolStepList.removeEventListener('dragover', handleProtocolDragOver);
            protocolStepList.addEventListener('dragover', handleProtocolDragOver);
        }
    }

    function removeDragListenersEx3Test() {
        const items = protocolStepList?.querySelectorAll('li');
        if(!items) return;
        items.forEach(item => {
            item.setAttribute('draggable','false');
            item.style.cursor='default';
            item.removeEventListener('dragstart', handleProtocolDragStart);
            item.removeEventListener('dragend', handleProtocolDragEnd);
        });
        if(protocolStepList) protocolStepList.removeEventListener('dragover', handleProtocolDragOver);
    }

    const correctProtocolOrder = ["resultat_attendu", "mannequin", "allumer", "lancer_analyse", "appuyer_choc", "mesurer_choc", "comparer"];

    function handleValidateEx3Test() {
        scoreEx3 = 0;
        let feedbackContent = "Résultats Ordonnancement Protocole :<br>";
        let perfect = true;
        const userOrder = protocolStepList ? [...protocolStepList.querySelectorAll('li')].map(li => li.dataset.protocolStep) : [];

        if(userOrder.length !== correctProtocolOrder.length) {
            if(feedbackEx3) {
                feedbackEx3.innerHTML = "⚠️ Nombre d'étapes incorrect. Veuillez vérifier que toutes les étapes sont présentes.";
                feedbackEx3.className="feedback incorrect";
            }
            return;
        }

        userOrder.forEach((stepId, index) => {
            const li = protocolStepList.querySelector(`li[data-protocol-step="${stepId}"]`);
            const isOk = stepId === correctProtocolOrder[index];
            if(isOk) {
                scoreEx3++;
                li?.classList.add('correct-step');
                li?.classList.remove('incorrect-step');
            } else {
                perfect = false;
                li?.classList.add('incorrect-step');
                li?.classList.remove('correct-step');
            }
            feedbackContent += `Étape ${index + 1} (<em>${li?.textContent.substring(0, li?.textContent.indexOf('.')+1) || 'Inconnue'}</em>): ${isOk ? 'Correct' : 'Incorrect'}<br>`;
        });

        if(feedbackEx3) {
            feedbackEx3.innerHTML = feedbackContent + `<br><strong>Votre score pour cet exercice : ${scoreEx3} / ${maxScoreEx3}</strong>`;
            feedbackEx3.className = 'feedback '+(perfect && scoreEx3 === maxScoreEx3 ? 'correct':'incorrect');
        }
        validateEx3Btn.disabled = true;
        removeDragListenersEx3Test();
        showFinalResultsAndLessonButton(); // Appel de la fonction modifiée ici
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
    showSection(introductionSection);
    if (startExercisesBtn) {
        startExercisesBtn.removeEventListener('click', handleStartClick);
        startExercisesBtn.addEventListener('click', handleStartClick);
    }

    // --- Ajout Emojis et styles D&D de base via JS ---
    if (!document.getElementById('module9-dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'module9-dynamic-styles';
        style.textContent = `
            .feedback.correct::before { content: "✅ "; }
            .feedback.incorrect::before { content: "❌ "; }
            li.correct-step::before { content: "✅ "; margin-right: 5px;}
            li.incorrect-step::before { content: "❌ "; margin-right: 5px;}

            /* Styles additionnels pour améliorer le Drag and Drop (non conflictuels avec module9.css) */
            .draggable-test, #protocol-step-list li[draggable="true"] {
                cursor: grab;
                user-select: none; /* Empêche la sélection de texte pendant le drag */
            }
            .draggable-test:active, #protocol-step-list li[draggable="true"]:active {
                 cursor: grabbing;
            }
            /* Les styles pour .dragging, .over, etc. sont dans module9.css */
        `;
        document.head.appendChild(style);
    }

    console.log("Initialisation complète du module 9");
}); // Fin DOMContentLoaded