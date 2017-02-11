import { expect } from 'chai';

import task from '../src';

describe('basic', () => {
  it('should return function', () => {
    expect(task).to.be.a('function');
  });

  it('should return function -> function', () => {
    expect(task()).to.be.a('function');
  });

  it('should return function -> function -> function', () => {
    expect(task()()).to.be.a('function');
  });
});
