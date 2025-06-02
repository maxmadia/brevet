document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Module 8 ---");

    // --- Configuration et Références DOM ---
    const moduleId = 'module_8_projet';
    const maxScoreEx1 = 3, maxScoreEx2 = 3, maxScoreEx3 = 3;
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
    let validateEx1Btn, feedbackEx1, qcmProjet1Form, nextEx2BtnProj;
    // Ex2
    let validateEx2Btn, feedbackEx2, matchingSolutionContainer, nextEx3BtnProj;
    let validatedEx2Proj = false;
    // Ex3
    let validateEx3Btn, feedbackEx3, projectStepList, projectStepItems;
    let validatedEx3Proj = false;

    // --- Fonctions utilitaires ---
    function showSection(sectionToShow) {
        console.log("Affichage section:", sectionToShow ? sectionToShow.id : "Aucune");
        [introductionSection, exercise1Section, exercise2Section].forEach(s => s?.classList.add('hidden'));
        // Ne pas cacher exercise3Section lors de l'affichage des résultats
        if (sectionToShow !== moduleResultsDiv) {
            exercise3Section?.classList.add('hidden');
        }
        sectionToShow?.classList.remove('hidden');
        if (sectionToShow === moduleResultsDiv) {
            showLessonBtn?.classList.remove('hidden');
        } else {
            showLessonBtn?.classList.add('hidden');
        }
    }
    
    function displayModuleResults() {
        let currentScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod8: Score=${currentScore}/${totalMaxScore}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = currentScore;
        if(moduleMaxScoreSpan) moduleMaxScoreSpan.textContent = totalMaxScore;
        
        // Au lieu de cacher l'exercice 3, on affiche simplement les résultats du module en plus
        moduleResultsDiv?.classList.remove('hidden');
        showLessonBtn?.classList.remove('hidden');
        
        if (microCoursArticle?.classList.contains('hidden')) {
            if(showLessonBtn) showLessonBtn.textContent = 'Voir la leçon';
        } else {
            if(showLessonBtn) showLessonBtn.textContent = 'Cacher la leçon';
        }
        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, currentScore, totalMaxScore);
        } else {
            console.error("Fonction enregistrerScore non trouvée.");
        }
    }

    // --- Initialisation Différée ---
    function initExercise1() {
        console.log("Init Ex1 Mod8");
        validateEx1Btn = document.getElementById('validate-ex1');
        feedbackEx1 = document.getElementById('feedback-ex1');
        qcmProjet1Form = document.getElementById('qcm-projet-1');
        scoreEx1 = 0;

        if (qcmProjet1Form) qcmProjet1Form.reset();
        qcmProjet1Form?.querySelectorAll('input').forEach(el => el.disabled = false); // Réactiver

        if(feedbackEx1) {
            feedbackEx1.innerHTML = '';
            feedbackEx1.className = 'feedback';
        }
        
        if(validateEx1Btn) {
            validateEx1Btn.disabled = false;
            validateEx1Btn.removeEventListener('click', handleValidateEx1Proj);
            validateEx1Btn.addEventListener('click', handleValidateEx1Proj);
        }
        
        // S'assurer que le bouton nextEx2 est caché à l'init
        if (nextEx2BtnProj) nextEx2BtnProj.classList.add('hidden');
    }
    
    function initExercise2() {
        console.log("Init Ex2 Mod8");
        validateEx2Btn = document.getElementById('validate-ex2');
        feedbackEx2 = document.getElementById('feedback-ex2');
        matchingSolutionContainer = document.getElementById('matching-solution-container');
        validatedEx2Proj = false;
        scoreEx2 = 0;
        
        if(feedbackEx2) {
            feedbackEx2.innerHTML = '';
            feedbackEx2.className = 'feedback';
        }
        
        if(validateEx2Btn) {
            validateEx2Btn.disabled = false;
            validateEx2Btn.removeEventListener('click', handleValidateEx2Proj);
            validateEx2Btn.addEventListener('click', handleValidateEx2Proj);
        }
        
        // Initialiser le drag and drop pour l'exercice 2
        initDragAndDropEx2();
        
        if (!nextEx3BtnProj && exercise2Section && validateEx2Btn) {
            nextEx3BtnProj = document.createElement('button');
            nextEx3BtnProj.id = 'next-ex3-proj';
            nextEx3BtnProj.textContent = "Passer à l'étape 3";
            nextEx3BtnProj.classList.add('hidden');
            nextEx3BtnProj.style.marginLeft="10px";
            validateEx2Btn.insertAdjacentElement('afterend', nextEx3BtnProj);
            nextEx3BtnProj.removeEventListener('click', handleNextEx3ClickProj);
            nextEx3BtnProj.addEventListener('click', handleNextEx3ClickProj);
        }
        
        if (nextEx3BtnProj) nextEx3BtnProj.classList.add('hidden');
    }
    
    function initExercise3() {
        console.log("Init Ex3 Mod8");
        validateEx3Btn = document.getElementById('validate-ex3');
        feedbackEx3 = document.getElementById('feedback-ex3');
        projectStepList = document.getElementById('project-step-list');
        projectStepItems = projectStepList?.querySelectorAll('li');
        validatedEx3Proj = false;
        scoreEx3 = 0;
        
        if(feedbackEx3) {
            feedbackEx3.innerHTML = '';
            feedbackEx3.className = 'feedback';
        }
        
        if(validateEx3Btn) {
            validateEx3Btn.disabled = false;
            validateEx3Btn.removeEventListener('click', handleValidateEx3Proj);
            validateEx3Btn.addEventListener('click', handleValidateEx3Proj);
        }
        
        // Initialiser le drag and drop pour l'exercice 3
        initDragAndDropEx3();
        
        moduleResultsDiv?.classList.add('hidden');
        showLessonBtn?.classList.add('hidden');
        microCoursArticle?.classList.add('hidden');
    }

    // --- Initialisation du drag and drop pour l'exercice 2 ---
    function initDragAndDropEx2() {
        const draggableSolutions = document.querySelectorAll('.draggable-solution');
        const dropZones = document.querySelectorAll('.dropzone-solution');
        
        // Réinitialiser les zones de drop
        dropZones.forEach(zone => {
            const solutions = zone.querySelectorAll('.draggable-solution');
            solutions.forEach(solution => {
                solution.parentElement.querySelector('.solution-list-projet').appendChild(solution);
            });
        });
        
        // Ajouter les écouteurs d'événements
        draggableSolutions.forEach(item => {
            item.setAttribute('draggable', 'true');
            
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.id);
                this.classList.add('dragging');
            });
            
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('over');
            });
            
            zone.addEventListener('dragleave', function() {
                this.classList.remove('over');
            });
            
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('over');
                
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);
                
                if (draggable && this.children.length < 2) { // Limite à un élément par zone (+ le paragraphe)
                    this.appendChild(draggable);
                }
            });
        });
    }
    
    // --- Initialisation du drag and drop pour l'exercice 3 ---
    function initDragAndDropEx3() {
        if (!projectStepList) return;
        
        const listItems = projectStepList.querySelectorAll('li');
        
        // Mélanger aléatoirement les éléments de la liste
        for (let i = projectStepList.children.length; i >= 0; i--) {
            projectStepList.appendChild(projectStepList.children[Math.random() * i | 0]);
        }
        
        // Ajouter des écouteurs d'événements pour le drag & drop
        listItems.forEach(item => {
            item.setAttribute('draggable', 'true');
            
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.dataset.projectStep);
                this.classList.add('dragging');
            });
            
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                if (dragging && dragging !== this) {
                    const rect = this.getBoundingClientRect();
                    const midpoint = (rect.top + rect.bottom) / 2;
                    if (e.clientY < midpoint) {
                        projectStepList.insertBefore(dragging, this);
                    } else {
                        projectStepList.insertBefore(dragging, this.nextSibling);
                    }
                }
            });
        });
    }

    // --- Handlers pour boutons Start et Next ---
    function handleStartClick() {
        if (startExercisesBtn) startExercisesBtn.disabled = true;
        introductionSection?.classList.add('hidden');
        showSection(exercise1Section);
        initExercise1();
    }
    
    function handleNextEx2ClickProj() {
        if (nextEx2BtnProj) nextEx2BtnProj.classList.add('hidden');
        showSection(exercise2Section);
        initExercise2();
    }
    
    function handleNextEx3ClickProj() {
        if (nextEx3BtnProj) nextEx3BtnProj.classList.add('hidden');
        showSection(exercise3Section);
        initExercise3();
    }

    // --- Logique Exercice 1 : QCM ---
    function handleValidateEx1Proj() {
        console.log("Validation Exercice 1 QCM"); // DEBUG
        scoreEx1 = 0; // Reset score pour cette validation

        if (!qcmProjet1Form || !feedbackEx1 || !validateEx1Btn) {
            console.error("Éléments manquants pour valider Ex1 Projet");
            return;
        }

        const selectedOption = qcmProjet1Form.querySelector('input[name="q1_projet"]:checked');
        
        if (!selectedOption) {
            feedbackEx1.innerHTML = "⚠️ Veuillez sélectionner une réponse.";
            feedbackEx1.className = 'feedback incorrect';
            return;
        }

        // Vérifier si la réponse est correcte (la bonne réponse est 'b')
        const isCorrect = selectedOption.value === 'b';
        
        if (isCorrect) {
            scoreEx1 = maxScoreEx1; // 3 points pour une bonne réponse
            feedbackEx1.innerHTML = "✔️ Correct ! La difficulté à localiser rapidement un DAE est un besoin réel qui justifie une amélioration.";
            feedbackEx1.className = 'feedback correct';
        } else {
            scoreEx1 = 0;
            feedbackEx1.innerHTML = "❌ Incorrect. La difficulté à localiser rapidement un DAE est un besoin réel qui justifie une amélioration.";
            feedbackEx1.className = 'feedback incorrect';
        }

        validateEx1Btn.disabled = true;
        qcmProjet1Form.querySelectorAll('input').forEach(el => el.disabled = true);

        // Créer et afficher le bouton "Passer à l'étape 2"
        if (!nextEx2BtnProj && exercise1Section && validateEx1Btn) {
            nextEx2BtnProj = document.createElement('button');
            nextEx2BtnProj.id = 'next-ex2-proj'; // ID unique
            nextEx2BtnProj.textContent = "Passer à l'étape 2";
            nextEx2BtnProj.style.marginLeft = "10px"; // Un peu d'espace
            validateEx1Btn.insertAdjacentElement('afterend', nextEx2BtnProj);
            nextEx2BtnProj.removeEventListener('click', handleNextEx2ClickProj); // Nettoyer
            nextEx2BtnProj.addEventListener('click', handleNextEx2ClickProj);
            console.log("Bouton 'Passer à l'étape 2' créé"); // DEBUG
        }
        
        nextEx2BtnProj?.classList.remove('hidden'); // Afficher le bouton
        console.log("Bouton 'Passer à l'étape 2' affiché"); // DEBUG
    }

    // --- Logique Exercice 2 : Association ---
    function handleValidateEx2Proj() {
        console.log("Validation Exercice 2"); // DEBUG
        scoreEx2 = 0; // Reset score
        
        const dropzones = document.querySelectorAll('.dropzone-solution');
        let feedback = "Exercice 2 - Résultats :<br>";
        let allCorrect = true;
        
        // Vérifier chaque zone
        dropzones.forEach(zone => {
            const solution = zone.querySelector('.draggable-solution');
            if (!solution) {
                feedback += `- Zone "${zone.id}" : ⚠️ Aucune solution associée.<br>`;
                allCorrect = false;
                return;
            }
            
            const correctSolutionId = zone.dataset.correctSolution;
            const isCorrect = solution.id === correctSolutionId;
            
            if (isCorrect) {
                scoreEx2++;
                feedback += `- ${zone.querySelector('p').textContent.trim()} : ✔️ Associé correctement.<br>`;
                solution.classList.add('correct');
            } else {
                feedback += `- ${zone.querySelector('p').textContent.trim()} : ❌ Association incorrecte.<br>`;
                solution.classList.add('incorrect');
                allCorrect = false;
            }
        });
        
        // Limiter le score au maximum défini
        scoreEx2 = Math.min(scoreEx2, maxScoreEx2);
        
        feedbackEx2.innerHTML = feedback + `<strong>Score: ${scoreEx2}/${maxScoreEx2}</strong>`;
        feedbackEx2.className = 'feedback ' + (allCorrect ? 'correct' : 'incorrect');
        
        validateEx2Btn.disabled = true;
        validatedEx2Proj = true;
        
        // Désactiver le drag & drop
        const draggables = document.querySelectorAll('.draggable-solution');
        draggables.forEach(item => {
            item.setAttribute('draggable', 'false');
            item.style.cursor = 'default';
        });
        
        // Afficher le bouton pour passer à l'exercice 3
        nextEx3BtnProj?.classList.remove('hidden');
    }

    // --- Logique Exercice 3 : Ordonnancement ---
    function handleValidateEx3Proj() {
        console.log("Validation Exercice 3"); // DEBUG
        scoreEx3 = 0;
        
        // Ordre correct des étapes
        const correctOrder = ['besoin', 'cahier_charges', 'solutions', 'choix_solution', 'realisation', 'tests'];
        const currentOrder = [];
        
        // Récupérer l'ordre actuel
        projectStepList.querySelectorAll('li').forEach(item => {
            currentOrder.push(item.dataset.projectStep);
        });
        
        let feedback = "Exercice 3 - Résultats :<br>";
        
        // Vérifier chaque position
        for (let i = 0; i < correctOrder.length; i++) {
            const isCorrect = currentOrder[i] === correctOrder[i];
            
            if (isCorrect) {
                scoreEx3++;
                projectStepList.children[i].classList.add('correct');
                feedback += `- Étape ${i+1} : ✔️ Correct<br>`;
            } else {
                projectStepList.children[i].classList.add('incorrect');
                feedback += `- Étape ${i+1} : ❌ Incorrect (devrait être "${getStepName(correctOrder[i])}")<br>`;
            }
        }
        
        // Ajuster le score final (3 points maximum)
        scoreEx3 = Math.min(Math.floor(scoreEx3 / 2), maxScoreEx3);
        
        feedbackEx3.innerHTML = feedback + `<strong>Score: ${scoreEx3}/${maxScoreEx3}</strong>`;
        feedbackEx3.className = 'feedback ' + (scoreEx3 === maxScoreEx3 ? 'correct' : 'incorrect');
        
        validateEx3Btn.disabled = true;
        validatedEx3Proj = true;
        
        // Désactiver le drag & drop
        projectStepList.querySelectorAll('li').forEach(item => {
            item.setAttribute('draggable', 'false');
            item.style.cursor = 'default';
            
            // Retirer les écouteurs d'événements
            item.removeEventListener('dragstart', null);
            item.removeEventListener('dragend', null);
            item.removeEventListener('dragover', null);
        });
        
        // Afficher les résultats du module sans cacher l'exercice 3
        displayModuleResults();
    }
    
    function getStepName(stepId) {
        const stepNames = {
            'besoin': 'Identifier le besoin',
            'cahier_charges': 'Rédiger un cahier des charges',
            'solutions': 'Imaginer des solutions',
            'choix_solution': 'Choisir la solution',
            'realisation': 'Réaliser un prototype',
            'tests': 'Tester le prototype'
        };
        
        return stepNames[stepId] || stepId;
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

    // == Initialisation Finale de la Page ==
    showSection(introductionSection);
    if (startExercisesBtn) {
        startExercisesBtn.removeEventListener('click', handleStartClick);
        startExercisesBtn.addEventListener('click', handleStartClick);
    }

    // --- Ajout Emojis CSS via JS ---
    if (!document.getElementById('emoji-styles')) {
        const emojiStyle = document.createElement('style');
        emojiStyle.id = 'emoji-styles';
        emojiStyle.textContent = `
            .correct::before { content: "✓ "; color: green; }
            .incorrect::before { content: "✗ "; color: red; }
        `;
        document.head.appendChild(emojiStyle);
    }

}); // Fin DOMContentLoaded