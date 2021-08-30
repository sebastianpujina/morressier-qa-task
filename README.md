# Morressier event page test scenarios

This repository covers a list of test scenarios written for the [Morressier event page](https://www.morressier.com/event/5e733c5acde2b641284a7e27). Some of them have been automated using [Cypress](https://www.cypress.io/).

## Test scenarios

For the manual testing of the event page, I started creating the test scenarios that cover the critical paths, the scenarios that allow the user to find all the necessary information regarding the event and its contents. After the critical paths were covered I continued covering scenarios that don't have a very high impact on the user journey but they can make the user journey more or less pleasant; such scenarios cover negative scenarios, user experience, accessibility, performance of the application etc.

The tests have been covered cross-browser and on different resolutions, including mobile.

Below I cover the list of test scenarios together with bugs, observations, or potential improvements.

### Event landing page

1. Should display all event information
   1. Cover image, avatar, type of event -> The cover would look better with a higher quality image. It would be nice to be able to click on the avatar and see a larger image to be able to read it. - **low priority, low severity**
   1. Title
   1. Date of event, location, host website
   1. Subtitle
   1. Useful links from the description should open in a new tab
1. Should display the organization that hosts the event
   1. Clicking on the name should redirect to the organization page -> When accessing the page, the request for the organization stats is slow (~ 2 seconds) and it blocks the loading of the whole page, it would be nice if the page would load with a placeholder for the stats and the actual stats would be displayed after the request is finished, this way the loading seems faster for the user - **low priority, low/medium severity depending on the amount of data to be processed by the backend**

### Submissions list with searching and filtering

#### Searching

1. Searching should return correct data based on the search term -> When searching for "chr" or "chrom" which is part of the title from the first article only 1 article is returned and it's not the first one, this implies that searching is not optimized. - **low priority, medium severity - the user might not be able to find what it needs**
   1. The following search terms have been used for testing: whole worlds, part of words, authors, keywords from articles, numbers, special characters etc.
1. Should display the number of submissions -> A total number of submissions can provide useful information for the user, e.g: 47/11,710 - **low priority, low severity**
1. Text should fit correctly in the search input -> The search icon overlaps text if it's too long - **low priority, low severity**
1. Search button -> The Mouse icon doesn't turn into "button mode" when hovering the search icon, the search icon is a bit too small and can be hard to click - **low priority, low severity**
1. "Clear search" link should reset search
1. When no articles are found for a search term there should be no articles and the pagination should disappear
1. The searching should not be lost if the page is refreshed
1. The searching should not be lost when navigating back from an article

#### Filtering

1. Should display data based on filters -> When applying a filter on a smaller resolution (e.g: 1280 x 720 pixels) the page is updated with new articles but the page is scrolled up and the list of articles is not visible anymore - **low priority, low severity**
1. Should clear search term when applying filters -> Since it's not possible to search while filters are applied, the search bar should be cleared when applying filters, otherwise the user might get confused on the provenience of the data that is displayed - **low priority, low severity**
   1. Filters from the same category
   1. Filters from different categories
   1. Multiple filters
1. "Clear all filters" should reset search
1. Applied filter should be visible and number of total applied filters should update correctly
1. Removing an applied filter should update the data correctly
1. Filter sidebar should be closed when pressing on "Close" or on the main page
1. Should expand/contract categories
1. "Show 10 more" should display more options
1. Searching for keywords should display relevant options
1. The filters should not be lost if the page is refreshed
1. The filters should not be lost when navigating back from an article

### Article card

1. Should display all data
   1. Cover image
   1. Title
   1. Descriptions
   1. Author
   1. Submission date
   1. Keywords
   1. Number of views and downloads
1. Should fit correctly in the page on multiple resolutions and devices
1. Should redirect to article when clicked -> There isn't a link where middle click can be used to open the article in new tab - **medium priority, low severity** - when doing research a lot of users tend to open multiple tabs and then go through them, if an article can't be opened in a new tab it forces the user to lose time traveling back to the whole list
1. Should be highlighted on hover

### Pagination

1. Should be visible -> it can be useful to add the first and last page in the list as well, e.g: 1 ... 10 11 12 13 14 ... 99 - **low priority, low severity**
1. When pressing on a page number it should display data correctly -> When clicking on the next page that is higher (e.g: going from 1 to 2) the list of articles remains the same even if the backend request returns different articles - **high priority, high severity** - it will be detailed below
1. "Next" button should be visible on all pages but the last and should work correctly
1. "Previous" button should be visible on all pages but the first and should work correctly

### Notes

- Even if most bugs or improvements are marked as low priority, there are a lot of them that take a small effort to fix or apply them and could offer the user a better experience overall.
- The layout of the page is very good overall and can be used easily but some improvements can be made, for example, the article cards could align better with search&filters and event details, search bar can be longer when the resolution permits it, number of articles per page should be configurable, this way it will be easier to browse through the articles on mobile.
- Accessibility testing failed for articles because they can't be accessed/navigated via tab + enter
- I was expecting to be possible to search with filters applied but instead the filters are removed.

## Example of a bug report

**Title**

Article list is not updated when clicking on next page.

**Description**

When accessing a page initially (or after refresh) when clicking on the next page that is higher (e.g: going from 1 to 2, or going from 3 to 4) the list of articles remains the same even if the backend request returns different articles. The issue is not reproduced when descending from page 2 to page 1, or when going from page 1 to page 3. If I go from page 1 to page 3 and it works fine, if I press on page 4 it will work correctly.

**Steps to reproduce**

1. Access https://www.morressier.com/event/acsspring2020expo/5e733c5acde2b641284a7e27
1. Press on page 2

   OR

1. Access https://www.morressier.com/event/acsspring2020expo/5e733c5acde2b641284a7e27?page=3
1. Press on page 4
   Note:

- if the issue doesn't reproduce try to refresh the page before step #2.
- the issue can also be reproduced when pressing "Next"

**Actual**

The list of articles remains the same from the previous page.

**Expected**

The list of articles should update based on the collection returned from the search request.

**Device/browser list**

The issue was reproduced on Google Chrome and Edge on Windows and on Google Chrome on Android.
