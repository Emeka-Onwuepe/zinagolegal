document.addEventListener('DOMContentLoaded', function () {
            var btn = document.getElementById('back-to-top');
            function toggleBtn() {
                if (window.scrollY > 300) btn.classList.add('show'); else btn.classList.remove('show');
            }
            window.addEventListener('scroll', toggleBtn, { passive: true });
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            // initial check
            toggleBtn();

const cards = document.querySelectorAll('.practice-card');

        function closeAllCards(except = null) {
            cards.forEach(card => {
                if (card !== except) {
                    card.classList.remove('active');
                }
            });
        }

        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                // if the clicked element is a link (inside description), let it work without toggling the card
                const link = e.target.closest('.practice-link');
                if (link) {
                    e.stopPropagation();  // avoid card toggle, href works normally
                    return;
                }

                const isActive = card.classList.contains('active');

                if (isActive) {
                    // if active, close it
                    card.classList.remove('active');
                } else {
                    // close all others, then open this one
                    closeAllCards(card);
                    card.classList.add('active');
                }
            });

            // keyboard support (Enter / Space)
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isActive = card.classList.contains('active');
                    if (isActive) {
                        card.classList.remove('active');
                    } else {
                        closeAllCards(card);
                        card.classList.add('active');
                    }
                }
            });
        });

        // start with all closed (no card expanded)
        closeAllCards();

        });