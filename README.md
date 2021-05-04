# React Single Page Navigation

Use React Custom Hooks and Context to Design a Responsive Single-Page Nav Bar

Static single-page scrollable sites (...paging Dr. Seuss) present a fun navigation challenge! If you've built single-page apps with React, chances are you've used React Router to render your components at specified URIs -- and if you've built a single-page scrollable site where all components are rendered at the same URI, you already know the wrinkle in the laundry, namely, how do we direct the user to a particular <em>area</em> of the site and reflect that navigation in a nav bar?

There are two kinds of user navigation we'd like to support.

1. As a user, I want to click a nav element and have that element scroll into my viewport.

2. As a user, I want to "infinite" scroll and see where I am on the page reflected in the nav bar.

User story #1 seems straight-forward: we can hang a `ref` on whichever container we'd like to navigate to in our single-page and use the Element interface's `scrollIntoView()` method to move that container into the viewport when the corresponding `nav` element is clicked. User story #2 isn't quite as clear-cut, and its central problem might not immediately be apparent in user story #1, but it's lurking under the surface -- how will our nav elements <strong>know</strong> which container is currently in the viewport, and how will we pass this information up the food chain so that nav elements can be rendered accordingly?

Whenever
