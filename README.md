# BOOK-A-MEAL
Book-A-Meal is an application that allows customers to make food orders and helps the food  vendor know what the customers want to eat. 
# Authenticated mode
To switch to the authenticated mode users need to sign up for an account  on the signup page. When the user  account is created successfully, then the user  can log in on the sign in page. If the credential provided are aunthentic, the user is directed to a user page.  Here the user can do the following:
1.	view  meal menu
2.	order for a meal or more
3.	add a meal to the basket
4.	view order history

some users have specials roles e.g caterer, admin. By default when a user sign up for an account, the role of the user is null. While the admin users have access to all of the features above they can also assign priviledges or a role to users.  


# Roles
The admin user can assign the following roles:
1.	caterer
2.	superuser
3.	admin

A caterer can set menu for the day, add a meal, remove a meal, update a meal , view ordered history, view total money made for the day.
A superuser leverage on the priviledges of a caterer and can also delete a user, freeze user account.
Admin user can perform all of the above and assign priviledges to users.

https://coveralls.io/repos/github/Pomile/BOOK-A-MEAL/badge.svg?branch=user_signup_and_signin-API(Coverage Status)!:https://coveralls.io/github/Pomile/BOOK-A-MEAL?branch=user_signup_and_signin-API