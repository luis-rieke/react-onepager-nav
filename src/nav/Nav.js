import React from 'react';
import NavLink from './NavLink';
import { navLinks } from './navLinks';
import './Nav.css';

// Nav maps imported navLinks array
// each navLink is an object:
// { nodeId: string, selector: string (CSS className selector) }
// where CSS className selector is written ".exampleCSSSelector"

const Nav = () => {
	return (
		<nav>
			{navLinks.map(({ nodeId, selector }, idx) => (
				<NavLink key={idx} nodeId={nodeId} selector={selector} />
			))}
		</nav>
	);
};

export default Nav;
