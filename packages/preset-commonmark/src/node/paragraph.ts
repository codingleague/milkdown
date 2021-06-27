import type { NodeSpec } from 'prosemirror-model';
import { NodeParserSpec, SerializerNode } from '@milkdown/core';
import { CommonNode } from '../utility/base';

export class Paragraph extends CommonNode {
    override readonly id = 'paragraph';
    override readonly schema: NodeSpec = {
        content: 'inline*',
        group: 'block',
        parseDOM: [{ tag: 'p' }],
        toDOM: (node) => ['p', { class: this.getClassName(node.attrs) }, 0],
    };
    override readonly parser: NodeParserSpec = {
        match: (node) => node.type === this.id,
        runner: (type, state, node) => {
            state.stack.openNode(type);
            if (node.children) {
                state.next(node.children);
            } else {
                state.addText(node.value as string);
            }
            state.stack.closeNode();
        },
    };
    override readonly serializer: SerializerNode = (state, node) => {
        state.renderInline(node).closeBlock(node);
    };
}