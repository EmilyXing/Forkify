import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView'


/** Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 */
const state = {};

/** Search Controller */
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
        try {
            // search for recipes
            await state.search.getResults();

            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert(err);
            clearLoader();
        }
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

/**Recipe Controller */

const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');

    if(id) {
        // prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if(state.search) {
            searchView.highlightSelected(id);
        }
        
        // create new recipe object
        state.recipe = new Recipe(id);

        try{
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // caluculte servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch(error) {
            alert(error);
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**List Controller */
const controlList = () => {
    // create a new list if there is none yet
    if(!state.list) {
        state.list = new List();
    }

    // prepare UI
    listView.clearList();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

/**Like Controller */


const controlLike = () => {
    if(!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    // user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to UI
        likesView.renderLike(newLike);

    // user has not yet liked current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);
        // remove like from UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



// handling delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increae button is clicked
        state.recipe.updateServings('inc');
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    recipeView.updateServingsIngredients(state.recipe);
});

