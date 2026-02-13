// Global variable to hold settings
let appSettings = {};

// Function to load settings from JSON file with fallback to embedded script
async function loadSettings() {
    try {
        // First, try to fetch settings from the external JSON file
        const response = await fetch('settings.json');
        if (response.ok) {
            appSettings = await response.json();
        } else {
            // If fetching the JSON file fails, fall back to the embedded settings
            if (typeof settingsData !== 'undefined') {
                appSettings = settingsData;
            } else {
                throw new Error('Neither external settings.json nor embedded settings found');
            }
        }
        
        // Initialize the app after settings are loaded
        initializeApp();
    } catch (error) {
        console.error('Error loading settings:', error);
        // Try to use embedded settings as a last resort
        if (typeof settingsData !== 'undefined') {
            appSettings = settingsData;
            initializeApp();
        }
    }
}

// Initialize the app after settings are loaded
function initializeApp() {
    // Set page title from settings
    document.getElementById('pageTitle').textContent = appSettings.appSettings.title;
    
    // Set music source from settings
    document.getElementById('musicSource').src = appSettings.music.audioSource;
    document.getElementById('bgMusic').load(); // Reload audio element with new source
    
    // Generate slides from settings
    generateSlides();
    
    // Populate letter content from settings
    populateLetterContent();
    
    // Initialize the WebGL app
    new App();
    
    // Initialize music controls
    initializeMusicControls();
    
    // Initialize slide navigation
    initializeSlideNavigation();
    
    // Initialize proposal buttons
    initializeProposalButtons();
}

// Function to generate slides from settings
function generateSlides() {
    const slidesContainer = document.getElementById('slidesContainer');
    slidesContainer.innerHTML = ''; // Clear existing slides
    
    appSettings.slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        if (slide.id === 'proposalSlide') {
            slideDiv.id = 'proposalSlide';
        }
        
        if (slide.type === 'text-only') {
            slideDiv.innerHTML = `<h1 class="${index === 0 ? 'magical-text' : ''}">${slide.textContent}</h1>`;
        } else if (slide.type === 'gallery') {
            let galleryHTML = `
                <div style="text-align: center; width: 100%;">
                    <h1 style="margin-bottom:30px">${slide.textContent}</h1>
                    <div class="gallery-wrapper">`;
            
            slide.galleryImages.forEach(img => {
                galleryHTML += `
                    <div class="photo-card" style="transform: ${img.transform}; ${img.zIndex ? `z-index:${img.zIndex}` : ''}">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>`;
            });
            
            galleryHTML += `
                    </div>
                </div>`;
            
            slideDiv.innerHTML = galleryHTML;
        } else if (slide.type === 'proposal') {
            let buttonsHTML = '<div style="text-align:center; width:100%">';
            buttonsHTML += `<h1>${slide.textContent}</h1>`;
            buttonsHTML += '<div class="btn-container">';
            buttonsHTML += `<button class="${slide.buttons.yes.className}" id="yesBtn">${slide.buttons.yes.text}</button>`;
            buttonsHTML += `<button class="${slide.buttons.no.className}" id="noBtn">${slide.buttons.no.text}</button>`;
            buttonsHTML += '</div></div>';
            
            slideDiv.innerHTML = buttonsHTML;
        }
        
        slidesContainer.appendChild(slideDiv);
    });
}

// Function to populate letter content from settings
function populateLetterContent() {
    const fullLetter = document.getElementById('fullLetter');
    let letterHTML = `<h3 style="color:${appSettings.colors.primaryAccent}; text-align:center; margin-bottom:20px;">${appSettings.letterContent.header}</h3>`;
    
    appSettings.letterContent.paragraphs.forEach(paragraph => {
        letterHTML += `<p>${paragraph}</p>`;
    });
    
    letterHTML += `<div class="signature">${appSettings.letterContent.signature}</div>`;
    
    fullLetter.innerHTML = letterHTML;
}

