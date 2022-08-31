import { Employee } from 'src/models/employee';
import { Direction } from 'src/models/Direction';
export interface Pole{
    id: number;
    pole: string;
    description: string;
    responsablePole: string;
    direction : Direction;
    manager: Employee;

}