/*=============================================================
Type:               Main JS file
Document Author:    Dogwoof devs
Author Email:       
---------------------------------------------------------------
Creation Date:      
============================================================ */

(function( win, doc, _s, $ ){
    
    _s = $.extend({
        
        twitter_username    : false,
        twitter_searchterm  : false,
       
        livetwitter : {
            limit : 10,
            refresh : false
        }

    }, _s);
    
    function initTwitter()
    {
        if ( _s.twitter_username )
        {
            var un_output = $('div[data-source=twitter_username]');
            un_output.empty().liveTwitter(_s.twitter_username, $.extend({}, _s.livetwitter, {mode: 'user_timeline', showAuthor: true}));
        }
        
        if ( _s.twitter_searchterm )
        {
            var st_output = $('div[data-source=twitter_searchterm]');
            st_output.empty().liveTwitter(_s.twitter_searchterm,  _s.livetwitter);
        }    
    }
    
    $(function(){
    
        initTwitter();
        
        // $('form input[type=text]').inlineLabel();
        
        $('a[rel*=fullsize]').lightBox();
        
    });
    
})( window, document, _settings, jQuery );