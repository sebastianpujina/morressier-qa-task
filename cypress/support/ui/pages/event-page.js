import { shared } from '../../../fixtures/constants/index';

export class EventPage {
  bannerImage = '[class*="Banner"]';
  avatarImage = '[class*="AvatarWrapper"]';
  productLabelText = '[class*="ProductLabel"]';
  eventTitleText = '[class*="EventTitle"]';
  dateAndLocationText = '[class*="SecondHeaderRowItem"]';
  articlePreviewImage = '[data-card-name="StyledCardMedia"]';
  articleTitleText = '[class*="PosterCard__Title"]';
  articleFooter = '[data-card-name="CardFooter"]';
  articleStatsText = '[class*="StyledStatsNumber"]';
  searchInput = '[class*="StyledSearchBar"] input';
  searchButton = '[class*="StyledSearchBar"] svg';
  clearSearchLink = 'p:contains("Clear search")';
  paginationFooter = '[class*="PaginationControlsWrapper"]';
  addFiltersButton = '[class*="FilterToggleButton"]';
  filterOption = '[class*="MuiListItem"]>div';
  filterOptionCheckbox = '[class*="MuiCheckbox-root"] [type="checkbox"]';
  numberOfAppliedFiltersText = '[class*="MuiExpansionPanelSummary-content"] h4';
  closeFilterPanelButton = 'button:contains("Close")';
  clearAllFiltersButton = 'p:contains("Clear all filters")';
  searchForKeywordsInput = '[placeholder="Search for keywords"]';
  removeFilterButton = '.MuiChip-deleteIcon';
  appliedFilterText = '.MuiChip-label';
  keywordsCategory = '.MuiExpansionPanel-root:contains("Keywords")';
  showMoreOptionsLink = 'span:contains("Show 10 more")';
  nextPageButton = 'button:contains("Next")';
  pageNumberLink = '[class*="PageNumbers"]';
  previousPageButton = 'button:contains("Previous")';

  visitEventPage = () => {
    return cy.visit('/');
  };

  accessHostPage = (host) => {
    return cy.contains(host).click();
  };

  accessArticle = (title) => {
    return cy.contains(title).click();
  };

  search = (searchTerm) => {
    cy.get(this.searchInput).type(searchTerm, { delay: 0 });
    return cy.get(this.searchButton).click();
  };

  getTitleForFirstArticle = () => {
    return cy
      .get(this.articleTitleText)
      .eq(0)
      .invoke('text')
      .then((text) => {
        return text;
      });
  };

  clearSearch = () => {
    cy.intercept(`**${shared.apiPaths.event.search}**`).as('clearSearch');
    cy.get(this.clearSearchLink).click();
    return cy.wait('@clearSearch').then((xhr) => {
      return xhr.response.body.collection.total;
    });
  };

  openFilterPanel = () => {
    return cy.get(this.addFiltersButton).click();
  };

  applyFilter = () => {
    cy.intercept(`**${shared.apiPaths.event.search}**`).as('filterSearch');
    cy.get(this.filterOption).eq(0).click();
    return cy.wait('@filterSearch').then((xhr) => {
      return xhr.response.body.collection.total;
    });
  };

  clearAllFilters = () => {
    cy.intercept(`**${shared.apiPaths.event.search}**`).as('filterSearch');
    cy.get(this.clearAllFiltersButton).click();
    return cy.wait('@filterSearch').then((xhr) => {
      return xhr.response.body.collection.total;
    });
  };

  removeFilter = () => {
    cy.intercept(`**${shared.apiPaths.event.search}**`).as('filterSearch');
    cy.get(this.removeFilterButton).click();
    return cy.wait('@filterSearch').then((xhr) => {
      return xhr.response.body.collection.total;
    });
  };

  searchForKeywordFilterOption = (keyword) => {
    return cy.get(this.searchForKeywordsInput).type(keyword);
  };

  showMoreFilterOptions = () => {
    return cy.get(this.keywordsCategory).within(() => {
      return cy.get(this.showMoreOptionsLink).click();
    });
  };

  reloadPage = () => {
    return cy.reload();
  };

