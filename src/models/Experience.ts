import { Poste } from 'src/models/Poste';
import { Employee } from 'src/models/Employee';
import { Entreprise } from 'src/models/Entreprise';

export interface Experience{
    id:number;
    dateDebut: string;
    dateFin: string;
    poste: string;
    salaireBrute: string;
    raisonDepart: string;
    employe : Employee;
    entreprise: Entreprise;
}