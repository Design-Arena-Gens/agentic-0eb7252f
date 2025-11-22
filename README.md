# Studio Social · Post Facebook Produit

Application Next.js qui permet de transformer rapidement la photo d’un produit en un visuel carré optimisé pour un post Facebook (1080×1080). Téléchargez votre visuel, personnalisez le message marketing et exportez l’image finale en un clic.

## Fonctionnalités
- Import d’une image produit (drag via bouton « Importer »).
- Trois templates graphiques (dégradés, minimal, sombre) avec adaptation des couleurs et textures.
- Trois dispositions de contenu (visuel + texte, focus produit, narratif).
- Génération automatique d’une légende Facebook en français à partir des champs saisis (titre, description, prix, CTA, hashtags) avec copie en un clic.
- Export PNG haute résolution via capture du design (html-to-image).

## Démarrage local
```bash
npm install
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000) pour utiliser l’interface.

## Build & export
```bash
npm run build
npm start
```

## Déploiement
Le projet est configuré pour être déployé sur Vercel (`npm run build` est exécuté automatiquement). Vous pouvez également utiliser la commande fournie :
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-0eb7252f
```