// --- تنظیمات WebGL Background (تیره و شیک) ---
class TouchTexture {
    constructor() {
        this.size = 64;
        this.width = this.height = this.size;
        this.maxAge = 64;
        this.radius = 0.25 * this.size;
        this.speed = 1 / this.maxAge;
        this.trail = [];
        this.last = null;
        this.initTexture();
    }
    initTexture() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture = new THREE.Texture(this.canvas);
    }
    update() {
        this.clear();
        let speed = this.speed;
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i];
            let f = point.force * speed * (1 - point.age / this.maxAge);
            point.x += point.vx * f;
            point.y += point.vy * f;
            point.age++;
            if (point.age > this.maxAge) {
                this.trail.splice(i, 1);
            } else {
                this.drawPoint(point);
            }
        }
        this.texture.needsUpdate = true;
    }
    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    addTouch(point) {
        let force = 0;
        let vx = 0;
        let vy = 0;
        const last = this.last;
        if (last) {
            const dx = point.x - last.x;
            const dy = point.y - last.y;
            if (dx === 0 && dy === 0) return;
            const dd = dx * dx + dy * dy;
            let d = Math.sqrt(dd);
            vx = dx / d;
            vy = dy / d;
            force = Math.min(dd * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }
    drawPoint(point) {
        const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
        let intensity = 1;
        if (point.age < this.maxAge * 0.3) {
            intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
        } else {
            const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
            intensity = -t * (t - 2);
        }
        intensity *= point.force;
        const radius = this.radius;
        let offset = this.size * 5;
        this.ctx.shadowOffsetX = offset;
        this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = radius * 1;
        this.ctx.shadowColor = `rgba(255, 255, 255, ${0.8 * intensity})`;
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class GradientBackground {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.mesh = null;
        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1: { value: new THREE.Vector3(0.40, 0.01, 0.10) },
            uColor2: { value: new THREE.Vector3(0.30, 0.05, 0.15) },
            uColor3: { value: new THREE.Vector3(0.20, 0.00, 0.05) },
            uColor4: { value: new THREE.Vector3(0.15, 0.02, 0.05) },
            uColor5: { value: new THREE.Vector3(0.30, 0.05, 0.15) },
            uColor6: { value: new THREE.Vector3(0.40, 0.01, 0.10) },
            uSpeed: { value: 0.6 },
            uIntensity: { value: 0.5 },
            uTouchTexture: { value: null },
            uGrainIntensity: { value: 0.05 },
            uDarkNavy: { value: new THREE.Vector3(0.99, 0.30, 0.51) },
            uGradientSize: { value: 1.2 },
            uGradientCount: { value: 6.0 },
            uColor1Weight: { value: 1.0 },
            uColor2Weight: { value: 1.0 }
        };
    }
    init() {
        const viewSize = this.sceneManager.getViewSize();
        const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vec3 pos = position.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
                uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6;
                uniform float uSpeed; uniform float uIntensity;
                uniform sampler2D uTouchTexture; uniform float uGrainIntensity;
                uniform vec3 uDarkNavy; uniform float uGradientSize;

                varying vec2 vUv;

                float grain(vec2 uv, float time) {
                    vec2 grainUv = uv * uResolution * 0.5;
                    float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                    return grainValue * 2.0 - 1.0;
                }

                vec3 getGradientColor(vec2 uv, float time) {
                    vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                    vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                    vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                    vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);

                    float dist1 = length(uv - center1);
                    float dist2 = length(uv - center2);
                    float dist3 = length(uv - center3);
                    float dist4 = length(uv - center4);

                    float influence1 = 1.0 - smoothstep(0.0, uGradientSize, dist1);
                    float influence2 = 1.0 - smoothstep(0.0, uGradientSize, dist2);
                    float influence3 = 1.0 - smoothstep(0.0, uGradientSize, dist3);
                    float influence4 = 1.0 - smoothstep(0.0, uGradientSize, dist4);

                    vec3 color = vec3(0.0);
                    color += uColor1 * influence1 * (0.6 + 0.4 * sin(time));
                    color += uColor2 * influence2 * (0.6 + 0.4 * cos(time));
                    color += uColor3 * influence3;
                    color += uColor4 * influence4;

                    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

                    float brightness = length(color);
                    float mixFactor = max(brightness * 1.2, 0.15);
                    color = mix(uDarkNavy, color, mixFactor);

                    return color;
                }

                void main() {
                    vec2 uv = vUv;
                    vec4 touchTex = texture2D(uTouchTexture, uv);
                    float intensity = touchTex.b;
                    uv.x += -(touchTex.r * 2.0 - 1.0) * 0.8 * intensity;
                    uv.y += -(touchTex.g * 2.0 - 1.0) * 0.8 * intensity;

                    vec3 color = getGradientColor(uv, uTime);
                    color += grain(uv, uTime) * uGrainIntensity;

                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.sceneManager.scene.add(this.mesh);
    }
    update(delta) {
        if (this.uniforms.uTime) this.uniforms.uTime.value += delta;
    }
    onResize(width, height) {
        const viewSize = this.sceneManager.getViewSize();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        }
        if (this.uniforms.uResolution) this.uniforms.uResolution.value.set(width, height);
    }
}