  goToNextPage = () => {
    return cy.get(this.nextPageButton).click();
  };

  accessPage = (pageNumber) => {
    return cy.get(this.pageNumberLink).contains(pageNumber).click();
  };

  closeFilterPanel = () => {
    return cy.get(this.closeFilterPanelButton).click();
  };

  checkEventInformationIsCorrect = (data) => {
    const { productLabel, eventTitle, date, location, subTitle } = data;

    cy.get(this.bannerImage).should('be.visible');
    cy.get(this.avatarImage).should('be.visible');
    cy.get(this.productLabelText).should('contain', productLabel);
    cy.get(this.eventTitleText).should('contain', eventTitle);
    cy.get(this.dateAndLocationText).should('contain', `${date} · ${location}`);
    cy.contains(subTitle).should('be.visible');
  };

  checkExternalUrlIsCorrect = (url) => {
    const { label, value } = url;

    cy.findByRole('link', { name: label }).should('have.attr', 'href', value).and('have.attr', 'target', '_blank');
  };

  checkHostPageIsCorrect = (organizer) => {
    cy.url().should('contain', shared.paths.organizations);
    cy.contains(organizer).should('be.visible');
  };

  checkArticleContainsCorrectData = (data) => {
    const { title, author, keyword, additionalNumberOfKeywords } = data;

    cy.get(this.articlePreviewImage).should('be.visible');
    cy.get(this.articleTitleText).should('contain', title);
    cy.contains(author).should('be.visible');
    cy.contains(keyword).should('be.visible');
    cy.contains(additionalNumberOfKeywords).should('be.visible');
    cy.get(this.articleStatsText).should('be.be.visible');
  };

  checkArticlePageIsCorrect = (title) => {
    cy.url().should('contain', shared.paths.article);
    cy.contains(title).should('be.visible');
  };

  checkSearchResultsAreCorrect = (numberOfResults, title) => {
    const numberOfArticles = numberOfResults < 24 ? numberOfResults : 24;

    cy.contains(`${numberOfResults.toLocaleString()} submissions`).should('be.visible');
    cy.contains(title).should('be.visible');
    cy.get(this.articleTitleText).should('have.length', numberOfArticles);
  };

  checkNoResultsAreReturned = () => {
    cy.contains('0 submissions').should('be.visible');
    cy.get(this.articleTitleText).should('not.exist');
    cy.get(this.paginationFooter).should('not.exist');
  };

  checkFilterIsApplied = (numberOfResults) => {
    cy.get(this.filterOptionCheckbox).eq(0).should('be.checked');
    cy.get(this.numberOfAppliedFiltersText).should('contain', 1);
    cy.get(this.appliedFilterText).should('be.visible');
    cy.get(this.addFiltersButton).should('contain', 1);
    cy.contains(`${numberOfResults.toLocaleString()} submissions`).should('be.visible');
  };

  checkFilterIsNotApplied = (numberOfResults) => {
    cy.get(this.filterOptionCheckbox).eq(0).should('not.be.checked');
    cy.get(this.numberOfAppliedFiltersText).should('not.contain', 1);
    cy.get(this.appliedFilterText).should('not.exist');
    cy.get(this.addFiltersButton).should('not.contain', 1);
    cy.contains(`${numberOfResults.toLocaleString()} submissions`).should('be.visible');
  };

  checkFilterOptionsAreUpdated = (option) => {
    cy.get(this.keywordsCategory).within(() => {
      cy.get(this.filterOption).should('have.length', 1).and('contain', option.toLowerCase());
    });
  };

  checkOptionListExpanded = () => {
    cy.get(this.keywordsCategory).within(() => {
      cy.get(this.filterOption).should('have.length', 20);
    });
  };

  checkPageChanged = (initialFirstArticleTitle, pageNumber) => {
    cy.get(this.pageNumberLink).contains(pageNumber).should('have.attr', 'color', 'secondaryBrand');
    cy.get(this.previousPageButton).should('be.visible');
    cy.get(this.articleTitleText).should('not.contain', initialFirstArticleTitle);
  };

  checkFilterPanelIsClosed = () => {
    cy.get(this.keywordsCategory).should('not.exist');
  };
}
