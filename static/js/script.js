document.addEventListener('DOMContentLoaded', () => {
    // stars init
    const starsContainer = document.getElementById('stars-container');
    const starCount = window.innerWidth < 600 ? 150 : 250;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }

    // fireworks init
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ffd700', '#00b7eb', '#ff4040', '#ffffff'];
    const fireworks = [];
    const particles = [];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.4 + 100;
            this.vy = -(Math.random() * 5 + 10);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = 2;
            this.alpha = 1;
        }

        update() {
            this.y += this.vy;
            if (this.y <= this.targetY) {
                explode(this.x, this.y, this.color);
                return true;
            }
            return false;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.color = color;
            this.size = Math.random() * 2 + 1;
            this.alpha = 1;
            this.gravity = 0.05;
            this.friction = 0.98;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.015;
            return this.alpha <= 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function explode(x, y, color) {
        const particleCount = window.innerWidth < 600 ? 30 : 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < (window.innerWidth < 600 ? 0.05 : 0.06)) {
            fireworks.push(new Firework());
        }
        fireworks.forEach((firework, index) => {
            if (firework.update()) {
                fireworks.splice(index, 1);
            } else {
                firework.draw();
            }
        });
        particles.forEach((particle, index) => {
            if (particle.update()) {
                particles.splice(index, 1);
            } else {
                particle.draw();
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    animate();

 // music control with position saving and player toggle
    const music = document.getElementById('background-music');
    const toggleButton = document.getElementById('music-toggle');
    const showPlayerBtn = document.getElementById('show-player-btn');
    const audioPlayer = document.getElementById('custom-audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTime = document.getElementById('current-time');
    const duration = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    let isPlaying = false;
    let isPlayerVisible = false;

    // Position restoration
    const savedTime = localStorage.getItem('musicTime');
    if (savedTime) {
        music.currentTime = parseFloat(savedTime);
    }

    // Autoplay music on boot
    music.play().then(() => {
        isPlaying = true;
        toggleButton.innerHTML = '🔇';
        playPauseBtn.textContent = '⏸';
    }).catch(error => {
        console.log('Autoplay is blocked, press the button to activate:', error);
        toggleButton.innerHTML = '🔊';
        playPauseBtn.textContent = '▶';
    });

    // Update time and position
    music.addEventListener('timeupdate', () => {
        seekBar.value = (music.currentTime / music.duration) * 100 || 0;
        currentTime.textContent = formatTime(music.currentTime);
        if (music.duration) {
            duration.textContent = formatTime(music.duration);
        }
        localStorage.setItem('musicTime', music.currentTime);
    });

    // Rewind
    seekBar.addEventListener('input', () => {
        const time = (seekBar.value / 100) * music.duration;
        music.currentTime = time;
        localStorage.setItem('musicTime', music.currentTime);
    });

    // Volume
    volumeBar.addEventListener('input', () => {
        music.volume = volumeBar.value;
    });

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            playPauseBtn.textContent = '▶';
        } else {
            music.play().then(() => {
                isPlaying = true;
                playPauseBtn.textContent = '⏸';
            }).catch(error => {
                console.log('Playback error:', error);
            });
        }
        isPlaying = !isPlaying;
        toggleButton.innerHTML = isPlaying ? '🔇' : '🔊';
    });

    // Toggle player visibility
    showPlayerBtn.addEventListener('click', () => {
        isPlayerVisible = !isPlayerVisible;
        audioPlayer.classList.toggle('active');
        showPlayerBtn.textContent = isPlayerVisible ? '🎵 დამალვა' : '🎵 გახსნა';
    });

    // sync toggleButton
    toggleButton.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggleButton.innerHTML = '🔊';
            if (isPlayerVisible) playPauseBtn.textContent = '▶';
        } else {
            music.play().then(() => {
                isPlaying = true;
                toggleButton.innerHTML = '🔇';
                if (isPlayerVisible) playPauseBtn.textContent = '⏸';
            }).catch(error => {
                console.log('Ошибка воспроизведения:', error);
            });
        }
        isPlaying = !isPlaying;
    });

    // format time
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // text animation
    const letterTexts = document.querySelectorAll('.letter-text');
    letterTexts.forEach((text, index) => {
        text.style.animationDelay = `${index * 1}s`;
    });

    // pages transition
    document.querySelectorAll('a[href^="/"], .scroll-button').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const main = document.querySelector('main');
            if (main) {
                main.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            } else {
                window.location.href = href;
            }
        });
    });
});