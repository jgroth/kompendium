import { h } from '@stencil/core';
import { EnumDescription, EnumMember } from '../../../types';
import { ProplistItem } from '../../proplist/proplist';

export function Enum({ type }: { type: EnumDescription }): HTMLElement[] {
    return [
        <h1 id={type.name}>{type.name}</h1>,
        <kompendium-markdown text={type.docs} />,
        <kompendium-taglist tags={type.docsTags} />,
        <MemberList members={type.members} />,
    ];
}

function MemberList({ members }: { members: EnumMember[] }): HTMLElement[] {
    if (!members.length) {
        return;
    }

    return [<h3>Members</h3>, ...members.map(renderMember)];
}

function renderMember(member: EnumMember) {
    const items: ProplistItem[] = [
        {
            key: 'Value',
            value: member.value,
        },
    ];

    return (
        <div>
            <h4>{member.name}</h4>
            <kompendium-markdown text={member.docs} />
            <kompendium-taglist tags={member.docsTags} />
            <kompendium-proplist items={items} />
        </div>
    );
}
