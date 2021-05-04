import React from 'react';
import NavLink from './NavLink';
import { navLinks } from './navLinks';
import './Nav.css';

/*
 *		each navLink is an object structured:
 *
 *		{
 *			navLinkId: string -> id of NavLink container,
 *			scrollToId: string -> id of Page container to scroll to onClick
 *		}
 */

const Nav = () => {
	return (
		<nav>
			{navLinks.map(({ navLinkId, scrollToId }, idx) => (
				<NavLink key={idx} navLinkId={navLinkId} scrollToId={scrollToId} />
			))}
		</nav>
	);
};

export default Nav;
