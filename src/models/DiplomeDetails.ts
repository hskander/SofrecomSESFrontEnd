import { Institut } from 'src/models/Institut';
import { Diplome } from 'src/models/Diplome';
import { Employee } from 'src/models/Employee';

export interface DiplomeDetails{
    id:number;
    dateDebutFomation: string;
    dateObtention: string;
    mention: string;
    diplome: Diplome;
    institut: Institut;
    employe: Employee;
}