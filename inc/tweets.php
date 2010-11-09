<?php

require('twitter/EpiCurl.php');
require('twitter/EpiOAuth.php');
require('twitter/EpiTwitter.php');

$twitterObj = new EpiTwitter();
$tweets = $twitterObj->get_basic('/statuses/user_timeline.json?screen_name='.TWITTER_ACCOUNT);

?>

<?php if ( $tweets && count($tweets->response) ): ?>
    
    <div class="tweets panel">
            
    <h3>Latest <a href="http://twitter.com/<?php echo TWITTER_ACCOUNT; ?>">@<?php echo TWITTER_ACCOUNT; ?></a> tweets...</h3>

        <ul>
        <?php for($i = 0; $i < 3; $i++):
        
            $tweet  = $tweets->response[$i];
            $time   = strtotime($tweet['created_at']);
            
        ?>
            <li>
                <p class="tweet">"<?php echo ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]","<a href=\"\\0\">\\0</a>", $tweet['text'] ); ?>"</p>
                <p class="meta">Tweeted on <?php echo date('D jS Y', $time); ?> at <?php echo date('H:ia', $time); ?></p>
            </li>
        <?php endfor; ?>
        </ul>
    
    </div>
    
<?php endif; ?>