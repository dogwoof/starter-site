    </div>
    
    <div id="social" class="receptacle section social">
        
        <?php if ( TWITTER_ACCOUNT || TWITTER_SEARCHTERM ): ?>
            
        <div class="twitter">
                    
            <?php if ( TWITTER_ACCOUNT ): ?>

            <div id="twitter_account" class="feed">

                <h3>Twitter timeline for <span class="term">@<?php echo TWITTER_ACCOUNT; ?></span></h3>
                
                <div class="output" data-source="twitter_username"><p>Sorry, you need JavaScript enabled to view the tweet timeline.</p></div>

            </div>

            <?php endif; ?>

            <?php if ( TWITTER_SEARCHTERM ): ?>

            <div id="twitter_mentions" class="feed">

                <h3>Searching Twitter for '<span class="term"><?php echo TWITTER_SEARCHTERM; ?></span>'</h3>

                <div class="output" data-source="twitter_searchterm"><p>Sorry, you need JavaScript enabled to view the tweet timeline.</p></div>

            </div>

             <?php endif; ?>
            
        </div>
            
        <?php endif; ?>
        
        <div id="elsewhere" class="external">
            
            <?php include($_SERVER['DOCUMENT_ROOT'].'/inc/signup.php'); ?>
            
            <ul class="nav">
                <?php if ( FACEBOOK_URL ): ?><li class="facebook"><a href="<?php echo FACEBOOK_URL; ?>">Facebook</a></li><?php endif; ?>
                <?php if ( TWITTER_ACCOUNT ): ?><li class="twitter"><a href="http://twitter.com/<?php echo TWITTER_ACCOUNT; ?>">Twitter</a></li><?php endif; ?>
                <?php if ( YOUTUBE_URL ): ?><li class="youtube"><a href="<?php echo YOUTUBE_URL; ?>">YouTube</a></li><?php endif; ?>
            </ul>
            
        </div>
        
    </div>
    
    <div class="receptacle footer" role="banner">
        
        <div class="section">
            
            <p>Distributed in The UK by <a href="http://dogwoof.com/">Dogwoof</a>. All rights reserved.</p>
            
        </div>
            
    </div>
    
    <!--[if IE]><script>if ( Cufon ) Cufon.now();</script><![endif]-->
	
</body>	
</html>