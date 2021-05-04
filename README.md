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

Keeping tabs on the user's whereabouts shouldn't be too difficult given that we've got an imperative handle (our `containerRefs`) to each of our navigable targets. The `IntersectionObserver` API gives us a neat way of determining what element is currently in the user's viewport:

```javascript
  const options = {
    root: document.querySelector('#scrollArea')
    rootMargin: '0px',
    threshold: 1.0,
  }

  const observer = new IntersectionObserver(callback, options)
```
