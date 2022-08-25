import { Employee } from 'src/models/employee';
import { Pole } from 'src/models/Pole';

export interface Direction {
    id: number;
    direction: string;
    description: string;
    responsableDirection: string
    manager:Employee;
    poles:Pole[];

}
