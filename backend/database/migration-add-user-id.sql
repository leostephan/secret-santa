-- Migration pour ajouter la colonne user_id dans participants
-- Cette colonne permet de lier un participant à un utilisateur enregistré

ALTER TABLE participants
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);

-- Index pour trouver rapidement les participants par email (pour la liaison)
CREATE INDEX IF NOT EXISTS idx_participants_email_lookup ON participants(email);
