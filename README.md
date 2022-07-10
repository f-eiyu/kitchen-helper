# Kitchen Helper App concept
An app to keep track of what's in your fridge (and shelves, and pantry...) and what recipes could be made with it.

# Planning
## User Stories
As a user, I want to...
1. log in with a username and password to gain access to the app's functionality. [AUTH]
1. have an app that's completely mobile-friendly.
1. view a homepage hub for the My Kitchen and Recipe Assistant functionality below. [INDEX]
#
## My Kitchen
As a user, I want to...
1. enter an ingredient into My Kitchen, specifying how much I have on hand and whatever tags I want to give it. [NEW]
1. view all of the ingredients, or filter my ingredients by tags. [SHOW]
1. edit, change the amounts of, re-tag, or delete anything in My Kitchen. [EDIT/DELETE]
1. have smart matching/autocompletion to streamline ingredient entry. [NEW/EDIT, stretch goal]
1. have the app automatically handle common unit conversions when adding or removing ingredients. [UPDATE, stretch goal]
1. keep track of expiration dates and send alerts when something in My Kitchen will go bad soon. [SHOW, stretch goal]
1. use the same ingredient library as another user (ex. if I'm living with someone). [stretch goal]
#
## Recipe Assistant
As a user, I want to...
1. have some recipes come preinstalled on the app, if I so choose. [SEED from recipe API]
1. add my own recipes to the app. [NEW]
1. be able to view recipes or filter with various custom parameters. [SHOW]
    - **Core design concept: given the ingredients and their quantities in My Kitchen, display all the recipes that can be made with them**.
1. edit any prebuilt recipes or recipes that I have added. [EDIT]
1. delete any prebuilt recipes or recipes that I have added. [DELETE]
1. select "I made this recipe!" and have the corresponding ingredients automatically deducted from My Kitchen. [UPDATE]
1. tag and categorize recipes -- "breakfast", "dinner", "snack", "dessert", etc. [EDIT/SHOW, stretch goal]
1. set certain ingredients in recipes as "optional", for enhanced filtering and meal planning. [SHOW, stretch goal]
1. filter recipes that are only missing optional ingredients, or missing up to some number of ingredients. [SHOW, stretch goal]
1. share some or all of my recipes with a friend, so that they can view them from their account as well. [AUTH, stretch goal]
#
## Models
- ingredient
  - name
  - alternate names (stretch goal)
  - amount
  - tags
  - expiration (stretch goal)
  - added by (stretch goal)
- recipe
  - name
  - [{ingredient, amount}]
    - optional ingredients (stretch goal)
  - step by step instructions
  - tags (stretch goal)
  - added by (stretch goal)
#
## Wireframes
coming soon!