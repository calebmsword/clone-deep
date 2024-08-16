import _cloneDeep from './src/clone-deep/clone-deep.js';
import _cloneDeepFully from './src/clone-deep-fully/clone-deep-fully.js';
import _useCustomizers from './src/use-customizers.js';

export default _cloneDeep;
export const cloneDeepFully = _cloneDeepFully;
export const useCustomizers = _useCustomizers;
export { CLONE } from './src/utils/constants.js';
