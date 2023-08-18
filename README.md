# oBundle_bigcommerce_test
### Preview Code:  w9rdcw2dre
### Store URL: https://trial-store-a4.mybigcommerce.com

## Setup
----------
Sign up for a BigCommerce trial store, this will be valid for 15 days and will be needed to complete the test
Install Stencil CLI for local development, you will be using the default Cornerstone Theme that comes standard with new BigCommerce stores

* Refer to the BigCommerce developer documentation for any questions you might have. It will contain all the info needed to complete the tasks below


## Task
----------
Create a product called Special Item which will be assigned to a new category called Special Items. Be sure to add at least 2 images during the product creation

The Special Item should be the only item which shows in this category - create a feature that will show the product's second image when it is hovered on.
Add a button at the top of the category page labeled Add All To Cart. When clicked, the product will be added to the cart. Notify the user that the product has been added.
If the cart has an item in it - show a button next to the Add All To Cart button which says Remove All Items. When clicked it should clear the cart and notify the user.
Both buttons should utilize the Storefront API for completion.

## Bonus
----------
If a customer is logged in - at the top of the category page show a banner that shows some customer details (i.e. name, email, phone, etc). This should utilize the data that is rendered via Handlebars on the Customer Object.

# My Process
----------
For the tasks, I started by adding the Special Items category, and then the Special Product item to that category using the BigCommerce storefront editor.  Then cloned the cornerstone theme github repo, and searched through the file structure and used the browser inspector to locate the file containing code for the product categories, which was in templates/pages/category.html.  Here I added the buttons and notifications needed to complete the task. I added comments in the code to help explain my changes. I then located the corresponding javascript file in assets/js/theme/category.js and added the logic for handling the api calls and showing and hiding buttons and notifications, and switching between images on hover.  I added comments to try to clarify my changes.  Finally, I located the page navigation header file at templates/components/common/navigation.html to add the banner that displays the customer info when the customer is logged in.

Overall it was an enjoyable challenge working on this test.  I hope you enjoy reading my code and thank you for your consideration!

