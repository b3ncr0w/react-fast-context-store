import { isEqual } from '../../storeUtils';

describe('isEqual', () => {
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
  it('should compare arrays by reference', () => {
    // Same arrays (same reference)
    const arr1 = [1, 2, 3];
    const arr2 = arr1;
    expect(isEqual(arr1, arr2)).toBe(true);
    
    // Different arrays (different references)
    const arr3 = [1, 2, 3];
    const arr4 = [1, 2, 3];
    expect(isEqual(arr3, arr4)).toBe(false);
    
    // Empty arrays (different references)
    const arr5: any[] = [];
    const arr6: any[] = [];
    expect(isEqual(arr5, arr6)).toBe(false);
    
    // Nested arrays (different references)
    const arr7 = [[1, 2], [3, 4]];
    const arr8 = [[1, 2], [3, 4]];
    expect(isEqual(arr7, arr8)).toBe(false);
  });
  
  // Objects
  it('should compare objects by reference', () => {
    // Same objects (same reference)
    const obj1 = {a: 1, b: 2};
    const obj2 = obj1;
    expect(isEqual(obj1, obj2)).toBe(true);
    
    // Different objects (different references)
    const obj3 = {a: 1, b: 2};
    const obj4 = {a: 1, b: 2};
    expect(isEqual(obj3, obj4)).toBe(false);
    
    // Empty objects (different references)
    const obj5 = {};
    const obj6 = {};
    expect(isEqual(obj5, obj6)).toBe(false);
    
    // Nested objects (different references)
    const obj7 = {a: {b: 1}};
    const obj8 = {a: {b: 1}};
    expect(isEqual(obj7, obj8)).toBe(false);
    
    // Different property order (different references)
    const obj9 = {a: 1, b: 2};
    const obj10 = {b: 2, a: 1};
    expect(isEqual(obj9, obj10)).toBe(false);
  });
  
  // Mixed types
  it('should compare mixed types by reference', () => {
    // Same objects (same reference)
    const obj1 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: {f: 4, g: 5}
    };
    const obj2 = obj1;
    expect(isEqual(obj1, obj2)).toBe(true);
    
    // Different objects (different references)
    const obj3 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 3],
      e: {f: 4, g: 5}
    };
    expect(isEqual(obj1, obj3)).toBe(false);
    
    // Different objects with different values (different references)
    const obj4 = {
      a: 1,
      b: 'hello',
      c: true,
      d: [1, 2, 4], // Different value
      e: {f: 4, g: 5}
    };
    expect(isEqual(obj1, obj4)).toBe(false);
  });
  
  // Special cases
  it('should handle special cases correctly', () => {
    // Date objects
    const date1 = new Date(2020, 0, 1);
    const date2 = new Date(2020, 0, 1);
    expect(isEqual(date1, date2)).toBe(true); // Same time value
    
    // Same date reference
    const date3 = date1;
    expect(isEqual(date1, date3)).toBe(true);
    
    // Different date values
    const date4 = new Date(2020, 0, 2);
    expect(isEqual(date1, date4)).toBe(false);
    
    // Circular references
    const obj1: any = {a: 1};
    obj1.self = obj1;
    
    const obj2: any = {a: 1};
    obj2.self = obj2;
    
    expect(isEqual(obj1, obj2)).toBe(false); // Different references
    
    // Edge cases
    expect(isEqual({a: 1}, {b: 1})).toBe(false); // Different references
    expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false); // Different references
    expect(isEqual({}, 1)).toBe(false); // Different types
  });

  // Performance test with deeply nested objects
  it('should handle deeply nested objects efficiently', () => {
    // Helper to create a deeply nested object
    const createDeepObject = (depth: number, breadth: number): any => {
      if (depth === 0) return 'leaf';
      
      const obj: any = {};
      for (let i = 0; i < breadth; i++) {
        obj[`key${i}`] = createDeepObject(depth - 1, breadth);
      }
      return obj;
    };

    // Create two identical deep objects
    const depth = 10; // 10 levels deep
    const breadth = 5; // 5 properties per level
    const deepObj1 = createDeepObject(depth, breadth);
    const deepObj2 = deepObj1; // Same reference
    
    // Create slightly different deep objects
    const deepObj3 = createDeepObject(depth, breadth);
    deepObj3.key0.key0.key0.key0.key0 = 'different';

    // Measure time for equal objects
    const startEqual = performance.now();
    const resultEqual = isEqual(deepObj1, deepObj2);
    const timeEqual = performance.now() - startEqual;

    // Measure time for different objects
    const startDiff = performance.now();
    const resultDiff = isEqual(deepObj1, deepObj3);
    const timeDiff = performance.now() - startDiff;

    // Log performance metrics
    console.log(`Equal objects comparison took: ${timeEqual.toFixed(2)}ms`);
    console.log(`Different objects comparison took: ${timeDiff.toFixed(2)}ms`);

    // Verify correctness
    expect(resultEqual).toBe(true);
    expect(resultDiff).toBe(false);

    // Performance threshold (adjust based on your needs)
    expect(timeEqual).toBeLessThan(1); // Should complete within 1ms
    expect(timeDiff).toBeLessThan(1); // Should complete within 1ms
  });
}); 