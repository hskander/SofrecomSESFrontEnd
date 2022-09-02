import { Pole } from 'src/models/pole';
import { Poste } from 'src/models/Poste';
import { Projet } from 'src/models/projet';

export interface Employee {
    id: number;
    employeeCode: string;
    nom: string;
    prenom: string;
    genre: string;
    adresse: string;
    dateNaissance: string;
    lieuNaissance: string;
    nationalite : string;
    mail: string;
    dateRecrut : string;
    dateDepart : string;
    numTel: string;
    nomUrgence: string;
    numUrgence: string;
    relationUrgence : string;
    numPasseport: string;
    dateExpPasseport: string;
    numCin: string;
    delivDate: string;
    civilite: string;
    situationFam :string;
    nbEnfant: number;
    salaireBrute: string;
    cnss: boolean;
    matriculeCnss: string;
    bankName: string;
    swift: string;
    rib:string;
    iban: string;
    enConge: boolean;
    pole: Pole;
    poste: Poste;
    projets : Projet[],
  }