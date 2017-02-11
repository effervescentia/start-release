import { expect } from 'chai';

import task from '../../lib';

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
