# Use React Custom Hooks and Context to Design a Responsive Single-Page Nav Bar

Static single-page scrollable sites present a fun navigation challenge! If you've built single-page apps with React, chances are you've used React Router to render your components at specified URIs -- and if you've built a single-page scrollable site where all components are rendered at the same URI, you already know the wrinkle in the laundry: namely, how do we direct the user to a particular <em>area</em> of the site and reflect that navigation in a nav bar?

There are two kinds of user navigation we'd like to support:

1. As a user, I want to click a nav element and have that element scroll into my viewport.

2. As a user, I want to "infinite" scroll and see where I am on the page reflected in the nav bar.

User story #1 seems straight-forward: we can hang a `ref` on whichever container we'd like to navigate to in our single-page and use the Element interface's `scrollIntoView()` method to move that container into the viewport when the corresponding `nav` element is clicked. User story #2 isn't quite as clear-cut, and its central problem might not immediately be apparent in user story #1, but it's lurking under the surface -- how will our nav elements <strong>know</strong> which container is currently in the viewport, and how will we pass this information up the food chain so that nav elements can be rendered accordingly?

If we didn't have to worry about the nav bar <em>responding</em> to the user's position in our site, we could simply apply an `activeClass` alongside our `scrollIntoView` call by storing the elementId in the Nav component's local state:

```javascript
import React, {useState} from 'react'

// store an array of objects containing navLinkId, scrollToId strings
// each navLinkId corresponds to a childElement of the Nav component's <nav> element
// use these to map and generate NavLink components in our Nav parent component
const navLinks = [
  {navLinkId: 'Home', scrollToId: 'homeContainer'},
  ...
]

const NavLink = ({ navLinkId, scrollToId }) => {
	return (
		<span id={navLinkId} onClick={() => handleNavClick(navLinkId, scrollToId)}>
			{navLinkId}
		</span>
	);
};

const Nav = () => {
	// set the activeElement the clicked elementId
	const [activeNavLinkId, setActiveNavLinkId] = useState('');

	// handleNavClick takes an elementId
	const handleNavClick = (navLinkId, scrollToId) => {
		setActiveElement(navLinkId);
		document.getElementById(scrollToId).scrollIntoView({
			behavior: 'smooth', // gives an ease-in-out effect to our scroll
		});
	};

  return (
    <nav>
      {navLinks.map(
        ({navLinkId, scrollToId}) =>
          <NavLink navLinkId={navLinkId} scrollToId={scrollToId}/>
      )}
    </nav>
  )
};
```

Hooray! We've fulfilled user story #1. So by the `Pareto Principle` we know that with 80% of the work done, the last 20% -- user story #2 -- will be equal in complexity to user story #1.

## Dude, where's my user?

Keeping tabs on the user's whereabouts shouldn't be too difficult: we've got an imperative handle (the `containerRef`) to each of our navigable targets that we can leverage to determine if the corresponding container is visible. We'll make this happen with the `IntersectionObserver` API, which will allow us to create an intersection <em>observer</em> to notify us when -- and importantly, to what extent -- its observable target enters user's viewport.

```javascript
  const options = {
    root: document.querySelector('#scrollArea')
    rootMargin: '0px',
    threshold: 1.0,
  }

  const observer = new IntersectionObserver(callback, options)
```

An `IntersectionObserver` instance takes a callback function and an options object consisting of:

1. a `root element` that will allow us to compare the position of our possibly-intersecting `containerRef` to an element or (if left unspecified) the browser viewport,

2. a `rootMargin` (written as a stringified CSS margin property) that will allow us to expand or contract the footprint of our `root element`'s bounding box before computing intersections, and

3. a `threshold` value (or array of values) between 0.0 - 1.0, which will help us calibrate the sensitivity of our observer by setting breakpoints as a function of the intersecting element's total area.

We'll leave `root element` and `rootMargin` to their default values -- we'd simply like to detect if a vertically-stacked container has entered the user's viewable page area, and the browser viewport with default margins of 0px will do the job -- but we may need to (eventually) calibrate our `threshold`.

The callback we'll pass to our observer receives an `entries` array and the `observer` instance. The `entries` array is a collection of `IntersectionObserverEntry` instances that hook into various properties of the relationship between the intersecting element and our `root element`. We'll use the `entry.isIntersecting` boolean to register our `containerRef`.

Great! We've solved a key issue related to fulfilling user story #2: when our user scrolls, we'll be able to track elements as they enter the viewport. Let's build a custom hook to create each `containerRef` and an associated `IntersectionObserver` instance. All credit goes to StackOverflow user (Creaforge)[https://stackoverflow.com/users/3013279/creaforge?tab=profile] for building a custom hook for just this purpose!

```javascript
import { useState, useEffect } from 'react';

export const useOnScreen = ref => {
	const [isOnScreen, setOnScreen] = useState(false);

	const observer = new IntersectionObserver(
		([entry]) => setOnScreen(entry.isIntersecting),
		{
			threshold: [0.25, 0.5, 0.75],
		}
	);

	useEffect(() => {
		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	});

	return isOnScreen;
};
```

Let's compose `useOnScreen` to create a custom hook, `useNav`, which will allow us to generate and return an observed `containerRef` whose ref.current.id will be registered on a `NavProvider` accessed via `useContext`!

As an aside -- if you're a little unsure of your footing with React Context API, please check out my article (Rebuilding an Imperatively-Coded Game from Scratch in React)[https://medium.com/geekculture/rebuilding-an-imperatively-coded-game-from-scratch-in-react-9a082ad002c0] where I lay out a good general strategy for implementing React Contexts, a lightweight alternative to Redux that helps compartmentalize and manage pieces of state.

Our `NavContext` consists of a `Context` instance generated with `React.createContext()`, and a NavProvider that gives our `useNav` hook access to an updater function that we'll use to set the `activeNavLinkId` that was previously handled by our `Nav` component.

But wait! Why reinvent the wheel? We've already got local state management, and all we'd need to do is modify our `useNav` hook to accept `setActiveNavLinkId` by passing it to each component that we'd like to register for observation. The two solutions are quite similar, and it seems to be a matter of preference.

In this case I've chosen to go with a `NavProvider` as it'll let us encapsulate <strong>all of our Context logic</strong> in `useNav`, which will give us a more maintainable codebase. (All things equal, it's best to prioritize <em>maintainability</em> over brevity...)

```javascript
import React, { useState } from 'react';

export const NavContext = React.createContext();

const NavProvider = ({ children }) => {
	const [activeNavLinkId, setActiveNavLinkId] = useState('');

	const providerValue = {
		activeNavLinkId,
		setActiveNavLinkId,
	};

	return (
		<NavContext.Provider value={providerValue}>{children}</NavContext.Provider>
	);
};
```

```javascript
import { useRef, useContext, useEffect } from 'react';
import { useOnScreen } from './useOnScreen';
import { NavContext } from '../context/NavContext';

// useNav takes a navLinkId and returns a ref
// this ref can be used to navigate to the ref
// in a single-page scrollable site

export const useNav = navLinkId => {
	const ref = useRef(null);

	const { setActiveNavLinkId } = useContext(NavContext);

	const isOnScreen = useOnScreen(ref);

	useEffect(() => {
		if (isOnScreen) {
			setActiveNavLinkId(navLinkId);
		}
	}, [isOnScreen, setActiveNavLinkId, navLinkId]);

	return ref;
};
```

Now to roll-out our hook and have some fun! First, we'll wrap the contents of our top-level `App` component in our `NavProvider`.

```javascript

```
