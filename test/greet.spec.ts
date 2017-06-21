import { sayHello } from '../lib/greet';

describe('sayHello', () => {

    it('should say hello', () => {
        expect(sayHello('Mauri')).toEqual('Hello from Mauri');
    });
});
