<?php foreach(gallery_pics( 120, 120 ) as $pic ): ?>

<li>
    <a href="<?php echo $pic['original'] ?>" rel="fullsize"><img src="<?php echo $pic['thumb'] ?>"></a>
</li>

<?php endforeach; ?>