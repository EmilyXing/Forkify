export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const eleStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${eleStrings.loader}">
            <svg>
                <use href="/img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${eleStrings.loader}`);
    if(loader) {
        loader.parentNode.removeChild(loader);
    }
};