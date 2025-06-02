// js/notation.js

// Structure de stockage :
// localStorage.setItem('DAE_Brevet_ModuleScores', JSON.stringify({
//     'module_1_usages': { score: X, max: Y, moduleId: 'module_1_usages' },
//     'module_X_nom':    { score: A, max: B, moduleId: 'module_X_nom' },
// }));

const SCORE_STORAGE_KEY = 'DAE_Brevet_ModuleScores';

function enregistrerScore(moduleId, score, scoreMax) {
    console.log(`Enregistrement score pour ${moduleId}: ${score}/${scoreMax}`);
    try {
        let tousLesScores = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY)) || {};
        tousLesScores[moduleId] = {
            score: parseInt(score, 10) || 0,
            max: parseInt(scoreMax, 10) || 0,
            moduleId: moduleId // Peut être utile pour le bilan
            // On pourrait ajouter un timestamp ici
        };
        localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(tousLesScores));
        console.log("Scores actuels stockés:", tousLesScores);
    } catch (e) {
        console.error("Erreur lors de l'enregistrement du score:", e);
    }
}

function recupererTousLesScores() {
    try {
        const scores = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY));
        console.log("Scores récupérés:", scores);
        return scores || {}; // Retourne un objet vide si rien n'est trouvé
    } catch (e) {
        console.error("Erreur lors de la récupération des scores:", e);
        return {};
    }
}

function supprimerTousLesScores() {
    try {
        localStorage.removeItem(SCORE_STORAGE_KEY);
        console.log("Tous les scores ont été supprimés du localStorage.");
        // Il faudrait aussi supprimer les scores intermédiaires des exercices si vous les stockez séparément
        // Par exemple: localStorage.removeItem('module_X_exY_score');
    } catch (e) {
        console.error("Erreur lors de la suppression des scores:", e);
    }
}

// Pour que les fonctions soient accessibles globalement (si les scripts sont dans des fichiers séparés)
// Si vous utilisez des modules ES6, vous feriez des 'export'.
// Sinon, elles sont implicitement globales si ce script est inclus avant bilan_page.js