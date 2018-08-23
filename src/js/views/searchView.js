import { elements } from './base';
import { create } from 'domain';

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
};

export const getInput = () => elements.searchInput.value;

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length < limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;  
    }
    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    
`;

const renderButton = (page, numRes, resPerPage) => {
    
    const pages = Math.ceil(numRes / resPerPage);
    let button;
    if(pages > 1) {
        if(page === 1) {
            // only button to go to the next page
            button = createButton(page, 'next');
        } else if(page === pages) {
            // only botton to go to the prev page
            button = createButton(page, 'prev');
        } else {
            // both next and prev
            button = `
                ${createButton(page, 'prev')}
                ${createButton(page, 'next')}
            `;
        }
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * 10;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButton(page, recipes.length, resPerPage);
};
