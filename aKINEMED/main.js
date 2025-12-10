 // --- Header Logic ---
    const header = document.querySelector('header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const xIcon = document.getElementById('x-icon');
    const headerContainer = header.querySelector('.container > div');

    if (header) {
        // Scrolled effect
        const handleScroll = () => {
            if (window.scrollY > 10) {
                header.classList.add('bg-white/80', 'backdrop-blur-sm', 'shadow-md');
                headerContainer.classList.remove('py-5');
                headerContainer.classList.add('py-3');
            } else {
                header.classList.remove('bg-white/80', 'backdrop-blur-sm', 'shadow-md');
                headerContainer.classList.add('py-5');
                headerContainer.classList.remove('py-3');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    if (mobileMenuButton) {
        // Mobile menu toggle
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('max-h-96');
            if (isOpen) {
                mobileMenu.classList.remove('max-h-96', 'opacity-100');
                mobileMenu.classList.add('max-h-0', 'opacity-0');
                menuIcon.classList.remove('hidden');
                xIcon.classList.add('hidden');
            } else {
                mobileMenu.classList.add('max-h-96', 'opacity-100');
                mobileMenu.classList.remove('max-h-0', 'opacity-0');
                menuIcon.classList.add('hidden');
                xIcon.classList.remove('hidden');
            }
        });
    }

    // --- Header Active Link ---
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        let isActive = false;
        
        if (linkPath === '/' || linkPath.endsWith('/index.html')) {
            if (currentPath === '/' || currentPath.endsWith('/index.html')) {
                isActive = true;
            }
        } else if (currentPath.endsWith(linkPath)) {
            isActive = true;
        }

        if (isActive) {
            link.classList.add('text-cyan-500', 'font-semibold');
        }
    });

    // --- Animated Section Logic ---
    const animatedSections = document.querySelectorAll('.animated-section');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedSections.forEach(section => observer.observe(section));
    } else {
        // Fallback for older browsers
        animatedSections.forEach(section => section.classList.add('is-in-view'));
    }

    // --- Hero Parallax ---
    const hero = document.getElementById('hero');
    if (hero) {
        const heroBg = hero.querySelector('.bg-cover');
        window.addEventListener('scroll', () => {
            const offsetY = window.pageYOffset;
            heroBg.style.transform = `translateY(${offsetY * 0.5}px)`;
        });
    }

    // --- Workshop Carousel Logic ---
    const carousel = document.getElementById('workshop-carousel');
    if (carousel) {
        const scrollContainer = carousel.querySelector('.overflow-x-auto');
        const leftBtn = carousel.querySelector('[aria-label="Anterior"]');
        const rightBtn = carousel.querySelector('[aria-label="Siguiente"]');

        const scroll = (direction) => {
            const scrollAmount = scrollContainer.offsetWidth * 0.8;
            scrollContainer.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        };
        leftBtn.addEventListener('click', () => scroll('left'));
        rightBtn.addEventListener('click', () => scroll('right'));
    }

    // --- Booking Page Logic ---
    const datepickerContainer = document.getElementById('datepicker-container');
    if (datepickerContainer && window.Datepicker) {
        const datepickerInput = document.getElementById('datepicker-input');
        const timeSlotsWrapper = document.getElementById('time-slots-wrapper');
        const timeSlotsContainer = document.getElementById('time-slots');
        const confirmButton = document.getElementById('confirm-booking-btn');
        const selectedDateText = document.getElementById('selected-date-text');

        let selectedTime = null;
        let selectedDate = null;

        const datepicker = new Datepicker(datepickerInput, {
            buttonClass: 'btn',
            language: 'es',
            autohide: true,
            container: datepickerContainer,
            minDate: new Date(),
        });

        const updateButtonState = () => {
            confirmButton.disabled = !(selectedDate && selectedTime);
        };

        datepickerInput.addEventListener('changeDate', (e) => {
            selectedDate = e.detail.date;
            const formattedDate = new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            selectedDateText.textContent = `Fecha seleccionada: ${formattedDate}.`;
            selectedDateText.classList.remove('text-slate-500');
            selectedDateText.classList.add('text-slate-600');
            timeSlotsWrapper.classList.remove('hidden');
            updateButtonState();
        });

        timeSlotsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                timeSlotsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-cyan-500', 'border-cyan-500', 'text-white');
                    btn.classList.add('bg-white', 'border-slate-200', 'hover:border-cyan-400');
                });
                e.target.classList.add('bg-cyan-500', 'border-cyan-500', 'text-white');
                e.target.classList.remove('bg-white', 'border-slate-200', 'hover:border-cyan-400');
                selectedTime = e.target.textContent.trim();
                updateButtonState();
            }
        });
        
        // Handle form submission
        const bookingForm = document.querySelector('#confirm-booking-btn').closest('form');
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedDate && selectedTime) {
                alert(`¡Reserva confirmada!\nFecha: ${selectedDate.toLocaleDateString('es-ES')}\nHora: ${selectedTime}\nNombre: ${document.getElementById('name').value}\nCorreo: ${document.getElementById('email').value}`);
                // Here you would typically send the data to a server
                bookingForm.reset();
                selectedDate = null;
                selectedTime = null;
                timeSlotsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-cyan-500', 'border-cyan-500', 'text-white');
                     btn.classList.add('bg-white', 'border-slate-200', 'hover:border-cyan-400');
                });
                timeSlotsWrapper.classList.add('hidden');
                selectedDateText.textContent = 'Por favor, elige un día.';
                updateButtonState();
                datepicker.setDate({clear: true});
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }
;