class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.domElement.id = "webGLApp";
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 50;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.touchTexture = new TouchTexture();
        this.gradientBackground = new GradientBackground(this);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

        this.init();
    }
    init() {
        this.gradientBackground.init();
        this.tick();
        window.addEventListener("resize", () => this.onResize());
        window.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
        window.addEventListener("touchmove", (ev) => this.onTouchMove(ev));
    }
    onTouchMove(ev) {
        const touch = ev.touches[0];
        this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
    onMouseMove(ev) {
        this.mouse = { x: ev.clientX / window.innerWidth, y: 1 - ev.clientY / window.innerHeight };
        this.touchTexture.addTouch(this.mouse);
    }
    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
        return { width: height * this.camera.aspect, height };
    }
    update(delta) {
        this.touchTexture.update();
        this.gradientBackground.update(delta);
    }
    render() {
        const delta = this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
        this.update(delta);
    }
    tick() {
        this.render();
        requestAnimationFrame(() => this.tick());
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.gradientBackground.onResize(window.innerWidth, window.innerHeight);
    }
}

// Initialize music controls
function initializeMusicControls() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const iconPlay = document.getElementById('iconPlay');
    const iconMute = document.getElementById('iconMute');
    let isMusicPlaying = false;

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            iconPlay.style.display = 'none';
            iconMute.style.display = 'block';
            musicBtn.classList.remove('playing-animation');
        } else {
            bgMusic.play();
            iconPlay.style.display = 'block';
            iconMute.style.display = 'none';
            musicBtn.classList.add('playing-animation');
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    document.body.addEventListener('click', () => {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                iconPlay.style.display = 'block';
                iconMute.style.display = 'none';
                musicBtn.classList.add('playing-animation');
            }).catch(e => console.log("Audio autoplay prevented by browser"));
        }
    }, { once: true });
}

