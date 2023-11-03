import { sumTwo } from '../puzzle-solution-functions/sumTwo';

it('Should add 1 + 2 to equal 3', () => {
  const result: number = sumTwo(1, 2);
  expect(result).toBe(3);
});
