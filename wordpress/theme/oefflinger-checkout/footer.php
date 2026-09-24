<?php
$is_checkout = function_exists('is_checkout') && is_checkout() && (!function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('order-received'));
?>
</main>
<?php if (!$is_checkout):
$frontend = function_exists('oefflinger_frontend_url') ? oefflinger_frontend_url() : 'http://localhost:4000';
?>
<footer class="oeff-footer" style="border-top: 1px solid #e5e7eb; background: #0f3d4a; padding: 3rem 1rem;">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <div style="text-align: center;">
            <p style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">
                &copy; <?php echo date('Y'); ?> Öfflinger
            </p>
        </div>
        <nav style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem;">
            <a href="<?php echo esc_url($frontend . '/impressum'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">Impressum</a>
            <a href="<?php echo esc_url($frontend . '/datenschutz'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">Datenschutz</a>
            <a href="<?php echo esc_url($frontend . '/agb'); ?>" style="font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.8); text-decoration: none;">AGB</a>
        </nav>
    </div>
</footer>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>
