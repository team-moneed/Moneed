import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...compat.config({
        rules: {
            'import/no-anonymous-default-export': 'off',
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }),
    {
        ignores: ['src/generated'],
    },
    // ...compat.plugins('react-refresh'),
    // ...compat.config({
    //     rules: {
    //         'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    //     },
    // }),
];
