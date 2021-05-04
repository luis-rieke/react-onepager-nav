import React, { useContext } from 'react';
import { NavContext } from '../context/NavContext';

const NavLink = ({ navLinkId, scrollToId }) => {
	// activeNavLinkId is the nav element that should receive activeClass styling
	const { activeNavLinkId, setActiveNavLinkId } = useContext(NavContext);

	// vertical scroll takes a classSelector === .sectionName
	const scrollToSection = elementId =>
		document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });

	// onClick, nav elements set the activeNavLinkId on NavContext
	// and scroll to their corresponding selector + element in the DOM
	const handleClick = () => {
		setActiveNavLinkId(navLinkId);
		scrollToSection(scrollToId);
	};

	// each NavLink uses its navLinkId as its content
	return (
		<span
			id={navLinkId}
			className={activeNavLinkId === navLinkId ? 'activeClass' : ''}
			onClick={handleClick}
		>
			{navLinkId}
		</span>
	);
};

export default NavLink;
