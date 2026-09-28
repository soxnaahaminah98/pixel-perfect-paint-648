export type Statut = "En service" | "En panne" | "En maintenance";
export type TypeEquipement = "Laptop" | "PC Fixe" | "Imprimante" | "Smartphone";

export type Equipement = {
  id: string;
  type: TypeEquipement;
  nom: string;
  serie: string;
  os?: string;
  site: string;
  utilisateur: string;
  service: string;
  acquisition: string;
  maintenance?: string;
  observations?: string;
  statut: Statut;
};

export const equipements: Equipement[] = [
  {
    id: "EQ001",
    type: "Laptop",
    nom: "Laptop HP EliteBook 840",
    serie: "SN-HP84021",
    os: "Windows 11",
    site: "Dakar - Siège",
    utilisateur: "Fatou Diallo",
    service: "RH",
    acquisition: "2024-03-12",
    maintenance: "2026-06-01",
    statut: "En service",
  },
  {
    id: "EQ002",
    type: "Imprimante",
    nom: "Imprimante HP LaserJet Pro M404",
    serie: "SN-HPLJ104",
    site: "Dakar - Siège",
    utilisateur: "Moussa Faye",
    service: "IT",
    acquisition: "2023-11-05",
    maintenance: "2026-05-15",
    observations: "Toner à surveiller",
    statut: "En service",
  },
  {
    id: "EQ003",
    type: "PC Fixe",
    nom: "PC Fixe Dell OptiPlex 7010",
    serie: "SN-DL70102",
    os: "Windows 10",
    site: "Dakar - Siège",
    utilisateur: "Ousmane Ndiaye",
    service: "Finance",
    acquisition: "2022-01-20",
    maintenance: "2026-08-10",
    observations: "Écran défectueux",
    statut: "En panne",
  },
  {
    id: "EQ004",
    type: "Imprimante",
    nom: "Imprimante Bixolon SRP-330II",
    serie: "SN-BX33021",
    site: "Kaolack",
    utilisateur: "Aïssatou Sarr",
    service: "Logistique",
    acquisition: "2024-07-01",
    maintenance: "2026-07-01",
    statut: "En service",
  },
  {
    id: "EQ005",
    type: "Laptop",
    nom: "Laptop HP ProBook 450",
    serie: "SN-HP45033",
    os: "Windows 11",
    site: "Kaolack",
    utilisateur: "Aïssatou Sarr",
    service: "Logistique",
    acquisition: "2023-09-10",
    maintenance: "2026-09-20",
    observations: "Batterie à remplacer",
    statut: "En maintenance",
  },
  {
    id: "EQ006",
    type: "Smartphone",
    nom: "Smartphone Samsung Galaxy A54",
    serie: "SN-SGA5401",
    os: "Android 14",
    site: "Dakar - Siège",
    utilisateur: "Fatou Diallo",
    service: "RH",
    acquisition: "2025-02-14",
    statut: "En service",
  },
];
