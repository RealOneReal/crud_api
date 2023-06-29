import { v4 } from 'uuid';

export interface User {
    id?: string;
    username: string;
    age: number;
    hobbies:string[]
};


export const users: User[] = [
    {
    id: v4(),
    username: 'Mishka',
    age: 25,
    hobbies:['fishing', 'tv']
    }, {
        id: v4(),
        username: 'Mikola',
        age: 33,
        hobbies:['beerYoga', 'gaming']
    },
];
