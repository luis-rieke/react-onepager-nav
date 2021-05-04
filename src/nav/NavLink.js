import React, { useContext } from 'react';
import { IntersectionContext } from '../context/intersectionContext';

const NavLink = ({ nodeId, selector }) => {
	// activeNodeId is the nav element that should receive activeClass styling
	const { activeNodeId, setActiveNodeId } = useContext(IntersectionContext);

	// vertical scroll takes a classSelector === .sectionName
	const scrollToSection = classSelector =>
		document
			.querySelector(classSelector)
			.scrollIntoView({ behavior: 'smooth' });

	// onClick, nav elements set the activeNodeId on IntersectionContext
	// and scroll to their corresponding selector + element in the DOM
	const handleClick = () => {
		setActiveNodeId(nodeId);
		scrollToSection(selector);
	};

	// each NavLink uses its nodeId as its content
	return (
		<span
			id={nodeId}
			className={activeNodeId === nodeId ? 'activeClass' : ''}
			onClick={handleClick}
		>
			{nodeId}
		</span>
	);
};

export default NavLink;
