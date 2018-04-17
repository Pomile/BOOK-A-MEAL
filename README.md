# BOOK-A-MEAL
Book-A-Meal is an application that allows customers to make food orders and helps the food  vendor know what the customers want to eat. 
The app consist of two modes, namely, the authenticated mode and unauthenticated mode . 
# Unauthenticated mode
The Home page displays list of meals for the day, and also provides a link to sign in and  signup . 
In this mode Users can see list of meals in the menu for the day. Users can also view menu base on meal category. on each meal, users can do the following:
1.	order a meal 
2.	add meal to the basket

if any the action stated above is performed in this mode, the user will directed to a signup page. 
User can navigate to sign in and sign up pages.
Users needs to switch to authenticated mode have to access to more feature.
# Authenticated mode
To switch to the authenticated mode users need to sign up for an account  on the signup page. When the user  account is created successfully, then the user  can log in on the sign in page. If the credential provided are aunthentic, the user is directed to a user page.  Here the user can do the following:
1.	view  meal menu
2.	order for a meal or more
3.	add a meal to the basket
4.	view order history
on order users will be directed to a page where the user can see 
1.	summary of the meal(s) ordered.
2.	Total price of the orderand,
3.	Order details
4.	total price.


some users have specials roles e.g caterer, admin. By default when a user sign up for an account, the role of the user is null. While the admin users have access to all of the features above they can also assign priviledges or a role to users.  


# Roles
The admin user can assign the following roles:
1.	caterer
2.	superuser
3.	admin


A caterer can set menu for the day, add a meal, remove a meal, update a meal , view ordered history, view total money made for the day.
A superuser leverage on the priviledges of a caterer and can also delete a user, freeze user account.
Admin user can perform all of the above and assign priviledges to users.
