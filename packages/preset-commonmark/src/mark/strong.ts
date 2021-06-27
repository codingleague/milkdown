import { MarkParserSpec, SerializerMark } from '@milkdown/core';
import type { Keymap } from 'prosemirror-commands';
import { toggleMark } from 'prosemirror-commands';
import type { InputRule } from 'prosemirror-inputrules';
import type { MarkSpec, MarkType } from 'prosemirror-model';
import { CommonMark, markRule } from '../utility';

export class Strong extends CommonMark {
    override readonly id = 'strong';
    override readonly schema: MarkSpec = {
        parseDOM: [
            { tag: 'b' },
            { tag: 'strong' },
            { style: 'font-style', getAttrs: (value) => (value === 'bold') as false },
        ],
        toDOM: (mark) => ['strong', { class: this.getClassName(mark.attrs) }],
    };
    override readonly parser: MarkParserSpec = {
        match: (node) => node.type === 'strong',
        runner: (markType, state, node) => {
            state.stack.openMark(markType);
            state.next(node.children);
            state.stack.closeMark(markType);
        },
    };
    override readonly serializer: SerializerMark = {
        open: '**',
        close: '**',
    };
    override readonly inputRules = (markType: MarkType): InputRule[] => [
        markRule(/(?:__)([^_]+)(?:__)$/, markType),
        markRule(/(?:\*\*)([^*]+)(?:\*\*)$/, markType),
    ];
    override readonly keymap = (markType: MarkType): Keymap => ({
        'Mod-b': toggleMark(markType),
    });
}