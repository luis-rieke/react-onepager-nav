import { useRef, useContext, useEffect } from 'react';
import { useOnScreen } from './useOnScreen';
import { IntersectionContext } from '../context/intersectionContext';

/* useNav takes a nodeId and returns a ref that can be used to navigate to the ref's element in a single-page scrollable site */

export const useNav = nodeId => {
	const ref = useRef(null);

	const { setActiveNodeId } = useContext(IntersectionContext);

	const isOnScreen = useOnScreen(ref);

	useEffect(() => {
		if (isOnScreen) {
			setActiveNodeId(nodeId);
		}
	}, [isOnScreen, setActiveNodeId, nodeId]);

	return ref;
};
