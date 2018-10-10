import Stack from '../src/index';
import { SinglyList } from 'ss-linked-list';
import * as Chance from 'chance';
const chance = new Chance();

describe('堆栈 - 构造函数', () => {
  test('默认无参，生成空堆栈', () => {
    const a = new Stack();
    expect(a.length).toBe(0);
    expect(a.isEmpty()).toBeTruthy();
  });

  test('默认接受多个参数，用于初始化生成堆栈', () => {
    const arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    const a = new Stack(...arr);
    expect(a.length).toBe(arr.length);
    expect(a.peek).toBe(arr[arr.length - 1]);
    expect(a.stack).toBeInstanceOf(SinglyList);
    expect(a.isEmpty()).toBeFalsy();
  });
});

describe('堆栈 - peek 属性', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new Stack(...arr);
  });

  test('返回堆栈的顶部元素（头元素）', () => {
    expect(a.peek).toBe(arr[arr.length - 1]);
  });

  test('访问空对堆栈的时候，返回 null', () => {
    const emptyQueue = new Stack();
    expect(emptyQueue.peek).toBeUndefined();
  });
});

describe('堆栈 - push 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 1, max: 10 }));
    a = new Stack(...arr);
  });

  test('入队操作', () => {
    const data = chance.integer();
    expect(a.push(data)).toBeTruthy();
    expect(a.length).toBe(arr.length + 1);
    expect(a.peek).toBe(data);
  });

  test('空对堆栈也支持 push ', () => {
    const data = chance.integer();
    const emptyQueue = new Stack();
    expect(emptyQueue.push(data)).toBeTruthy();
    expect(emptyQueue.length).toBe(1);
    expect(emptyQueue.peek).toBe(data);
  });
});

describe('堆栈 - pop 方法', () => {
  let a, arr;
  beforeEach(() => {
    arr = chance.n(chance.integer, chance.integer({ min: 2, max: 10 }));
    a = new Stack(...arr);
  });

  test('出栈操作', () => {
    const data = chance.integer();
    expect(a.pop()).toBe(arr[arr.length - 1]);
    expect(a.length).toBe(arr.length - 1);
    expect(a.peek).toBe(arr[arr.length - 2]);
  });

  test('空对堆栈也支持 pop ', () => {
    const data = chance.integer();
    const emptyQueue = new Stack();
    expect(emptyQueue.pop()).toBeUndefined();
    expect(emptyQueue.length).toBe(0);
    expect(emptyQueue.peek).toBeUndefined();
  });
});
