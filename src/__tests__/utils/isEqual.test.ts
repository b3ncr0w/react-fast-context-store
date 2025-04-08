import { isEqual } from '../../storeUtils';

describe.only('isEqual', () => {
  // Basic types
  it('should compare primitive types correctly', () => {
    // Same values
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('test', 'test')).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    
    // Different values
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('test', 'other')).toBe(false);
    expect(isEqual(true, false)).toBe(false);
    
    // Different types
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(null, 0)).toBe(false);
    
    // Special cases
    expect(isEqual(NaN, NaN)).toBe(false); // NaN is not equal to itself
  });
  
  // Arrays
  it('should compare arrays correctly', () => {
    // Same arrays
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([], [])).toBe(true);
    
    // Different arrays
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false); // Different lengths
    
    // Nested arrays
    expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
    expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
  });
  
  // Objects
  it('should compare objects correctly', () => {
    // Same objects
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
    expect(isEqual({}, {})).toBe(true);
    
    // Different objects
    expect(isEqual({a: 1, b: 2}, {a: 1, b: 3})).toBe(false);
    expect(isEqual({a: 1}, {a: 1, b: 2})).toBe(false); // Different properties
    
    // Nested objects
    expect(isEqual({a: {b: 1}}, {a: {b: 1}})).toBe(true);
    expect(isEqual({a: {b: 1}}, {a: {b: 2}})).toBe(false);
    
    // Different property order
    expect(isEqual({a: 1, b: 2}, {b: 2, a: 1})).toBe(true);
  });
  
  // Mixed types
  it('should compare mixed types correctly', () => {
    const obj1 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: {f: 4, g: 5}
    };
    
    const obj2 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: {f: 4, g: 5}
    };
    
    const obj3 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 4], // Different value
      e: {f: 4, g: 5}
    };
    
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });
  
  // Special cases
  it('should handle special cases correctly', () => {
    // Date objects
    const date1 = new Date(2020, 0, 1);
    const date2 = new Date(2020, 0, 1);
    const date3 = new Date(2020, 0, 2);
    
    expect(isEqual(date1, date2)).toBe(true);
    expect(isEqual(date1, date3)).toBe(false);
    
    // Circular references
    const obj1: any = {a: 1};
    obj1.self = obj1;
    
    const obj2: any = {a: 1};
    obj2.self = obj2;
    
    const obj3: any = {a: 2};
    obj3.self = obj3;
    
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
    
    // Edge cases
    expect(isEqual({a: 1}, {b: 1})).toBe(false); // Same values, different keys
    expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false); // Same values, different order
    expect(isEqual({}, 1)).toBe(false); // Different types
  });
}); 