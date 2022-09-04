import { Employee } from 'src/models/employee';
import { Direction } from 'src/models/direction';

export interface Pole{
    id: number;
    pole: string;
    description: string;
    responsablePole: string;
    direction : Direction;
    manager:Employee;
    employes: Employee[];
}