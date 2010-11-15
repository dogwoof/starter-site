<?php include('inc/setup.php'); ?><!DOCTYPE html>
<!--[if IE]><![endif]-->
<!--[if lt IE 7 ]><html lang="en" class="ie ie6"><![endif]-->
<!--[if IE 7 ]><html lang="en" class="ie ie7"><![endif]-->
<!--[if IE 8 ]><html lang="en" class="ie ie8"><![endif]-->
<!--[if IE 9 ]><html lang="en" class="ie ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html lang="en"><!--<![endif]-->
<head>
	<meta charset="utf-8">

  	<meta name="description" content="">
  	  	
    <!-- <meta name="viewport" content="width=;"> -->
    
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/lightbox.css">
	<link rel="stylesheet" href="/css/site.css">
	
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    
    <script>
        var html = document.getElementsByTagName('html')[0];
        html.className = html.className+' hasJS';
        var _settings = {};
        <?php if ( TWITTER_ACCOUNT ) echo '_settings.twitter_username = "'.TWITTER_ACCOUNT.'";'."\n"; ?>
        <?php if ( TWITTER_SEARCHTERM ) echo '_settings.twitter_searchterm = "'.TWITTER_SEARCHTERM.'";'."\n"; ?>
    </script>
  	
  	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
	<script>!window.jQuery && document.write('<script src="/js/jquery-1.4.3.min.js"><\/script>')</script>
	<!--[if IE 6]><script src="/js/dd_belatedpng.js"></script><![endif]-->
	<script src="/js/plugins.js"></script>
	<script src="/js/main.js"></script>
	
	<title><?php if (isset($title)) echo $title.' | '; echo SITE_NAME; ?></title>
</head>
<body class="section_<?php echo segment(0) ? str_replace( '.php', '', segment(0)) : 'home'; ?>">
        
    <div class="receptacle header" role="banner">
        
        <div class="section nav">

            <ol class="primary" role="navigation">
                <?php
                    echo nav_items(array( 
                            'Home'           => '/',
                            'About the Film' => '/about.php',
                            'Screenings'     => '/screenings.php',
                            'The Filmmakers' => '/filmmakers.php',
                            'Gallery'        => '/gallery.php',
                            'Press'          => '/press.php',
                            'Contact'        => '/contact.php'
                    ));
                ?>
            </ol>
        
        </div>
        
        <div class="section head">

            <a href="/" class="branding"><h1><?php echo SITE_NAME; ?></h1></a>
            
        </div>
                        
    </div>
    
    <div class="receptacle main" role="main">
        