import menuApi from "../utils/mockdata2";

export const CON_URL =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_264,h_288,c_fill/";

export const LOGO_URL =
  "https://png.pngtree.com/png-vector/20240806/ourlarge/pngtree-free-food-delivery-logo-template-png-image_13394103.png";

export const API =
  "https://www.swiggy.com/dapi/restaurants/search/v3?lat=13.08950&lng=80.27390&str=restaurants&trackingId=bb375fbb-af1b-b5cb-ed0a-3a34d6474e21&submitAction=ENTER&queryUniqueId=d8ac4355-167a-2fdc-245d-3a731b3a6172";

export const EATSURE_API =
  " https://www.eatsure.com/v1/api/get_restaurants_with_details?cityId=5455 ";

export const MENU_API =
  "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=13.060068&lng=80.2805925&restaurantId=655003&catalog_qa=undefined&submitAction=ENTER";

export const MENU_API_ACCESS =
  menuApi.data.cards[4].groupedCard.cardGroupMap.REGULAR.cards[2].card.card
    .itemCards;
