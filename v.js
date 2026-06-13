/* -------------------------------------------------------------
   PALNATI PUSHPA NAGA VENKATA SRINIVAS - PREMIUM PORTFOLIO JS
   Controllers: Canvas Particles, Web-Cam Recording, Voice Waves
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. MOBILE NAVIGATION MENU
    // ---------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenuWrapper) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenuWrapper.classList.remove('active');
            });
        });
    }

    // ---------------------------------------------------------
    // 2. INTERACTIVE PARTICLES CONSTELLATION CANVAS
    // ---------------------------------------------------------
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.speedY = Math.random() * 0.8 - 0.4;
                this.color = Math.random() > 0.5 ? '#9d4edd' : '#00f2fe';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                // Mouse interactivity
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.03;
                        this.y -= dy * force * 0.03;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 120);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        let opacity = (100 - dist) / 100 * 0.15;
                        ctx.strokeStyle = `rgba(157, 78, 221, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }

    // ---------------------------------------------------------
    // 3. INTRO VIDEO STUDIO - DECKS & WEB-CAM CONTROLLER
    // ---------------------------------------------------------
    const deckTabs = document.querySelectorAll('.deck-tab');
    const mediaLayers = document.querySelectorAll('.media-layer');
    const actionSubgroups = document.querySelectorAll('.action-subgroup');
    const cameraStatusText = document.getElementById('camera-status');

    // Camera recorder elements
    const btnEnableCamera = document.getElementById('btn-enable-camera');
    const cameraPrompt = document.getElementById('camera-prompt');
    const webcamPreview = document.getElementById('webcam-preview');
    const webcamPlayback = document.getElementById('webcam-playback');
    const btnStartRecord = document.getElementById('btn-start-record');
    const btnStopRecord = document.getElementById('btn-stop-record');
    const btnRetake = document.getElementById('btn-retake');
    const recIndicator = document.getElementById('rec-indicator');
    const recTimer = document.getElementById('rec-timer');

    let stream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordTimerInterval = null;
    let secondsRecorded = 0;

    // Deck switching logic
    deckTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetLayerId = tab.getAttribute('data-target');

            // Switch tabs
            deckTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch viewports
            mediaLayers.forEach(l => l.classList.remove('active'));
            const activeLayer = document.getElementById(targetLayerId);
            if (activeLayer) activeLayer.classList.add('active');

            // Switch control actions
            actionSubgroups.forEach(ag => ag.classList.remove('active'));
            const controlId = targetLayerId.replace('-view', '-controls');
            const activeControls = document.getElementById(controlId);
            if (activeControls) activeControls.classList.add('active');

            // Handle Camera release if leaving Camera tab
            if (targetLayerId !== 'camera-view' && stream) {
                stopCameraStream();
            }

            // Handle Simulated animation play if returning to Simulated tab
            if (targetLayerId === 'simulated-view') {
                cameraStatusText.textContent = "STANDBY";
            } else if (targetLayerId === 'camera-view') {
                cameraStatusText.textContent = stream ? "LIVE" : "WAITING";
            } else {
                cameraStatusText.textContent = "READY";
            }
        });
    });

    // Stop Camera Stream Utility
    const stopCameraStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            if (webcamPreview) webcamPreview.srcObject = null;
            cameraStatusText.textContent = "STANDBY";
            toggleCameraUI(false);
        }
    };

    // Toggle Recorder controls states
    const toggleCameraUI = (isLive) => {
        if (isLive) {
            cameraPrompt.style.display = 'none';
            webcamPreview.classList.remove('hidden');
            btnStartRecord.classList.remove('hidden');
            btnStopRecord.classList.add('hidden');
            btnRetake.classList.add('hidden');
        } else {
            cameraPrompt.style.display = 'flex';
            webcamPreview.classList.add('hidden');
            btnStartRecord.classList.add('hidden');
            btnStopRecord.classList.add('hidden');
            btnRetake.classList.add('hidden');
        }
    };

    // Camera access request
    if (btnEnableCamera) {
        btnEnableCamera.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: "user" },
                    audio: true
                });

                if (webcamPreview) {
                    webcamPreview.srcObject = stream;
                    webcamPreview.muted = true;
                }

                cameraStatusText.textContent = "LIVE";
                toggleCameraUI(true);
                webcamPlayback.classList.add('hidden');
            } catch (err) {
                console.error("Camera access failed:", err);
                alert("Could not access webcam. Please check browser permissions.");
            }
        });
    }

    // Start Recording
    if (btnStartRecord) {
        btnStartRecord.addEventListener('click', () => {
            if (!stream) return;

            recordedChunks = [];
            let options = { mimeType: 'video/webm;codecs=vp9,opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm;codecs=vp8,opus' };
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm' };
            }

            try {
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                mediaRecorder = new MediaRecorder(stream);
            }

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const videoURL = URL.createObjectURL(blob);

                webcamPreview.classList.add('hidden');
                webcamPlayback.src = videoURL;
                webcamPlayback.classList.remove('hidden');

                btnStopRecord.classList.add('hidden');
                btnRetake.classList.remove('hidden');
                cameraStatusText.textContent = "PREVIEW";
            };

            // Start Recorder
            mediaRecorder.start();
            cameraStatusText.textContent = "RECORDING";

            // UI stopwatch trigger
            secondsRecorded = 0;
            recTimer.textContent = "00:00";
            recIndicator.classList.remove('hidden');
            btnStartRecord.classList.add('hidden');
            btnStopRecord.classList.remove('hidden');

            recordTimerInterval = setInterval(() => {
                secondsRecorded++;
                let mins = Math.floor(secondsRecorded / 60).toString().padStart(2, '0');
                let secs = (secondsRecorded % 60).toString().padStart(2, '0');
                recTimer.textContent = `${mins}:${secs}`;
            }, 1000);
        });
    }

    // Stop Recording
    if (btnStopRecord) {
        btnStopRecord.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            clearInterval(recordTimerInterval);
            recIndicator.classList.add('hidden');
        });
    }

    // Retake Recording
    if (btnRetake) {
        btnRetake.addEventListener('click', () => {
            webcamPlayback.classList.add('hidden');
            webcamPlayback.src = "";
            webcamPreview.classList.remove('hidden');
            btnRetake.classList.add('hidden');
            btnStartRecord.classList.remove('hidden');
            cameraStatusText.textContent = "LIVE";
        });
    }


    // ---------------------------------------------------------
    // 4. INTRO VIDEO STUDIO - DRAG & DROP LOCAL VIDEO UPLOADER
    // ---------------------------------------------------------
    const uploadDropzone = document.getElementById('upload-dropzone');
    const videoFileInput = document.getElementById('video-file-input');
    const uploadedPlayback = document.getElementById('uploaded-playback');
    const btnTriggerUpload = document.getElementById('btn-trigger-upload');

    if (uploadDropzone && videoFileInput && uploadedPlayback) {

        const loadLocalVideo = (file) => {
            if (!file.type.startsWith('video/')) {
                alert("Unsupported file format! Please upload a valid video sequence.");
                return;
            }
            const fileURL = URL.createObjectURL(file);
            uploadedPlayback.src = fileURL;
            uploadDropzone.classList.add('hidden');
            uploadedPlayback.style.display = 'block';
            uploadedPlayback.play();
            cameraStatusText.textContent = "PLAYING_FILE";
        };

        btnTriggerUpload.addEventListener('click', () => {
            videoFileInput.click();
        });

        videoFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                loadLocalVideo(e.target.files[0]);
            }
        });

        // Drag/Drop Listeners
        uploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropzone.classList.add('dragover');
        });

        uploadDropzone.addEventListener('dragleave', () => {
            uploadDropzone.classList.remove('dragover');
        });

        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                loadLocalVideo(e.dataTransfer.files[0]);
            }
        });
    }


    // ---------------------------------------------------------
    // 5. SIMULATED CORE INTERACTIVE AUDIO-WAVES & TYPEWRITING
    // ---------------------------------------------------------
    const voiceCanvas = document.getElementById('voice-waves');
    const playSimBtn = document.getElementById('play-simulated-btn');
    const terminalFeed = document.getElementById('terminal-feed');
    const btnReplaySim = document.getElementById('btn-replay-sim');

    let waveAnimFrame = null;
    let waveOffset = 0;
    let isWaveActive = false;

    // Canvas Waves Draw Utility
    const drawVoiceWaves = () => {
        if (!voiceCanvas) return;
        const wCtx = voiceCanvas.getContext('2d');
        voiceCanvas.width = voiceCanvas.parentElement.clientWidth;
        voiceCanvas.height = 100;

        wCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);

        if (!isWaveActive) {
            // Draw a flat baseline with some micro noise
            wCtx.beginPath();
            wCtx.moveTo(0, 50);
            for (let i = 0; i < voiceCanvas.width; i++) {
                wCtx.lineTo(i, 50 + Math.sin(i * 0.05) * 1.5);
            }
            wCtx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
            wCtx.lineWidth = 2;
            wCtx.stroke();
            waveAnimFrame = requestAnimationFrame(drawVoiceWaves);
            return;
        }

        // Draw multiple beautiful color overlapping sine waves
        const drawWave = (color, amplitude, speed, widthRatio) => {
            wCtx.beginPath();
            wCtx.moveTo(0, 50);
            for (let x = 0; x < voiceCanvas.width; x++) {
                let y = 50 + Math.sin(x * widthRatio + waveOffset * speed) * amplitude * Math.sin(x * 0.0035 * Math.PI);
                wCtx.lineTo(x, y);
            }
            wCtx.strokeStyle = color;
            wCtx.lineWidth = 1.5;
            wCtx.stroke();
        };

        drawWave('rgba(157, 78, 221, 0.65)', 25, 0.06, 0.015);
        drawWave('rgba(0, 242, 254, 0.55)', 18, -0.04, 0.025);
        drawWave('rgba(5, 243, 162, 0.45)', 12, 0.08, 0.035);

        waveOffset++;
        waveAnimFrame = requestAnimationFrame(drawVoiceWaves);
    };

    if (voiceCanvas) {
        drawVoiceWaves();
    }

    const typeTerminalFeed = () => {
        if (!terminalFeed) return;
        terminalFeed.innerHTML = "";

        const lines = [
            "> Initialize core sequences...",
            "> Loading profile: PPNS_SRINIVAS_3RD_YEAR",
            "> Institution: NRI_INST_OF_TECH",
            "> Dept: CSE_ENG_SYSTEMS",
            "> Tech stacks analyzed: MERN_CORE",
            "> Loading virtual digital speech...",
            "> Hi, I am Palnati Srinivas.",
            "> Ready to design code engines."
        ];

        let lineIdx = 0;
        const addLine = () => {
            if (lineIdx < lines.length) {
                const p = document.createElement('p');
                p.textContent = lines[lineIdx];
                terminalFeed.appendChild(p);
                lineIdx++;
                setTimeout(addLine, 650);
            }
        };
        addLine();
    };

    const triggerSimulatedIntro = () => {
        if (playSimBtn) playSimBtn.style.display = 'none';
        isWaveActive = true;
        typeTerminalFeed();

        // Simulate voice greeting end in 5 seconds
        setTimeout(() => {
            isWaveActive = false;
        }, 5500);
    };

    if (playSimBtn) {
        playSimBtn.addEventListener('click', triggerSimulatedIntro);
    }

    if (btnReplaySim) {
        btnReplaySim.addEventListener('click', () => {
            isWaveActive = false;
            cancelAnimationFrame(waveAnimFrame);
            if (playSimBtn) playSimBtn.style.display = 'flex';
            drawVoiceWaves();
            if (terminalFeed) {
                terminalFeed.innerHTML = "<p>&gt; Re-initialising terminal diagnostic sequence...</p>";
            }
        });
    }


    // ---------------------------------------------------------
    // 6. DEVELOPER DNA PANELS - TABS & TYPEWRITING CODE
    // ---------------------------------------------------------
    const dnaTabs = document.querySelectorAll('.dna-tab');
    const dnaPanes = document.querySelectorAll('.dna-tab-pane');
    const codeTypewriter = document.getElementById('live-code-typewriter');
    let hasTypedCode = false;

    dnaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Set active states
            dnaTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            dnaPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${targetTab}`) {
                    pane.classList.add('active');

                    // Trigger custom animation triggers
                    if (targetTab === 'focus') {
                        // Reset and animate focus bars
                        const bars = pane.querySelectorAll('.pillar-bar');
                        bars.forEach(bar => {
                            const widthVal = bar.style.width;
                            bar.style.width = '0';
                            setTimeout(() => { bar.style.width = widthVal; }, 50);
                        });
                    } else if (targetTab === 'stream' && !hasTypedCode) {
                        typewriterSequence();
                    }
                }
            });
        });
    });

    const typewriterSequence = () => {
        if (!codeTypewriter) return;
        hasTypedCode = true;
        const codeText = codeTypewriter.textContent;
        codeTypewriter.textContent = "";

        let charIdx = 0;
        const typeChar = () => {
            if (charIdx < codeText.length) {
                codeTypewriter.textContent += codeText[charIdx];
                charIdx++;
                setTimeout(typeChar, 12);
            }
        };
        typeChar();
    };


    // ---------------------------------------------------------
    // 7. INTERSECTION OBSERVER ANIMATION SLIDES
    // ---------------------------------------------------------
    const animObserverOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If it is the focus pillars pane, run bar transition immediately
                if (entry.target.id === 'pane-focus') {
                    const bars = entry.target.querySelectorAll('.pillar-bar');
                    bars.forEach(bar => {
                        const w = bar.getAttribute('style');
                        bar.setAttribute('style', 'width: 0;');
                        setTimeout(() => { bar.setAttribute('style', w); }, 150);
                    });
                }
            }
        });
    }, animObserverOptions);

    // Dynamic classes setup
    const elementsToAnimate = document.querySelectorAll(
        '.glass-panel, .project-glass-card, .stat-glass-card, .timeline-node, .info-glass-row, .contact-form-panel'
    );

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';

        // CSS trigger addition on viewport intersect
        animObserver.observe(el);
    });

    // Dynamic inject rule support for IntersectionObserver
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // ---------------------------------------------------------
    // 8. ACTIVE NAVIGATION LINK ON VIEWPORT SCROLL
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 180) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ---------------------------------------------------------
    // 9. FORM TRANSIT SECURE CONTROLLER (API CONTEXT)
    // ---------------------------------------------------------
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;

            // Trigger load visual states
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="loading-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M22 12a10 10 0 0 1-10 10"></path></svg>
                Transmitting Data Stream...
            `;

            const formData = {
                name: document.getElementById('form-name').value,
                email: document.getElementById('form-email').value,
                subject: document.getElementById('form-subject').value,
                message: document.getElementById('form-message').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Data transmission complete! Thank you, Srinivas will receive this shortly.');
                    contactForm.reset();
                } else {
                    alert(`Local API stored message. (Message: ${result.message})`);
                    contactForm.reset();
                }
            } catch (err) {
                // Fallback simulation if offline
                console.log('Secure direct offline fallbacks activated:', formData);
                alert('Secure message stored inside sandbox local simulation successfully!');
                contactForm.reset();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
        });
    }

    // Dynamic copyright year loader
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Add extra inline visual styles support
    const injectFormStyles = document.createElement("style");
    injectFormStyles.innerText = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .red-pulse {
            animation: beaconPulse 1s infinite;
        }
        .hud-rec-indicator .red-pulse {
            width: 7px;
            height: 7px;
            background-color: var(--error);
            border-radius: 50%;
            display: inline-block;
        }
    `;
    document.head.appendChild(injectFormStyles);

    console.log('Palnati Srinivas premium portfolio loaded successfully!');
});