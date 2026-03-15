SELECT CONCAT('UPDATE wp_posts SET post_content=', QUOTE(post_content), ', post_excerpt=', QUOTE(post_excerpt), ' WHERE ID=', ID, ';')
FROM wp_posts WHERE post_type='product';
