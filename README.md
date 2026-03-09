# 1. Difference between var, let, and const?
var is the old way; it can be updated and re-declared anywhere in the function, which often leads to bugs. let is the modern choice for variables that need to change (like a counter), as it is block-scoped. const is for things that stay the same (like an API URL).

# 2. What is the spread operator (...)?
It's a shortcut to "unpack" an array or object. Instead of looping, you can use ... to copy elements from one array into a new one or combine two objects easily.

# 3. Difference between map(), filter(), and forEach()?

***forEach*** is just for looping—it doesn't return anything.

***map*** transforms every item and returns a new array of the same length.

***filter*** checks every item against a condition and returns a shorter array containing only the items that passed.

# 4. What is an arrow function?
It's a shorter way to write functions using =>. It doesn't just save typing; it also handles the this keyword differently, making it very popular in modern JS development.

# 5. What are template literals?
Instead of using quotes and + signs to join strings and variables, you use backticks (`). This lets you inject variables directly using ${variableName}, which makes building HTML strings much cleaner.
