import { EventPage } from '../../support/ui/pages/index';
import { event } from '../../fixtures/constants/index';
import randomstring from 'randomstring';

const eventPage = new EventPage();

describe('Event page', () => {
  beforeEach(() => {
    eventPage.visitEventPage();
  });

  /**
   *  Notes:
   *  I made the assuption than data can be created via API or directly into db as a prerequisite and is know before the test
   */
  describe('Overview', () => {
    it('Check that event information is correct', () => {
      //Assert
      eventPage.checkEventInformationIsCorrect(event.overview);
    });

    event.overview.externalUrls.forEach((url) => {
      it(`Check that "${url.label}" url is correct and opens in new tab`, () => {
        //Assert
        eventPage.checkUrlIsCorrect(url);
      });
    });

    it('Check that host page is correct and can be accessed', () => {
      //Act
      eventPage.accessHostPage(event.overview.organizer);

      //Assert
      eventPage.checkHostPageIsCorrect(event.overview.organizer);
    });
  });

  describe('Articles', () => {
    it('Check that article contains correct data', () => {
      //Assert
      eventPage.checkArticleContainsCorrectData(event.article);
    });

    it('Check that article can be accessed', () => {
      //Act
      eventPage.accessArticle(event.article.title);

      //Assert
      eventPage.checkArticlePageIsCorrect(event.article.title);
    });
  });

  describe('Searching', () => {
    it('Check that searching works correctly', () => {
      //Act
      eventPage.search(event.article.title);

      //Assert
      eventPage.checkSearchResults(1, event.article.title);
    });

    //Demo of different approach in case we don't know the data beforehand
    it('Check that searching works correctly - v2', () => {
      //Arrange
      eventPage.getFirstArticleTitle().then((title) => {
        //Act
        eventPage.search(title);

        //Assert
        eventPage.checkSearchResults(1, title);
      });
    });

    it('Check that "Clear search" resets article list', () => {
      //Arrange
      eventPage.search(event.article.author);

      //Act
      eventPage.clearSearch().then((numberOfSubmissions) => {
        //Assert
        eventPage.checkSearchResults(numberOfSubmissions, event.article.title);
      });
    });

    it('Check that no articles and no pagination is visible when no results are returned', () => {
      //Act
      eventPage.search(randomstring.generate(10));

      //Assert
      eventPage.checkNoResultsAreReturned();
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      eventPage.openFilterPanel();
    });

    it('Check that filters can be applied', () => {
      //Act
      eventPage.applyFilter().then((numberOfSubmissions) => {
        //Assert
        eventPage.checkFilterIsApplied(numberOfSubmissions);
      });
    });

    it('Check that "Clear all filters" resets article list', () => {
      //Arrange
      eventPage.applyFilter();

      //Act
      eventPage.clearAllFilters().then((numberOfSubmissions) => {
        //Assert
        eventPage.checkFilterIsNotApplied(numberOfSubmissions);
      });
    });

    it('Check that filter can be removed', () => {
      //Arrange
      eventPage.applyFilter();

      //Act
      eventPage.removeFilter().then((numberOfSubmissions) => {
        //Assert
        eventPage.checkFilterIsNotApplied(numberOfSubmissions);
      });
    });

    it('Check that filter options can be searched', () => {
      //Act
      eventPage.searchForKeywordFilterOption(event.article.keyword);

      //Assert
      eventPage.checkFilterOptionsWereUpdated(event.article.keyword);
    });

    it('Check that "Show 10 more" works correctly', () => {
      //Act
      eventPage.showMoreOptions();

      //Assert
      eventPage.checkOptionListExpanded();
    });

    it('Check that filters are not lost when page is refreshed', () => {
      //Arrange
      eventPage.applyFilter().then((numberOfSubmissions) => {
        //Act
        eventPage.reloadPage();
        eventPage.openFilterPanel();

        //Assert
        eventPage.checkFilterIsApplied(numberOfSubmissions);
      });
    });

    it('Check that filter panel can be closed', () => {
      //Act
      eventPage.closeFilterPanel();

      //Assert
      eventPage.checkFilterPanelIsClosed();
    });
  });

  describe('Pagination', () => {
    it('Check that "Next" page button works correctly', () => {
      //Act
      eventPage.goToNextPage();

      //Assert
      eventPage.checkPageChanged(event.article.title, 2);
    });

    it('Check that a different page can be accessed', () => {
      const pageNumber = 3;

      //Act
      eventPage.accessPage(pageNumber);

      //Assert
      eventPage.checkPageChanged(event.article.title, pageNumber);
    });
  });
});
