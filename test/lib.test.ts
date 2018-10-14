import { uuid } from '../src/lib';

describe('[lib] 方法 - uuid', ()=>{
    test('默认返回', ()=>{
        const id = uuid();
        expect(id).toHaveLength(36);
    });
})