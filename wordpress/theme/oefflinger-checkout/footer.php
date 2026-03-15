<?php
$frontend = function_exists('oefflinger_frontend_url') ? oefflinger_frontend_url() : 'http://91.98.112.186:4000';
?>
</main>
<footer class="oeff-footer" style="border-top: 1px solid #e5e7eb; background: #0f3d4a; padding: 3rem 1rem;">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <div style="text-align: center;">
            <p style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">
                &copy; <?php echo date('Y'); ?> Öfflinger
            </p>
            <p style="font-size: 0.875rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0 0;">
                Musterstraße 1, 12345 Oberöfflingen, Deutschland
            </p>
        </div>
        <nav style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem;">
            <a href="<?php echo esc_url($frontend . '/impressum'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">Impressum</a>
            <a href="<?php echo esc_url($frontend . '/datenschutz'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">Datenschutz</a>
            <a href="<?php echo esc_url($frontend . '/agb'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">AGB</a>
        </nav>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
