import { User } from "./db";

export const isUser = (data: any): data is User => {
    return 'username' in data && 'age' in data && 'hobbies' in data;
};