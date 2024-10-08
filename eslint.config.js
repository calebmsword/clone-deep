import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [{
    files: ['**/*.js'],
    ignores: ['tsdist/**/*.js', 'build/**/*', 'example.js'],
    plugins: {
        '@s': stylisticJs
    },
    rules: {
        // https://eslint.style/rules
        '@s/array-bracket-spacing': ['error', 'never'],
        '@s/arrow-parens': ['error', 'always'],
        '@s/arrow-spacing': 'error',
        '@s/block-spacing': 'error',
        '@s/brace-style': 'error',
        '@s/comma-dangle': ['error', 'never'],
        '@s/comma-spacing': 'error',
        '@s/comma-style': 'error',
        '@s/computed-property-spacing': 'error',
        '@s/dot-location': ['error', 'property'],
        '@s/eol-last': 'error',
        '@s/function-call-spacing': 'error',
        '@s/function-call-argument-newline': ['error', 'consistent'],
        '@s/indent': ['error', 4, {
            FunctionExpression: {
                parameters: 'first'
            },
            CallExpression: {
                arguments: 'first'
            },
            offsetTernaryExpressions: false,
            ignoreComments: false
        }],
        '@s/key-spacing': 'error',
        '@s/keyword-spacing': 'error',
        '@s/lines-between-class-members': 'error',
        '@s/max-len': ['error', {
            // the limit is really 80 characters, but using 81 will allow a
            // semicolon to 'not count' in the limit
            code: 81,
            ignoreUrls: true,
            // This will match jsdoc annotations of the sort:
            //    @<annotation> {<Type>}
            // Typing in jsdoc can get very verbose so allow flexibility there
            ignorePattern: '[\\w\\W]*\\s*@[\\w\\W]*\\s*\\{'
        }],
        '@s/new-parens': ['error', 'always'],
        '@s/no-floating-decimal': 'error',
        '@s/no-mixed-operators': 'error',
        '@s/no-mixed-spaces-and-tabs': 'error',
        '@s/no-multi-spaces': 'error',
        '@s/no-multiple-empty-lines': 'error',
        '@s/no-trailing-spaces': 'error',
        '@s/no-whitespace-before-property': 'error',
        '@s/object-curly-spacing': ['error', 'always', {
            objectsInObjects: false
        }],
        '@s/quote-props': ['error', 'as-needed'],
        '@s/quotes': ['error', 'single', {
            allowTemplateLiterals: true
        }],
        '@s/rest-spread-spacing': 'error',
        '@s/semi': ['error', 'always'],
        '@s/semi-spacing': 'error',
        '@s/space-before-blocks': 'error',
        '@s/space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        '@s/space-in-parens': 'error',
        '@s/space-infix-ops': 'error',
        '@s/space-unary-ops': 'error',
        '@s/spaced-comment': ['error', 'always'],
        '@s/switch-colon-spacing': 'error',
        '@s/template-curly-spacing': 'error',
        '@s/template-tag-spacing': 'error',
        '@s/wrap-iife': 'error',


        // https://eslint.org/docs/latest/rules/#possible-problems
        'array-callback-return': 'error',
        'constructor-super': 'error',
        'for-direction': 'error',
        'getter-return': 'error',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-const-assign': 'error',
        'no-constant-binary-expression': 'error',
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-else-if': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'error',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-ex-assign': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-import-assign': 'error',
        'no-inner-declarations': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-obj-calls': 'error',
        'no-promise-executor-return': 'error',
        'no-prototype-builtins': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-setter-return': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-this-before-super': 'error',
        'no-undef': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unsafe-optional-chaining': 'error',
        'no-unused-private-class-members': 'error',
        'no-unused-vars': 'error',
        'no-use-before-define': 'error',
        'no-useless-backreference': 'error',
        'require-atomic-updates': ['error', { allowProperties: true }],
        'use-isnan': 'error',
        'valid-typeof': 'error',


        // https://eslint.org/docs/latest/rules/#suggestions
        'arrow-body-style': ['error', 'always'],
        camelcase: 'error',
        curly: 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        eqeqeq: ['error', 'always'],
        'func-names': ['error', 'as-needed'],
        'func-style': ['error', 'expression', { allowArrowFunctions: true }],
        'new-cap': ['error', { newIsCap: true }],
        'no-bitwise': ['error', { int32Hint: true }],
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-continue': 'error',
        'no-delete-var': 'error',
        'no-else-return': 'error',
        'no-empty': 'error',
        'no-empty-static-block': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-global-assign': 'error',
        'no-implicit-coercion': 'error',
        'no-implied-eval': 'error',
        'no-invalid-this': 'error',
        'no-iterator': 'error',
        'no-label-var': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'error',
        'no-multi-assign': 'error',
        'no-multi-str': 'error',
        'no-nested-ternary': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-nonoctal-decimal-escape': 'error',
        'no-octal': 'error',
        'no-proto': 'error',
        'no-redeclare': 'error',
        'no-regex-spaces': 'error',
        'no-return-assign': 'error',
        'no-shadow': 'error',
        'no-shadow-restricted-names': 'error',
        'no-throw-literal': 'error',
        'no-unneeded-ternary': 'error',
        'no-unused-labels': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-escape': 'error',
        'no-useless-rename': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'object-shorthand': 'error',
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'one-var': ['error', 'never'],
        'prefer-const': 'error',
        'prefer-destructuring': ['error', { object: true, array: false }],
        'prefer-exponentiation-operator': 'error',
        'prefer-object-has-own': 'error',
        'prefer-object-spread': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'require-yield': 'error',
        strict: ['error', 'never'],
        'symbol-description': 'error'
    },
    languageOptions: {
        sourceType: 'module',
        globals: { ...globals.browser, ...globals.node },
        ecmaVersion: 2022
    }
}];
