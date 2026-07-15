// Lista de todos los archivos multimedia de img
const mediaFiles = [
  "img/1.jpg", "img/10.jpg", "img/1000044625.mp4", "img/1000044632.jpg", "img/1000053889.jpg", 
  "img/1000053901.jpg", "img/1000053958.jpg", "img/1000062175.jpg", "img/11.jpg", "img/12.jpg", 
  "img/13.jpg", "img/14.jpg", "img/16.jpg", "img/17.jpg", "img/19.jpg", "img/2.jpg", "img/20.jpg", 
  "img/21.mp4", "img/24.jpg", "img/25.jpg", "img/26.jpg", "img/27.mp4", "img/28.mp4", "img/29.mp4", 
  "img/3.jpg", "img/30.mp4", "img/31.mp4", "img/32.jpg", "img/33.jpg", "img/34.mp4", "img/35.jpg", 
  "img/4.jpg", "img/5.webp", "img/6.jpg", "img/7.jpg", "img/8.jpg", "img/9.mp4"
];

// Barajar aleatoriamente para que siempre sea distinto
mediaFiles.sort(() => Math.random() - 0.5);

// Deduplicar archivos basados en el nombre (ignorar carpeta)
const uniqueMedia = [];
const seenNames = new Set();
for(const file of mediaFiles) {
  const filename = file.split('/').pop();
  if(!seenNames.has(filename)) {
    seenNames.add(filename);
    uniqueMedia.push(file);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  // ============================================================
  // 3D UNIVERSE STARFIELD GENERATOR
  // ============================================================
  function generateStars(count, size) {
    let shadow = "";
    for(let i=0; i<count; i++) {
      const x = Math.floor(Math.random() * 2000) - 1000;
      const y = Math.floor(Math.random() * 2000) - 1000;
      shadow += `${x}px ${y}px #FFF${i < count - 1 ? ',' : ''}`;
    }
    return shadow;
  }
  
  const sSmall = document.querySelector('.stars-small');
  const sMedium = document.querySelector('.stars-medium');
  const sLarge = document.querySelector('.stars-large');
  
  if(sSmall) {
    sSmall.style.width = '1px'; sSmall.style.height = '1px'; sSmall.style.background = 'transparent';
    sSmall.style.boxShadow = generateStars(500, 1);
  }
  if(sMedium) {
    sMedium.style.width = '2px'; sMedium.style.height = '2px'; sMedium.style.background = 'transparent';
    sMedium.style.boxShadow = generateStars(200, 2);
  }
  if(sLarge) {
    sLarge.style.width = '3px'; sLarge.style.height = '3px'; sLarge.style.background = 'transparent';
    sLarge.style.boxShadow = generateStars(50, 3);
  }

  // ============================================================
  // REVELADO AL HACER SCROLL (Observer Principal)
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { 
        e.target.classList.add('in'); 
        io.unobserve(e.target); 
      }
    });
  }, { threshold: 0.1 });
  
  revealEls.forEach(el => io.observe(el));

  // ============================================================
  // GENERADOR MASONRY (Galería Infinita Glassmorphism)
  // ============================================================
  const gallery = document.getElementById("masonry-gallery");
  if (gallery) {
    uniqueMedia.forEach((file, index) => {
      const isVideo = file.endsWith(".mp4");
      
      const item = document.createElement("div");
      item.className = "masonry-item reveal";
      item.style.transitionDelay = `${(index % 15) * 40}ms`;

      if (isVideo) {
        // Videos en bucle, despausados (autoplay, muted es necesario en navegadores modernos para autoplay)
        item.innerHTML = `
          <video class="media-content lazy-video" data-src="${file}" autoplay loop muted playsinline poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23111'/%3E%3C/svg%3E"></video>
        `;
        // Al darle clic puede activar/desactivar el sonido si se desea, pero por ahora solo es visual.
        item.addEventListener("click", () => {
          const vid = item.querySelector("video");
          vid.muted = !vid.muted; // Opcional: Permitir activar sonido al tocar
        });
      } else {
        item.innerHTML = `<img class="media-content lazy" data-src="${file}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23111'/%3E%3C/svg%3E" alt="Memoria" loading="lazy">`;
      }

      // 3D Tilt Effect
      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -15; // Max 15deg
        const tiltY = ((x - centerX) / centerX) * 15;
        
        item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      item.addEventListener("mouseleave", () => {
        item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });

      gallery.appendChild(item);
      io.observe(item); // Observar los nuevos ítems
    });

    // ============================================================
    // LAZY LOADING OPTIMIZADO (Evita colapso en celular)
    // ============================================================
    const lazyMediaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const media = entry.target;
          media.src = media.getAttribute('data-src');
          if (media.tagName.toLowerCase() === 'img') {
            media.classList.remove('lazy');
          } else if (media.tagName.toLowerCase() === 'video') {
            media.classList.remove('lazy-video');
          }
          observer.unobserve(media);
        }
      });
    }, { rootMargin: "300px" });

    document.querySelectorAll('.lazy, .lazy-video').forEach(media => lazyMediaObserver.observe(media));
  }

  // ============================================================
  // PARALLAX DE LA AURORA Y HERO
  // ============================================================
  let ticking = false;
  const heroFrame = document.querySelector('.hero-frame');
  const heroTitle = document.querySelector('.hero-title');
  const auroras = document.querySelectorAll('.aurora-blob');

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        
        // Auroras moviéndose al scrollear
        auroras.forEach((b, i) => {
          const speed = 0.05 + i * 0.03;
          b.style.transform = `translateY(${y * speed}px)`;
        });

        // Desvanecido suave del hero al bajar
        if (heroFrame && y < 1000) {
          const fade = Math.max(0, 1 - y / 600);
          heroFrame.style.transform = `translateY(${y * 0.15}px) scale(${1 - Math.min(y / 4000, 0.06)})`;
          heroFrame.style.opacity = fade;
        }
        if (heroTitle && y < 1000) {
          heroTitle.style.transform = `translateY(${y * 0.08}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });

});