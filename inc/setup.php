<?php
/*****************************************
 *
 * Setup file for the microsite.
 *
 * Contains constants used throughout the site as
 * well as a few handy functions. 
 *
 *****************************************/
 
 
/*
 * General site settings
 *
 */ 

define('SITE_NAME', 'Film Site Name'); // displayed in the title bar

define('SITE_URL', 'http://filmsite.com'); // used to configure things such as the facebook 'like' button

/*
 * Twitter settings
 *
 */

define('TWITTER_ACCOUNT', 'dogwoof'); // used to pull in tweets

define('TWITTER_SEARCHTERM', 'search terms'); // used to pull in tweets

/*
 * Facebook settings
 *
 */

define('FACEBOOK_URL', 'http://www.facebook.com/pages/MY-FILM-SITE');

/*
 * Youtube settings
 *
 */

define('YOUTUBE_URL', 'http://www.youtube.com/dogwoof');
define('YOUTUBE_TRAILER_ID', false );

/*
 * Functions...
 *
 */
 
define('DOCROOT', $_SERVER['DOCUMENT_ROOT']);

function nav_items( $items, $classes = FALSE )
{
    $output = '';
    if ( count($items) )
    {
        foreach( $items as $label=>$url )
        {
            $segs = url_segs($url); 
            $num = count($segs)-1;
            $current = ( segment( $num ) == $segs[$num] ) ? TRUE : FALSE;
            $output .= '<li';
            if ( $classes || $current )
            {
                $output .= ' class="';
                if ( $classes ) $output .= strtolower(str_replace(' ','_',$label)).' ';
                if ( $current ) $output .= 'current';
                $output .= '"';
            }
            $output .= '><a href="'.$url.'">'.$label.'</a></li>'."\n";
        }
    }
    return $output;
}

function gallery_pics( $thumb_size_x = 100, $thumb_size_y = 100, $gallery_path = 'img/gallery/', $cache_path = 'cache/' )
{
    require_once DOCROOT.'/inc/vendor/gdthumb/ThumbLib.inc.php';

    // prob don't need to touch this

    $images = array();

    $images_path = DOCROOT.'/'.$gallery_path;

    if ( is_dir( $images_path ) )
    {
        foreach ( glob($images_path.'*') as $img )
        {
            $thumbpath = DOCROOT.'/'.$cache_path.'thumb_'.$thumb_size_x.'_'.$thumb_size_y.'_'.basename($img);
            if ( ! file_exists( $thumbpath ) )
            {
                try
                {
                     $thumb = PhpThumbFactory::create($img);
                     $thumb->adaptiveResize($thumb_size_x, $thumb_size_y);
                     $thumb->save($thumbpath);
                }
                catch (Exception $e){}                
            }
            $images[] = array('original'=>str_replace(DOCROOT, '', $img ),
                                'thumb'=>str_replace(DOCROOT, '', $thumbpath ));
        }
    }
    return $images;
}

function url_segs( $url = NULL )
{
    if ( ! $url ) $url = str_replace( '?'.$_SERVER['QUERY_STRING'], '', $_SERVER['REQUEST_URI'] );
    $url = trim( $url, '/');
    return explode( '/', $url );
}

function segment( $num = 0, $url = NULL )
{
    $segs = url_segs($url);
    return isset( $segs[$num] ) ? $segs[$num] : NULL;
}

?>