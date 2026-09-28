export type Statut = "En service" | "En panne" | "En maintenance";
export type TypeEquipement = "Laptop" | "PC Fixe" | "Imprimante" | "Smartphone";

export type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  service: string;
  site: string;
  email: string;
};

export type Equipement = {
  id: string;
  type: TypeEquipement;
  modele: string;
  serie: string;
  utilisateurId: string;
  site: string;
  statut: Statut;
  acquisition: string;
  maintenance?: string;
  os?: string;
  observations?: string;
};

export const utilisateurs: Utilisateur[] = [
  { id: "U001", nom: "Diallo", prenom: "Fatou", service: "RH", site: "Dakar - Siège", email: "fdiallo@planinternational.org" },
  { id: "U002", nom: "Ndiaye", prenom: "Ousmane", service: "Finance", site: "Dakar - Siège", email: "ondiaye@planinternational.org" },
  { id: "U003", nom: "Sarr", prenom: "Aïssatou", service: "Logistique", site: "Kaolack", email: "asarr@planinternational.org" },
  { id: "U004", nom: "Faye", prenom: "Moussa", service: "IT", site: "Dakar - Siège", email: "mfaye@planinternational.org" },
];

export const equipementsInitiaux: Equipement[] = [
  { id: "EQ001", type: "Laptop", modele: "HP EliteBook 840", serie: "SN-HP84021", utilisateurId: "U001", site: "Dakar - Siège", statut: "En service", acquisition: "2024-03-12", maintenance: "2026-06-01", os: "Windows 11" },
  { id: "EQ002", type: "Imprimante", modele: "HP LaserJet Pro M404", serie: "SN-HPLJ104", utilisateurId: "U004", site: "Dakar - Siège", statut: "En service", acquisition: "2023-11-05", maintenance: "2026-05-15", observations: "Toner à surveiller" },
  { id: "EQ003", type: "PC Fixe", modele: "Dell OptiPlex 7010", serie: "SN-DL70102", utilisateurId: "U002", site: "Dakar - Siège", statut: "En panne", acquisition: "2022-01-20", maintenance: "2026-08-10", os: "Windows 10", observations: "Écran défectueux" },
  { id: "EQ004", type: "Imprimante", modele: "Bixolon SRP-330II", serie: "SN-BX33021", utilisateurId: "U003", site: "Kaolack", statut: "En service", acquisition: "2024-07-01", maintenance: "2026-07-01" },
  { id: "EQ005", type: "Laptop", modele: "HP ProBook 450", serie: "SN-HP45033", utilisateurId: "U003", site: "Kaolack", statut: "En maintenance", acquisition: "2023-09-10", maintenance: "2026-09-20", os: "Windows 11", observations: "Batterie à remplacer" },
  { id: "EQ006", type: "Smartphone", modele: "Samsung Galaxy A54", serie: "SN-SGA5401", utilisateurId: "U001", site: "Dakar - Siège", statut: "En service", acquisition: "2025-02-14", os: "Android 14" },
];

export const nomComplet = (u?: Utilisateur) => (u ? `${u.prenom} ${u.nom}` : "—");
export const trouverUtilisateur = (id: string) => utilisateurs.find((u) => u.id === id);