// Initialize slide navigation
function initializeSlideNavigation() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const tapHint = document.getElementById('tapHint');
    let isAnimating = false;

    document.addEventListener('click', (e) => {
        if(e.target.closest('#musicBtn') || e.target.closest('.envelope-wrapper') || e.target.closest('.full-letter')) return;
        if(e.target.closest('button')) return;

        if(currentSlide < slides.length - 1 && !isAnimating) {
            isAnimating = true;
            if(currentSlide === slides.length - 2) tapHint.style.display = 'none';

            // انیمیشن خروج اسلاید فعلی (با GSAP)
            gsap.to(slides[currentSlide], {
                opacity: 0, scale: 1.1, duration: 0.5, ease: "power2.in",
                onComplete: () => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide++;
                    const newSlide = slides[currentSlide];
                    newSlide.classList.add('active');

                    // --- اعمال انیمیشن متن جادویی ---
                    // پیدا کردن تگ h1 در اسلاید جدید
                    const h1Text = newSlide.querySelector('h1');
                    if (h1Text) {
                        // ریست کردن انیمیشن برای اینکه دوباره اجرا بشه
                        h1Text.classList.remove('magical-text');
                        void h1Text.offsetWidth; // Trigger reflow
                        h1Text.classList.add('magical-text');

                        // فقط اسلاید رو ظاهر کن، متن خودش انیمیشن داره
                        gsap.set(newSlide, {opacity: 1});
                        isAnimating = false;
                    } else {
                        // اگر اسلاید متن نداشت (مثل گالری)، از انیمیشن ساده استفاده کن
                        gsap.fromTo(newSlide.children,
                            {y: 50, opacity: 0},
                            {y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)", onComplete: ()=> isAnimating=false}
                        );
                    }

                    if(currentSlide === 3) {
                        gsap.from('.photo-card', {rotation: 180, scale: 0, stagger: 0.2, duration: 1, ease: "elastic.out(1, 0.75)"});
                    }
                }
            });
        }
    });
}

// Initialize proposal buttons
function initializeProposalButtons() {
    const noBtn = document.getElementById('noBtn');
    const funnyTexts = appSettings.messages.funnyNoResponses; // Use settings for funny responses
    function moveNoBtn() {
        const maxX = window.innerWidth - noBtn.offsetWidth - 30;
        const maxY = window.innerHeight - noBtn.offsetHeight - 30;
        const x = Math.random() * maxX + 15;
        const y = Math.random() * maxY + 15;
        noBtn.innerText = funnyTexts[Math.floor(Math.random()*funnyTexts.length)];
        noBtn.style.position = 'fixed';
        gsap.to(noBtn, {left: x, top: y, duration: 0.35, ease: "power2.out"});
    }
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); });
    noBtn.addEventListener('mouseover', moveNoBtn);

    const yesBtn = document.getElementById('yesBtn');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.getElementById('envelope');
    const fullLetter = document.getElementById('fullLetter');

    yesBtn.addEventListener('click', () => {
        confetti({particleCount: appSettings.animations.confettiParticleCount, spread: appSettings.animations.confettiSpread, origin: { y: 0.6 }, colors: appSettings.animations.confettiColors});
        gsap.to('#proposalSlide', {opacity: 0, duration: 0.5, pointerEvents: "none"});
        gsap.to(envelopeWrapper, {
            autoAlpha: 1, duration: 0.8, delay: 0.3,
            onStart: () => {
                 setInterval(() => {
                    confetti({particleCount: 10, spread: 360, startVelocity: 10, gravity: 0.5, origin: {x: Math.random(), y: Math.random() - 0.2}, colors: ['#F24D89', '#fff']});
                }, 800);
            }
        });
        gsap.from(envelope, {scale: 0, rotation: -15, duration: 1, delay: 0.4, ease: "elastic.out(1, 0.6)"});
    });

    envelope.addEventListener('click', () => {
        const tl = gsap.timeline();
        tl.to('.envelope-flap', {rotateX: 180, duration: 0.6, ease: "power2.in"})
          .to('.heart-seal', {opacity: 0, duration: 0.2}, "<0.1")
          .to('.letter-content', {y: -70, height: 140, duration: 0.5, ease: "power1.out"})
          .to(envelope, {scale: 2, opacity: 0, duration: 0.6, ease: "power2.in"})
          .to(fullLetter, {scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)"}, "-=0.4");
        confetti({particleCount: 300, spread: 120, startVelocity: 40, origin: { y: 0.7 }, colors: appSettings.animations.confettiColors});
    });
}

// Load settings and initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', loadSettings);