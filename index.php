<?php include('inc/header.php'); ?>

    <div class="section">
    
        <div id="trailer">
            
            <?php if ( YOUTUBE_TRAILER_ID ): ?><iframe title="YouTube video player" class="youtube-player" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/<?php echo YOUTUBE_TRAILER_ID; ?>?rel=0" frameborder="0"></iframe><?php endif; ?>
            
        </div>
    
    </div>

<?php include('inc/footer.php'); ?>