/* -------------------------------------------------------------------------
  EXPAND JS / JQUERY
-------------------------------------------------------------------------- */


    jQuery(document).ready(function() {
      //toggle the componenet with class expand-links
      jQuery(".expand-menu").click(function() {
        jQuery(".expand-menu-btns").slideToggle(300);
      });
      jQuery(".expand-more-menu").click(function() {
        jQuery(".expand-more-menu-btns").slideToggle(300);
      }); 
      jQuery(".expand-search").click(function()
      {
        jQuery(".expand-search-box").slideToggle(300);
      });
      jQuery(".expand-stores-btn").click(function()
      {
        jQuery(".expand-stores").slideToggle(500);
      });
    });

