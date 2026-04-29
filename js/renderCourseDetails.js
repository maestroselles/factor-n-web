/**
 * Renderiza los detalles completos de un curso desde data/courses.json
 * Cruzando datos con data/team.json para que los profesores sean dinámicos.
 */
async function loadCourseDetails() {
    console.log('--- DIAGNÓSTICO DE CARGA ---');
    console.log('URL actual:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    let courseId = urlParams.get('id');
    
    console.log('ID detectado por parámetro:', courseId);

    if (!courseId) {
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';
        courseId = pageName.replace('curso-', '').replace('.html', '');
        console.log('ID deducido por ruta:', courseId);
    }
    
    if (!courseId || courseId === 'index' || courseId === 'curso-detalles') {
        console.warn('No se ha podido identificar el curso. Abortando renderizado.');
        return;
    }

    function getSoftwareIcon(name) {
        const icons = [
            { key: 'maya', icon: 'fa-solid fa-cube' },
            { key: 'zbrush', icon: 'fa-solid fa-gem' },
            { key: 'blender', icon: 'fa-solid fa-bezier-curve' },
            { key: 'nuke', icon: 'fa-solid fa-layer-group' },
            { key: 'houdini', icon: 'fa-solid fa-fire-flame-curved' },
            { key: 'unreal', icon: 'fa-solid fa-gamepad' },
            { key: 'unity', icon: 'fa-brands fa-unity' },
            { key: 'python', icon: 'fa-brands fa-python' },
            { key: 'photoshop', icon: 'fa-solid fa-palette' },
            { key: 'after effects', icon: 'fa-solid fa-wand-magic-sparkles' },
            { key: 'substance', icon: 'fa-solid fa-fill-drip' },
            { key: 'marvelous', icon: 'fa-solid fa-shirt' },
            { key: 'ai', icon: 'fa-solid fa-microchip' },
            { key: 'code', icon: 'fa-solid fa-code' }
        ];
        const lowerName = name.toLowerCase();
        const match = icons.find(item => lowerName.includes(item.key));
        return match ? match.icon : 'fa-solid fa-laptop-code';
    }

    try {
        // Cargar ambas fuentes de datos
        const [resCourses, resTeam] = await Promise.all([
            fetch('data/courses.json'),
            fetch('data/team.json')
        ]);

        const courses = await resCourses.json();
        const team = await resTeam.json();
        const course = courses.find(c => c.id === courseId || (c.id && courseId.includes(c.id)));
        
        if (!course) {
            console.error('Curso no encontrado para el ID:', courseId);
            return;
        }

        console.log('Cargando curso:', course.title);

        const accentText = course.accentColor === 'factor-cyan' ? 'text-factor-cyan' : 'text-factor-green';
        const accentBg = course.accentColor === 'factor-cyan' ? 'bg-factor-cyan' : 'bg-factor-green';
        const accentBorder = course.accentColor === 'factor-cyan' ? 'border-factor-cyan/30' : 'border-factor-green/30';
        const accentHover = course.accentColor === 'factor-cyan' ? 'hover:border-factor-cyan/50' : 'hover:border-factor-green/50';

        // 1. HERO
        const heroSection = document.getElementById('course-hero');
        if (heroSection && course.banner) {
            heroSection.innerHTML = `
                <img src="${course.banner.image}" alt="${course.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-r from-[#212733]/40 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-[#212733]/80 via-transparent to-transparent"></div>
                <div class="absolute inset-0 flex flex-col justify-between py-6">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-factor-textMuted mb-6">
                            <a href="escuela.html" class="hover:${accentText} transition-colors">Escuela</a>
                            <i class="fa-solid fa-chevron-right text-[10px]"></i>
                            <span class="${accentText}">${course.category || 'Curso'}</span>
                        </nav>
                        <h1 class="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-[0.9] tracking-tighter uppercase" style="text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${course.title}</h1>
                    </div>
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-end gap-6">
                        <div class="flex flex-wrap gap-3">
                            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-factor-panel/80 backdrop-blur-md border border-white/10 text-sm">
                                <i class="fa-solid fa-location-dot ${accentText}"></i>
                                <span class="text-white font-semibold uppercase text-xs">${course.mode || 'Presencial'}</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-factor-panel/80 backdrop-blur-md border border-white/10 text-sm">
                                <i class="fa-solid fa-clock ${accentText}"></i>
                                <span class="text-white font-semibold uppercase text-xs">${course.hours || '-'}</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-factor-panel/80 backdrop-blur-md border border-white/10 text-sm">
                                <i class="fa-solid fa-calendar ${accentText}"></i>
                                <span class="text-white font-semibold uppercase text-xs">${course.duration || '-'}</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-factor-panel/80 backdrop-blur-md border border-white/10 text-sm border-dashed">
                                <i class="fa-solid fa-gauge-high ${accentText}"></i>
                                <span class="text-white font-semibold uppercase tracking-widest text-[10px]">${course.level || 'Todos los niveles'}</span>
                            </div>
                            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-factor-cyan/10 border border-factor-cyan/20 text-sm">
                                <i class="fa-solid fa-circle text-[5px] text-factor-cyan animate-pulse"></i>
                                <span class="text-factor-cyan font-bold uppercase tracking-widest text-[10px]">${course.spotsStatus || 'Plazas Limitadas'}</span>
                            </div>
                        </div>
                        <div class="px-6 py-2.5 rounded-2xl bg-factor-panel/80 backdrop-blur-xl border border-white/10">
                            <div class="flex flex-col items-end">
                                <span class="text-[8px] font-bold text-factor-cyan uppercase tracking-[0.2em] leading-none mb-1">Próxima Edición</span>
                                <span class="text-white font-black text-lg tracking-tight uppercase">${course.nextDate || 'Próximamente'}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        // 2. VISION
        const visionContainer = document.getElementById('course-vision');
        if (visionContainer) {
            visionContainer.innerHTML = `
                <h3 class="text-3xl font-black text-white mb-6 tracking-tight uppercase">${course.subtitleVision || 'El estándar de la Industria Real'}</h3>
                <p class="text-xl text-factor-textMuted leading-relaxed font-light mb-8">${course.description || ''}</p>`;
        }

        // 3. PERFIL DEL ALUMNO (SIDEBAR)
        const audienceContainer = document.getElementById('target-audience-container');
        if (audienceContainer && course.targetAudience) {
            audienceContainer.innerHTML = `
                <div class="p-8 rounded-2xl bg-[#1a1e28] border ${accentBorder} relative overflow-hidden group transition-all duration-500 hover:border-factor-cyan/50">
                    <h4 class="text-[10px] font-black text-white mb-6 flex items-center gap-3 uppercase tracking-[0.2em] opacity-80">
                        <i class="fa-solid fa-user-gear ${accentText}"></i>
                        ${course.targetAudience.title || 'Perfil del Alumno'}
                    </h4>
                    <div class="space-y-4">
                        ${(course.targetAudience.traits || []).map(trait => `
                            <div class="flex items-start gap-3 text-xs text-factor-textMuted leading-relaxed">
                                <i class="fa-solid fa-check ${accentText} mt-1 text-[10px]"></i>
                                <span>${trait}</span>
                            </div>`).join('')}
                    </div>
                </div>`;
        }

        // 4. SOFTWARE
        const softwareContainer = document.getElementById('software-pipeline-container');
        if (softwareContainer && course.software) {
            softwareContainer.innerHTML = `
                <div class="py-12 border-y border-factor-border/30">
                    <h4 class="text-[11px] font-black uppercase tracking-[0.2em] text-factor-textMuted mb-8">Pipeline de Trabajo</h4>
                    <div class="flex flex-wrap gap-12 items-center opacity-80">
                        ${course.software.map(sw => `
                            <div class="flex items-center gap-3 group transition-all duration-300 hover:translate-y-[-2px]">
                                <i class="${getSoftwareIcon(sw.name)} text-3xl group-hover:${accentText} transition-colors"></i>
                                <span class="font-bold text-sm text-white/80 group-hover:text-white uppercase tracking-widest">${sw.name}</span>
                            </div>`).join('')}
                    </div>
                </div>`;
        }

        // 5. TEMARIO
        const syllabusList = document.getElementById('syllabus-container');
        if (course.syllabus && syllabusList) {
            syllabusList.innerHTML = course.syllabus.map((module, i) => `
                <div class="group relative bg-[#1a1e28] rounded-2xl p-6 lg:p-8 border border-factor-border/30 ${accentHover} transition-all duration-300">
                    <div class="absolute left-0 top-0 bottom-0 w-1 ${accentBg} rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        <div class="text-4xl font-black text-factor-border group-hover:${accentText} transition-colors">${String(i + 1).padStart(2, '0')}</div>
                        <div>
                            <h4 class="text-white font-bold text-xl mb-3 uppercase tracking-tight">${module.title}</h4>
                            <p class="text-factor-textMuted text-sm leading-relaxed mb-4">${module.description}</p>
                        </div>
                    </div>
                </div>`).join('');
        }

        // 6. METODOLOGIA
        const methodologyContainer = document.getElementById('methodology-container');
        if (methodologyContainer && course.methodology) {
            methodologyContainer.innerHTML = `
                <div class="bg-factor-panel/30 rounded-[2rem] p-8 lg:p-12 border border-factor-border/30 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-64 h-64 ${accentBg}/5 rounded-full blur-3xl"></div>
                    <h2 class="text-3xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter">
                        <i class="fa-solid fa-bolt ${accentText}"></i>
                        Metodología de <span class="${accentText}">Alto Rendimiento</span>
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        ${course.methodology.map(item => `
                            <div class="relative group">
                                <div class="flex items-start gap-5">
                                    <div class="w-12 h-12 rounded-2xl bg-[#1a1e28] border border-factor-border/30 flex items-center justify-center shrink-0 group-hover:border-${course.accentColor}/50 transition-all duration-300">
                                        <i class="${item.icon || 'fa-solid fa-star'} text-xl ${accentText}"></i>
                                    </div>
                                    <div class="space-y-2">
                                        <h4 class="text-white font-bold text-lg leading-tight uppercase group-hover:${accentText} transition-colors">${item.title}</h4>
                                        <p class="text-factor-textMuted text-sm leading-relaxed font-light">${item.text}</p>
                                    </div>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>`;
        }

        // 7. PROFESORES
        const professorSection = document.getElementById('professors-container');
        if (professorSection && course.professors) {
            const dynamicProfs = course.professors.map(courseProf => {
                return team.find(t => t.name === courseProf.name) || courseProf;
            });

            professorSection.innerHTML = dynamicProfs.map(prof => `
                <div class="bg-[#1a1e28] border border-factor-border/30 rounded-3xl p-8 mb-6 group hover:border-factor-cyan/30 transition-all duration-500 relative overflow-hidden">
                    <div class="flex flex-col items-center text-center">
                        <span class="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 block border-b border-white/5 pb-2 w-full">Mentor del Programa</span>
                        <div class="w-24 h-24 rounded-full border-2 border-factor-border overflow-hidden mb-5 group-hover:border-factor-cyan transition-colors">
                            <img src="${prof.image || './img/team/placeholder.jpg'}" alt="${prof.name}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                        </div>
                        <h4 class="text-xl font-extrabold text-white mb-1 uppercase tracking-tighter">${prof.name}</h4>
                        <div class="text-factor-cyan font-black text-[9px] uppercase tracking-widest mb-4">${prof.role || ''}</div>
                        <p class="text-factor-textMuted text-[13px] leading-relaxed mb-6 font-light">${prof.bio || ''}</p>
                        <div class="flex flex-wrap justify-center gap-2">
                            ${(prof.tags || []).map(tag => `
                                <span class="bg-factor-cyan/10 text-factor-cyan border border-factor-cyan/20 text-[9px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>`).join('');
        }

    } catch (error) {
        console.error('Error cargando los detalles del curso:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCourseDetails);
