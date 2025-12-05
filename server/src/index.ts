import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Chemin vers le build du frontend
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');

// Servir les fichiers statiques du build
app.use(express.static(frontendBuildPath));

// Pour toutes les routes, retourner index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${frontendBuildPath}`);
});
