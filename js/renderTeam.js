/**
 * Renderiza el equipo dinámicamente en la página Conócenos
 */
async function renderTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;

    try {
        const response = await fetch('data/team.json');
        const team = await response.json();

        grid.innerHTML = team.map(prof => {
            // Determinar color de acento (soporta clases Tailwind o HEX)
            const isHex = prof.accentColor.startsWith('#');
            const accentClass = isHex ? '' : prof.accentColor;
            const textColorClass = isHex ? '' : `text-${prof.accentColor}`;
            const bgColorClass = isHex ? '' : `bg-${prof.accentColor}/5`;
            const bgHoverClass = isHex ? '' : `group-hover:bg-${prof.accentColor}/10`;
            
            // Estilos en línea para colores HEX si fuera necesario
            const customStyles = isHex ? `style="color: ${prof.accentColor};"` : '';
            const customBgStyles = isHex ? `style="background-color: ${prof.accentColor}0D;"` : ''; // 0D es ~5% de opacidad
            const customHoverStyles = isHex ? `onmouseover="this.style.backgroundColor='${prof.accentColor}1A'" onmouseout="this.style.backgroundColor='${prof.accentColor}0D'"` : '';

            return `
                <div class="profile-card rounded-2xl p-8 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-32 h-32 ${bgColorClass} rounded-bl-full pointer-events-none ${bgHoverClass} transition-colors duration-500" 
                         ${isHex ? customBgStyles + ' ' + customHoverStyles : ''}></div>
                    
                    <div class="flex items-center justify-center mb-6">
                        <div class="profile-image-container w-32 h-32 rounded-full border-2 border-factor-border overflow-hidden bg-black flex items-center justify-center p-1 shadow-xl">
                            <img src="${prof.image}" alt="${prof.name}" class="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500">
                        </div>
                    </div>

                    <div class="text-center">
                        <h3 class="text-2xl font-bold text-white mb-1">${prof.name}</h3>
                        <div class="${textColorClass} font-bold text-xs uppercase tracking-widest mb-4" ${customStyles}>
                            ${prof.role}
                        </div>
                        <p class="text-factor-textMuted text-sm leading-relaxed mb-4">
                            ${prof.bio}
                        </p>
                        <div class="inline-flex flex-wrap justify-center gap-2">
                            ${(prof.tags || []).map((tag, i) => {
                                // Alternar estilos de tags para dinamismo visual
                                const isPrimary = i === 0;
                                return `
                                    <span class="${isPrimary ? 'bg-factor-cyan/10 text-factor-cyan border-factor-cyan/30' : 'bg-white/5 text-factor-textLight border-white/10'} border text-[10px] uppercase font-bold px-2 py-1 rounded">
                                        ${tag}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error cargando el equipo:', error);
    }
}

document.addEventListener('DOMContentLoaded', renderTeam);
