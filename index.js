import _cloneDeep, {
    cloneDeepAsync as _cloneDeepAsync
} from './src/clone-deep/clone-deep.js';
import _cloneDeepFully, {
    cloneDeepFullyAsync as _cloneDeepFullyAsync
} from './src/clone-deep-fully/clone-deep-fully.js';
import _useCustomizers from './src/use-customizers.js';

export default _cloneDeep;
export const cloneDeepAsync = _cloneDeepAsync;
export const cloneDeepFully = _cloneDeepFully;
export const cloneDeepFullyAsync = _cloneDeepFullyAsync;
export const useCustomizers = _useCustomizers;
export { CLONE } from './src/utils/constants.js';
