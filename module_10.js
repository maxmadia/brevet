// Module 10 – Coder pour le DAE
// Script réécrit le 18‑05‑2025 pour corriger l’enchaînement des exercices
// et aligner l'affichage final sur celui du module 9.

document.addEventListener('DOMContentLoaded', () => {
    /*================== CONFIGURATION SCORES ==================*/
    const MAX_EX1 = 1;
    const MAX_EX2 = 1;
    const MAX_EX3 = 1;
    const TOTAL_MAX = MAX_EX1 + MAX_EX2 + MAX_EX3;
    const moduleId = 'module_10_coder'; // Pour enregistrerScore si besoin

    let scoreEx1 = 0;
    let scoreEx2 = 0;
    let scoreEx3 = 0;

    /*================== RÉFÉRENCES DOM ========================*/
    const introSec          = document.getElementById('introduction');
    const startBtn          = document.getElementById('start-exercises');

    const ex1Sec            = document.getElementById('exercise-1');
    const condInput         = document.getElementById('condition_choc');
    const valEx1Btn         = document.getElementById('validate-ex1');
    const feedback1         = document.getElementById('feedback-ex1');
    let   nextEx2Btn        = null;

    const ex2Sec            = document.getElementById('exercise-2');
    const qcmRcpForm        = document.getElementById('qcm-boucle-rcp');
    const valEx2Btn         = document.getElementById('validate-ex2');
    const feedback2         = document.getElementById('feedback-ex2');
    let   nextEx3Btn        = null;

    const ex3Sec            = document.getElementById('exercise-3');
    const qcmVarForm        = document.getElementById('qcm-variable-dae');
    const valEx3Btn         = document.getElementById('validate-ex3');
    const feedback3         = document.getElementById('feedback-ex3');

    const moduleResultsDiv  = document.getElementById('module-results');
    const moduleScoreSpan   = document.getElementById('module-score');
    const moduleMaxSpan     = document.getElementById('module-max-score');

    const showLessonBtn     = document.getElementById('show-lesson-btn');
    const microCours        = document.getElementById('micro-cours');

    /*================== OUTILS VISUELS ========================*/
    const allExerciseSections = [introSec, ex1Sec, ex2Sec, ex3Sec];

    function hideAllExerciseSections() {
        allExerciseSections.forEach(sec => sec?.classList.add('hidden'));
    }

    function showSection(sectionToShow) {
        hideAllExerciseSections();
        sectionToShow?.classList.remove('hidden');
        // S'assurer que les résultats et le bouton de leçon sont cachés si on n'est pas à la fin
        moduleResultsDiv?.classList.add('hidden');
        showLessonBtn?.classList.add('hidden');
        microCours?.classList.add('hidden'); // Cacher la leçon aussi par défaut lors du changement de section
    }


    function showFinalResultsAndLessonButton() {
        const totalScore = scoreEx1 + scoreEx2 + scoreEx3;
        console.log(`Affichage Résultats Mod10: Score=${totalScore}/${TOTAL_MAX}`);
        if(moduleScoreSpan) moduleScoreSpan.textContent = totalScore;
        if(moduleMaxSpan) moduleMaxSpan.textContent = TOTAL_MAX;

        moduleResultsDiv?.classList.remove('hidden'); // Afficher la section des résultats

        if (microCours?.classList.contains('hidden')) {
            if(showLessonBtn) showLessonBtn.textContent = 'Voir la leçon';
        } else {
            if(showLessonBtn) showLessonBtn.textContent = 'Cacher la leçon';
        }
        showLessonBtn?.classList.remove('hidden'); // Afficher le bouton "Voir la leçon"

        if (typeof enregistrerScore === 'function') {
            enregistrerScore(moduleId, totalScore, TOTAL_MAX);
        } else {
            console.warn("Fonction enregistrerScore non trouvée. Le score ne sera pas sauvegardé globalement.");
        }
    }


    /*================== INITIALISATION DES EXERCICES ==========*/
    function initEx1() {
        scoreEx1 = 0;
        if (condInput) {
            condInput.value = '';
            condInput.disabled = false;
            condInput.classList.remove('correct-answer','incorrect-answer');
        }
        if (feedback1) {
            feedback1.textContent = '';
            feedback1.className = 'feedback';
        }
        if (valEx1Btn) valEx1Btn.disabled = false;
        nextEx2Btn?.classList.add('hidden');
    }

    function initEx2() {
        scoreEx2 = 0;
        qcmRcpForm?.reset();
        qcmRcpForm?.querySelectorAll('input').forEach(r=>{
            r.disabled = false;
            r.parentElement.classList.remove('correct-answer','incorrect-answer');
        });
        if (feedback2) {
            feedback2.textContent = '';
            feedback2.className = 'feedback';
        }
        if (valEx2Btn) valEx2Btn.disabled = false;
        nextEx3Btn?.classList.add('hidden');
    }

    function initEx3() {
        scoreEx3 = 0;
        qcmVarForm?.reset();
        qcmVarForm?.querySelectorAll('input').forEach(r=>{
            r.disabled = false;
            r.parentElement.classList.remove('correct-answer','incorrect-answer');
        });
        if (feedback3) {
            feedback3.innerHTML = ''; // innerHTML au cas où il y aurait des balises
            feedback3.className = 'feedback';
        }
        if (valEx3Btn) valEx3Btn.disabled = false;
        // Cacher les résultats du module et le bouton de leçon au début de l'exercice 3
        moduleResultsDiv?.classList.add('hidden');
        showLessonBtn?.classList.add('hidden');
        microCours?.classList.add('hidden');
    }

    /*================== EXERCICE 1 =============================*/
    valEx1Btn?.addEventListener('click', () => {
        if (!condInput || !feedback1) return;
        const answer = condInput.value.toLowerCase().replace(/\s+/g,'').trim();
        // Accepter "rythme=fv", "rythmefv", "rythme == fv"
        // Vérifier la présence des mots clés, peu importe les opérateurs exacts pour simplifier
        const correct = answer.includes('rythme') && answer.includes('fv') && !answer.includes('normal');

        scoreEx1 = correct ? MAX_EX1 : 0;
        condInput.classList.toggle('correct-answer', correct);
        condInput.classList.toggle('incorrect-answer', !correct);
        condInput.disabled = true;
        valEx1Btn.disabled = true;

        feedback1.textContent = correct ? 'Correct ! Si le rythme est une Fibrillation Ventriculaire (FV), un choc est recommandé.' : 'Incorrect. La condition principale pour choquer est la détection d\'une Fibrillation Ventriculaire (FV). Vérifiez les termes suggérés.';
        feedback1.className  = 'feedback ' + (correct ? 'correct':'incorrect');

        if (!nextEx2Btn) {
            nextEx2Btn = document.createElement('button');
            nextEx2Btn.id = 'next-ex2-m10'; // ID unique pour éviter conflits si plusieurs modules
            nextEx2Btn.textContent = 'Passer à l\'exercice 2';
            nextEx2Btn.style.marginLeft = '10px';
            valEx1Btn.insertAdjacentElement('afterend', nextEx2Btn);
            nextEx2Btn.addEventListener('click', () => {
                showSection(ex2Sec);
                initEx2();
            });
        }
        nextEx2Btn.classList.remove('hidden');
    });

    /*================== EXERCICE 2 =============================*/
    valEx2Btn?.addEventListener('click', () => {
        if (!qcmRcpForm || !feedback2) return;
        const selected = qcmRcpForm.querySelector('input[name="q2_rcp"]:checked');
        if (!selected) {
            feedback2.textContent = 'Veuillez sélectionner une réponse.';
            feedback2.className = 'feedback incorrect';
            return;
        }
        const correct = selected.dataset.correct === 'true';
        scoreEx2 = correct ? MAX_EX2 : 0;

        qcmRcpForm.querySelectorAll('input').forEach(inp => {
            inp.disabled = true;
            if (inp === selected) {
                inp.parentElement.classList.toggle('correct-answer', correct);
                inp.parentElement.classList.toggle('incorrect-answer', !correct);
            }
        });
        valEx2Btn.disabled = true;

        feedback2.textContent = correct ? 'Correct ! Cette boucle guide l\'utilisateur à travers plusieurs cycles de RCP.' : 'Incorrect. Relisez attentivement les actions répétées dans la boucle.';
        feedback2.className = 'feedback ' + (correct ? 'correct':'incorrect');

        if (!nextEx3Btn) {
            nextEx3Btn = document.createElement('button');
            nextEx3Btn.id = 'next-ex3-m10'; // ID unique
            nextEx3Btn.textContent = 'Passer à l\'exercice 3';
            nextEx3Btn.style.marginLeft = '10px';
            valEx2Btn.insertAdjacentElement('afterend', nextEx3Btn);
            nextEx3Btn.addEventListener('click', () => {
                showSection(ex3Sec);
                initEx3();
            });
        }
        nextEx3Btn.classList.remove('hidden');
    });

    /*================== EXERCICE 3 =============================*/
    valEx3Btn?.addEventListener('click', () => {
        if (!qcmVarForm || !feedback3) return;
        const selected = qcmVarForm.querySelector('input[name="q3_variable"]:checked');
        if (!selected) {
            feedback3.textContent = 'Veuillez sélectionner une réponse.';
            feedback3.className = 'feedback incorrect';
            return;
        }
        const correct = selected.dataset.correct === 'true';
        scoreEx3 = correct ? MAX_EX3 : 0;

        qcmVarForm.querySelectorAll('input').forEach(inp=>{
            inp.disabled = true;
             if (inp === selected) {
                inp.parentElement.classList.toggle('correct-answer', correct);
                inp.parentElement.classList.toggle('incorrect-answer', !correct);
            }
        });
        valEx3Btn.disabled = true;

        feedback3.textContent = correct ? 'Correct ! L\'instruction "METTRE VARIABLE A VALEUR" est la bonne façon d\'affecter une nouvelle valeur.' : 'Incorrect. Revoyez comment on modifie la valeur d\'une variable.';
        feedback3.className = 'feedback ' + (correct ? 'correct':'incorrect');

        showFinalResultsAndLessonButton(); // Afficher le score et le bouton de leçon
    });

    /*================== BOUTON COMMENCER =======================*/
    startBtn?.addEventListener('click', () => {
        showSection(ex1Sec);
        initEx1();
    });

    /*================== GESTION LEÇON =========================*/
    function toggleLessonVisibility() {
        if (microCours && showLessonBtn) {
            microCours.classList.toggle('hidden');
            showLessonBtn.textContent = microCours.classList.contains('hidden') ? 'Voir la leçon' : 'Cacher la leçon';
        }
    }

    if (showLessonBtn && microCours) {
        showLessonBtn.removeEventListener('click', toggleLessonVisibility); // Prévenir doublons
        showLessonBtn.addEventListener('click', toggleLessonVisibility);
    }

    /*================== ÉTAT INITIAL ===========================*/
    showSection(introSec); // Afficher l'intro au chargement
});