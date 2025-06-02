document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Début Script Page Bilan ---");

    const tbodyScores = document.getElementById('tbody-scores');
    const totalScoreObtenuEl = document.getElementById('total-score-obtenu');
    const totalScoreMaxEl = document.getElementById('total-score-max');
    const totalPourcentageEl = document.getElementById('total-pourcentage');
    const totalStatutEl = document.getElementById('total-statut');
    const noScoresMessageEl = document.getElementById('no-scores-message');
    const analyseGlobaleSection = document.getElementById('analyse-globale');

    const listePointsFortsUl = document.getElementById('liste-points-forts');
    const listeAxesAmeliorationUl = document.getElementById('liste-axes-amelioration');
    const noPointsFortsP = document.getElementById('no-points-forts');
    const noAxesAmeliorationP = document.getElementById('no-axes-amelioration');

    const resetAllScoresBtn = document.getElementById('reset-all-scores-btn');

    // Définition des modules (ID, Nom, lien pour revoir)
    // AJOUT DU MODULE 11
    const modules = [
        { id: 'module_1_usages', nom: "Module 1 : Usages & Évolutions", lien: "../themes/module_1_usages_evolutions.html" },
        { id: 'module_2_interactions', nom: "Module 2 : Interactions & Ergonomie", lien: "../themes/module_2_interactions_ergonomie.html" },
        { id: 'module_3_choix', nom: "Module 3 : Choix & Performances", lien: "../themes/module_3_choix_performances.html" },
        { id: 'module_4_energie', nom: "Module 4 : Chaîne d'Énergie", lien: "../themes/module_4_chaine_energie.html" },
        { id: 'module_5_information', nom: "Module 5 : Chaîne d'Information", lien: "../themes/module_5_chaine_information.html" },
        { id: 'module_6_diagnostic', nom: "Module 6 : Diagnostic & Dépannage", lien: "../themes/module_6_diagnostic_depannage.html" },
        { id: 'module_7_algorithmique', nom: "Module 7 : Algorithme & Programmation", lien: "../themes/module_7_algorithmique_programmation.html" },
        { id: 'module_8_projet', nom: "Module 8 : Projet - Amélioration", lien: "../themes/module_8_projet_amelioration.html" },
        { id: 'module_9_tests', nom: "Module 9 : Tests & Validation", lien: "../themes/module_9_tests_validation.html" },
        { id: 'module_10_coder', nom: "Module 10 : Coder pour le DAE", lien: "../themes/module_10_coder_dae.html" },
        { id: 'module_11_materiaux', nom: "Module 11 : Matériaux & Développement Durable", lien: "../themes/module_11_materiaux.html" } // NOUVEAU MODULE
    ];

    function afficherBilan() {
        if (!tbodyScores || !totalScoreObtenuEl || !totalScoreMaxEl || !totalPourcentageEl || !totalStatutEl || !noScoresMessageEl || !analyseGlobaleSection) {
            console.error("Un ou plusieurs éléments DOM pour le bilan sont manquants.");
            return;
        }

        let tousLesScores = {};
        if (typeof recupererTousLesScores === 'function') {
            tousLesScores = recupererTousLesScores();
        } else {
            console.warn("Fonction recupererTousLesScores non trouvée, lecture directe de localStorage.");
            modules.forEach(mod => { /* ... (fallback inchangé) ... */ });
        }

        tbodyScores.innerHTML = '';
        let grandTotalObtenu = 0;
        let grandTotalMax = 0;
        let modulesCompletes = 0;
        let pointsForts = [];
        let axesAmelioration = [];

        modules.forEach(moduleConfig => {
            const scoreData = tousLesScores[moduleConfig.id];
            let scoreObtenu = 0;
            let scoreMax = 0;

            if (scoreData && typeof scoreData.score !== 'undefined' && typeof scoreData.max !== 'undefined') {
                scoreObtenu = scoreData.score;
                scoreMax = scoreData.max;
                if (scoreMax > 0) modulesCompletes++; // Compter seulement si un score max est défini et module tenté
            } else {
                // SOLUTION TEMPORAIRE : Scores max par module (AJOUTER MODULE 11)
                // Idéalement, `notation.js` gère cela proprement.
                const scoresMaxModule = {
                    'module_1_usages': 3, 'module_2_interactions': 7, 'module_3_choix': 10,
                    'module_4_energie': 16, 'module_5_information': 10, 'module_6_diagnostic': 9,
                    'module_7_algorithmique': 9, 'module_8_projet': 9, 'module_9_tests': 12,
                    'module_10_coder': 3,
                    'module_11_materiaux': 8 // Ex: 1(QCM) + 4(Assoc) + 3(QCM Multi) = 8
                };
                scoreMax = scoresMaxModule[moduleConfig.id] || 0;
                if (!scoreData && scoreMax > 0) { // Si pas de données mais un max défini, c'est "Non fait"
                     tousLesScores[moduleConfig.id] = { score: 0, max: scoreMax, moduleId: moduleConfig.id, nonTente: true };
                } else if (scoreData && typeof scoreData.max === 'undefined') {
                    tousLesScores[moduleConfig.id].max = scoreMax;
                }
            }

            grandTotalObtenu += scoreObtenu;
            grandTotalMax += scoreMax;

            const pourcentage = scoreMax > 0 ? Math.round((scoreObtenu / scoreMax) * 100) : 0;
            let statut = "-";
            let statutClass = "";

            if (scoreData && typeof scoreData.score !== 'undefined' && !scoreData.nonTente) { // Module tenté
                if (pourcentage >= 75) {
                    statut = "Très bien"; statutClass = "statut-bien";
                    pointsForts.push({ nom: moduleConfig.nom, lien: moduleConfig.lien });
                } else if (pourcentage >= 50) {
                    statut = "Assez bien"; statutClass = "statut-moyen";
                    axesAmelioration.push({ nom: moduleConfig.nom, lien: moduleConfig.lien, score: `${scoreObtenu}/${scoreMax} (${pourcentage}%)` });
                } else {
                    statut = "À revoir"; statutClass = "statut-faible";
                    axesAmelioration.push({ nom: moduleConfig.nom, lien: moduleConfig.lien, score: `${scoreObtenu}/${scoreMax} (${pourcentage}%)` });
                }
            } else if (scoreMax > 0) { // Module non tenté mais existant
                statut = "Non fait"; statutClass = "statut-nonfait";
                axesAmelioration.push({ nom: moduleConfig.nom, lien: moduleConfig.lien, score: `Non commencé` });
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="${moduleConfig.lien}">${moduleConfig.nom}</a></td>
                <td>${scoreData && typeof scoreData.score !== 'undefined' && !scoreData.nonTente ? scoreObtenu : '-'}</td>
                <td>${scoreMax > 0 ? scoreMax : '-'}</td>
                <td>${scoreMax > 0 && scoreData && typeof scoreData.score !== 'undefined' && !scoreData.nonTente ? pourcentage + '%' : '-'}</td>
                <td class="${statutClass}">${statut}</td>
            `;
            tbodyScores.appendChild(tr);
        });

        if (modulesCompletes === 0 && noScoresMessageEl) {
            noScoresMessageEl.classList.remove('hidden');
            analyseGlobaleSection?.classList.add('hidden');
            if(document.getElementById('table-scores')) document.getElementById('table-scores').style.display = 'none';
            if(document.getElementById('total-row')) document.getElementById('total-row').style.display = 'none';
        } else {
            noScoresMessageEl?.classList.add('hidden');
            analyseGlobaleSection?.classList.remove('hidden');
            if(document.getElementById('table-scores')) document.getElementById('table-scores').style.display = '';
            if(document.getElementById('total-row')) document.getElementById('total-row').style.display = '';

            totalScoreObtenuEl.textContent = grandTotalObtenu;
            totalScoreMaxEl.textContent = grandTotalMax;
            const grandPourcentage = grandTotalMax > 0 ? Math.round((grandTotalObtenu / grandTotalMax) * 100) : 0;
            totalPourcentageEl.textContent = grandPourcentage + '%';

            if (grandPourcentage >= 75) totalStatutEl.textContent = "Excellent !";
            else if (grandPourcentage >= 50) totalStatutEl.textContent = "Bon travail !";
            else totalStatutEl.textContent = "Peut mieux faire";

            // Remplir Points Forts
            if (listePointsFortsUl) { /* ... (inchangé) ... */ }
            // Remplir Axes d'Amélioration
            if (listeAxesAmeliorationUl) { /* ... (inchangé) ... */ }
             // (Copier/Coller la logique de remplissage des listes ici)
            if (listePointsFortsUl) { listePointsFortsUl.innerHTML = ''; if (pointsForts.length > 0) { pointsForts.forEach(pf => { const li = document.createElement('li'); li.innerHTML = `<a href="${pf.lien}">${pf.nom}</a>`; listePointsFortsUl.appendChild(li); }); noPointsFortsP?.classList.add('hidden'); } else { noPointsFortsP?.classList.remove('hidden'); } }
            if (listeAxesAmeliorationUl) { listeAxesAmeliorationUl.innerHTML = ''; if (axesAmelioration.length > 0) { axesAmelioration.forEach(aa => { const li = document.createElement('li'); li.innerHTML = `<a href="${aa.lien}">${aa.nom}</a> (${aa.score})`; listeAxesAmeliorationUl.appendChild(li); }); noAxesAmeliorationP?.classList.add('hidden'); } else { noAxesAmeliorationP?.classList.remove('hidden'); } }
        }
    }

    // Réinitialisation des scores
    if (resetAllScoresBtn) {
        resetAllScoresBtn.addEventListener('click', () => {
            if (confirm("Êtes-vous sûr de vouloir réinitialiser tous vos scores ? Cette action est irréversible.")) {
                if (typeof supprimerTousLesScores === 'function') {
                    supprimerTousLesScores();
                } else {
                    console.warn("Fonction supprimerTousLesScores non trouvée, suppression manuelle.");
                    // Supprimer la clé principale
                    localStorage.removeItem('DAE_Brevet_ModuleScores'); // Assurez-vous que SCORE_STORAGE_KEY est bien ça
                    // Et les scores intermédiaires si vous en stockiez (ce qui n'est plus le cas avec la structure actuelle de notation.js)
                    modules.forEach(mod => {
                         localStorage.removeItem(mod.id); // Ancienne méthode de stockage par module
                         // Si vous aviez des clés comme 'module_X_exY_score', il faudrait les lister aussi
                    });
                }
                afficherBilan();
                alert("Tous les scores ont été réinitialisés.");
            }
        });
    }

    // Afficher le bilan au chargement de la page
    afficherBilan();
});