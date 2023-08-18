import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

// storefront api url
const apiRoute = "/api/storefront/carts/";

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    // function to get the CDN for the second item image and set it with srcset
    showSecondImage(e) {
        const productImg = $(e.currentTarget);
        const imgSrc = productImg.attr("data-hoverimage");
        productImg.attr("srcset", imgSrc);
    }
    // function to get the CDN for the first item image and set it with srcset
    showFirstImage(e) {
        const productImg = $(e.currentTarget);
        const imgSrc = productImg.attr("data-src");
        productImg.attr("srcset", imgSrc);

    }
    // api call to check if cart exists and return cart id
    checkCart(url) {

        return fetch(url, {
            method: "GET",
            credentials: "same-origin"
        })
            .then(res => res.json())
    }
    // api call to create a cart and adds an item. also shows the "item added" notification  and hides the "item deleted" notification
    createCart(url, cartItems) {

        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(cartItems)
        })
            .then(res => res.json()).then((data) => {
                if (data) {
                    $(".add-notification").show();
                    $(".delete-notification").hide();
                    $("#rmvBtn").show();
                }
            })
            .catch(err => console.error(err))

    }

    addCartItem(url, cartId, cartItems) {

        const fullUrl = `${url}${cartId}/items`;
        return fetch(fullUrl, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartItems),
        })
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error(error));
    };
    // delete cart api call, also shows the item deleted notification and hides the item added notification
    deleteCart(url, cart) {

        let route = `${url}${cart}`;
        console.log(route);
        return fetch(route, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => console.log(res))
            .then(() => {
                $(".delete-notification").show();
                $(".add-notification").hide();
            })
            .catch(err => console.error(err));
    };
    // cart delete handler function that checks to see if a cart exists and deletes it if it does.  Hides the "remove all" button after deletion
    onDeleteCart() {
        this.checkCart(apiRoute)
            .then(data => this.deleteCart(apiRoute, data[0].id))
            .then(() => {
                $("#rmvBtn").hide();
            })
            .catch(err => console.error(err))
    }



    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();

        // button handler for adding items to cart
        $("#addBtn").on('click', () => this.createCart(apiRoute, { "lineItems": [{ "quantity": 1, "productId": 112 }] }));

        // button handler for deleting items from cart
        $('#rmvBtn').on('click', () => this.onDeleteCart());

        // checks if cart is empty or has items and shows the buttons accordingly
        this.checkCart(apiRoute).then((data) => {
            if (data.length > 0) {
                $("#rmvBtn").show();
            } else {
                $("#rmvBtn").hide();
            }
        })

        $(".product-img").on('mouseenter', this.showSecondImage.bind(this)).on('mouseleave', this.showFirstImage.bind(this));
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
