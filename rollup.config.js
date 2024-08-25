import { babel } from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';

export default [{
    input: './index.js',
    output: {
        exports: 'named',
        file: 'build/index.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            babelHelpers: 'bundled'
        })
    ],
    onLog(level, log, handler) {
        if (log.code === 'CIRCULAR_DEPENDENCY') {
            return; // Ignore circular dependency warnings
        }
        handler(level, log);
    }
}, {
    input: 'cms-clone-deep.d.ts',
    output: {
        file: 'build/index.d.ts'
    },
    plugins: [dts()]
}];
