import TextLink from './TextLink';
import { PATH } from '@/shared/config';

const navLinks = [
    { href: PATH.SHORTFORM, label: '숏폼' },
    { href: PATH.COMMUNITY, label: '커뮤니티' },
];

interface NavLinksProps {
    links?: { href: string; label: string }[];
}

export default function NavLinks({ links = navLinks }: NavLinksProps) {
    return links.map(({ href, label }) => (
        <TextLink key={href} href={href}>
            {label}
        </TextLink>
    ));
}
