/**
 * Renderiza el Banner Hero de la Home dinámicamente desde courses.json
 * Versión Clickable Total: Todo el banner es un enlace, diseño ultra-limpio.
 */
async function renderHomeBanner() {
    const slider = document.getElementById('banner-slider');
    const dotsContainer = document.getElementById('banner-dots');
    
    if (!slider || !dotsContainer) return;

    try {
        const response = await fetch('data/courses.json');
        const courses = await response.json();
        
        const featuredCourses = courses.filter(c => c.featured === true);

        if (featuredCourses.length === 0) {
            slider.innerHTML = '<div class="min-w-full h-[320px] flex items-center justify-center text-white/20 uppercase font-black text-xs tracking-widest">No hay cursos destacados</div>';
            return;
        }

        slider.innerHTML = featuredCourses.map((c, i) => `
            <a href="${c.link || '#'}" class="min-w-full h-[400px] md:h-[320px] relative snap-start overflow-hidden group/banner block">
                <!-- Imagen con efecto de Zoom al Hover -->
                <img src="${c.banner.image}" alt="${c.title}" class="w-full h-full object-cover brightness-[0.75] transition-transform duration-700 group-hover/banner:scale-105">
                
                <!-- Degradados laterales sutiles (25% ancho) -->
                <div class="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none"></div>

                
                <!-- Info Esquina Superior Derecha -->
                <div class="absolute top-6 right-8 md:right-12 z-20">
                    <div class="px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col items-end shadow-2xl transition-all group-hover/banner:border-factor-cyan/50">
                        <div class="text-[9px] text-factor-cyan font-bold uppercase tracking-[0.2em] leading-none mb-1.5 opacity-90">Próxima Edición</div>
                        <div class="text-white font-black text-xs md:text-[15px] uppercase leading-none tracking-tight drop-shadow-sm">${c.nextDate || 'Próximamente'}</div>
                    </div>
                </div>

                <!-- Info Esquina Inferior Derecha -->
                <div class="absolute bottom-14 md:bottom-16 right-8 md:right-12 z-20">
                    <div class="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-factor-cyan/10 border border-factor-cyan/20 text-factor-cyan shadow-xl transition-all group-hover/banner:bg-factor-cyan/20">
                        <span class="font-black text-[10px] md:text-[11px] uppercase tracking-widest leading-none drop-shadow-sm">${c.spotsStatus || 'PLAZAS LIMITADAS'}</span>
                    </div>
                </div>

                <!-- Contenido Principal -->
                <div class="absolute inset-0 flex flex-col justify-start pt-16 md:pt-6 px-6 md:px-16 max-w-3xl z-10">
                    <h2 class="text-2xl md:text-5xl font-extrabold text-white mb-3 uppercase leading-[0.9] tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] max-w-[70%] md:max-w-none transition-transform duration-500 group-hover/banner:translate-x-2">
                        ${c.title}
                    </h2>
                    
                    <p class="text-white text-[13px] md:text-[15px] leading-relaxed mb-8 max-w-xs md:max-w-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover/banner:translate-x-2">
                        ${c.banner.subtitle}
                    </p>
                    
                    <!-- Indicador visual de Click (Opcional, muy sutil) -->
                    <div class="absolute bottom-16 left-6 md:left-16 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300">
                        <span class="text-factor-cyan text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            VER PROGRAMA <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </a>
        `).join('');

        dotsContainer.innerHTML = featuredCourses.map((_, i) => `
            <div class="slider-dot w-2 h-2 rounded-full transition-all duration-300 bg-white/20"></div>
        `).join('');

        const dots = dotsContainer.querySelectorAll('.slider-dot');
        const updateDots = () => {
            const scrollLeft = slider.scrollLeft;
            const width = slider.offsetWidth;
            const index = Math.round(scrollLeft / width);
            
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('bg-factor-cyan', 'shadow-[0_0_10px_rgba(0,240,255,0.5)]');
                    dot.classList.remove('bg-white/20');
                    dot.style.width = '24px';
                } else {
                    dot.classList.remove('bg-factor-cyan', 'shadow-[0_0_10px_rgba(0,240,255,0.5)]');
                    dot.classList.add('bg-white/20');
                    dot.style.width = '8px';
                }
            });
        };

        slider.addEventListener('scroll', updateDots);
        updateDots();

    } catch (error) {
        console.error('Error cargando el banner:', error);
    }
}

document.addEventListener('DOMContentLoaded', renderHomeBanner);
