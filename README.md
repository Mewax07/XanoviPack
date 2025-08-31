# XanoviPack

Xanovi Pack. Une librairie personnalisée basée sur les différentes libraires de [Literate](https://github.com/LiterateInk/).

## Crédits

Ce projet utilise du code de [Pawnote.js](https://github.com/LiterateInk/Pawnote.js) par LiterateInk. Tout le mérite revient à l'auteur original.

---

## Installation

Installer les dépendances :

```bash
bun install
```

Lancer le build :

```bash
bun run build
```

Pour rendre le code lisible automatiquement et générer les liens

```bash
bun run parse
```

---

## Utilisation

Basé sur le code de Vexited :

- Projet Pawnote (réécriture personnalisée et ajouts personnels)

---

## Todo List \[Pronote] (Étudiant)

- [ ] Pages & Fonctionnalités
    - [x] Accueil
    - [x] Mes données
        - [x] Compte
        - [x] Documents
            - [x] Obtenir les liens vers les PDF
    - [x] Cahier de textes
        - [x] Contenu et ressources
        - [ ] Travail à faire
            - [x] Voir le cours
            - [ ] Déposer ma copie
            - [x] Cocher "travail fait"
            - [ ] Exécuter les QCM
        - [x] Forums pédagogiques
            - [x] Envoyer un message
            - [x] Supprimer un message
            - [x] Signaler un message
    - [x] Notes
        - [x] Mes notes
        - [x] Relevé
        - [x] Bulletins
            - [x] Mon bulletin
            - [x] Bulletin de la classe
    - [ ] Compétences
        - [x] Évaluations
            - [x] Mes évaluations
            - [x] Difficultés et points d'appui
        - [ ] Bilan périodique
            - [ ] Mon bilan périodique
            - [ ] Bilan de la classe
        - [ ] Bilan par domaine
            - [ ] Évaluations par compétence
            - [ ] Niveau de maîtrise par matière
        - [ ] Bilan de fin de cycle
        - [ ] Livret de compétences numériques
    - [x] Résultats
        - [x] Brevet {@Issue}
    - [ ] Vie scolaire
        - [ ] Emploi du temps
        - [ ] Carnet
        - [ ] Équipe pédagogique
    - [ ] Stage
        - [ ] Fiche
        - [ ] Entreprise
        - [ ] Évaluation de l’accueil
    - [ ] Communication
        - [ ] Informations & sondages
        - [ ] Discussions
        - [ ] Mes rendez-vous
        - [ ] Agenda
        - [ ] Menu

**Vérification** : Tester le fonctionnement avec un compte autre que le compte de démonstration Pronote.

**@Issue** : Indication d'un problème rencontré lors du développement.

## Todo List \[Pronote] (Parent)

- [ ] Pages & Fonctionnalités
    - [x] Acceuil
    - [ ] Informations personnelles
        - [x] Compte
        - [ ] Compte enfant
        - [x] Documents
    - [x] Cahier de textes
        - [x] Contenu et resources
        - [x] Travail à faire
            - [x] Voir le cours
            - [ ] Exécuter le QCM (NOTE: Je sais pas si c'est normal mais bon... ya sur la démo donc je laisse.)
        - [x] Forum pédagogiques (NOTE: Ya rien dans la démo mais les comptes parents on accès 🥀.)
    - [ ] Notes
        - [ ] Les notes
        - [ ] Relevé
        - [ ] Bulletins
            - [ ] Bulletin de l'élève
            - [ ] Bulletin de la classe
    - [ ] Compétences
        - [ ] Evaluations
            - [ ] Les évaluations
            - [ ] Difficulté et points d'appui
        - [ ] Bilan périodique
            - [ ] Bilan périodique de l'élève
            - [ ] Bilan périodique de la classe
        - [ ] Bilan par domaine
            - [ ] Évaluations par compétence
            - [ ] Niveau de maîtrise par matière
        - [ ] Bilan de fin de cycle
        - [ ] Livret de compétences numériques
    - [ ] Résultats
        - [ ] Livret scolaire
        - [ ] Pluriannuel
        - [x] Brevet {@Issue}
    - [ ] Vie scolaire
        - [ ] Emploi du temps
        - [ ] Carnet
        - [ ] Dossiers
        - [ ] Equipe pédagogique
        - [ ] Remplacements
    - [ ] Orientations
        - [ ] Fiche de dialogue
    - [ ] Stage
        - [ ] Fiche
        - [ ] Entreprises
    - [ ] Rencontres Parents/Profs
        - [ ] Desiderata et disponibilités
        - [ ] Planning
    - [ ] Communication
        - [ ] Informations & sondages
        - [ ] Discussions
        - [ ] Mes rendez-vous
        - [ ] Agenda
        - [ ] Menu

---

## Ajouts / Changelog

- _Pawnote_ (Pronote API): **Ajout en cours**
    - [ ] Support compte élève
          ████████████░░░░░░░░░░░░ (42%)

    - [ ] Support compte parent
          ████░░░░░░░░░░░░░░░░░░░░ (17%)

    - [ ] Support compte professeur
          ░░░░░░░░░░░░░░░░░░░░░░░░ (0%)

- _Pawdirecte_ (EcoleDirecte): **Ajout future**

---

## Contribuer

Pour contribuer, merci de suivre ces étapes :

1. Forker ce dépôt
2. Créer une branche pour votre fonctionnalité/correction (`git checkout -b feature/NouvelleFonctionnalité`)
3. Faire vos modifications
4. Committer vos changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
5. Pousser votre branche (`git push origin feature/NouvelleFonctionnalité`)
6. Ouvrir une Pull Request

---

## Problèmes & Demandes de fonctionnalité

- Ouvrir une [issue](https://github.com/Mewax07/XanoviPack/issues) pour signaler un bug ou demander une nouvelle fonctionnalité.
- Décrire clairement votre problème ou suggestion.

---

## Contributing à XanoviPack

Merci de considérer une contribution ! Suivez ces étapes :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité/correction
3. Écrivez un code propre et testé
4. Committez avec un message clair
5. Poussez votre branche
6. Ouvrez une Pull Request

---

## Signalement de problèmes

- Utilisez les Issues de GitHub pour signaler un bug ou demander une fonctionnalité.
- Inclure :
    - Les étapes pour reproduire le problème
    - Comportement attendu vs réel
    - Captures d’écran si nécessaire

---

## Style de code

- Compatible TypeScript + Bun
- Code lisible et documenté
- Formatage cohérent (préférer Prettier)

---
