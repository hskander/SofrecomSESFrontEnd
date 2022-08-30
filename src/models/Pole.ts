import { Employee } from 'src/models/employee';

export interface Pole{
    id: number;
    pole: string;
    description: string;
    responsableDirection: string;
    manager:Employee;
    employees: Employee[];
}