import { Certificat } from 'src/models/Certificat';
import { CentreFormation } from 'src/models/CentreFormation';
import { Employee } from 'src/models/Employee';

export interface CertificatDetails{
    dateDebutFormation: string;
    dateObtention: string;
    note : number;
    certificat : Certificat;
    centreFormation:  CentreFormation;
    employe : Employee;
}