import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 */
const state = {};

const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();

    if(query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // search for recipes
        await state.search.getResults();

        // render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
    
};

elements.searchForm.addEventListener('submit', e => {
    //the default action of the event will not be triggered.
    e.preventDefault();
    controlSearch();
});

elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});