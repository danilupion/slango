import { fail } from '../commands.js';
import { allGlob } from '../globs.js';

const failAll = {
  [allGlob]: [fail],
};

export default failAll;
