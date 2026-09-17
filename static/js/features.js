/* =========================================================
   FINEXA FEATURES — PART 1 JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuButton = document.getElementById("mobileMenuButton");
    const mobileNavigation =
        document.getElementById("mobileNavigation");

    if (menuButton && mobileNavigation) {

        menuButton.addEventListener("click", () => {

            mobileNavigation.classList.toggle("open");

            menuButton.classList.toggle("active");

        });

        /* Close menu after clicking a link */

        const mobileLinks =
            mobileNavigation.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileNavigation.classList.remove("open");

                menuButton.classList.remove("active");

            });

        });

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar =
        document.querySelector(".features-navbar");

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const currentScroll = window.scrollY;

        if (!navbar) return;

        if (currentScroll > 40) {

            navbar.classList.add("navbar-scrolled");

        } else {

            navbar.classList.remove("navbar-scrolled");

        }

        lastScroll = currentScroll;

    }, { passive: true });


    /* =====================================================
       3D PLATFORM MOUSE MOVEMENT
    ===================================================== */

    const visual =
        document.querySelector(".hero-visual");

    const platform =
        document.querySelector(".data-platform");

    if (visual && platform) {

        visual.addEventListener("mousemove", (event) => {

            const rect =
                visual.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateY =
                ((x - centerX) / centerX) * 5;

            const rotateX =
                ((centerY - y) / centerY) * 5;

            platform.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });


        visual.addEventListener("mouseleave", () => {

            platform.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        });

    }


    /* =====================================================
       FLOATING PARTICLE INTERACTION
    ===================================================== */

    const particles =
        document.querySelectorAll(".data-particle");

    if (visual && particles.length) {

        visual.addEventListener("mousemove", (event) => {

            const rect =
                visual.getBoundingClientRect();

            const mouseX =
                (event.clientX - rect.left) / rect.width - 0.5;

            const mouseY =
                (event.clientY - rect.top) / rect.height - 0.5;

            particles.forEach((particle, index) => {

                const strength =
                    8 + (index * 1.5);

                const moveX =
                    mouseX * strength;

                const moveY =
                    mouseY * strength;

                particle.style.marginLeft =
                    `${moveX}px`;

                particle.style.marginTop =
                    `${moveY}px`;

            });

        });

        visual.addEventListener("mouseleave", () => {

            particles.forEach(particle => {
            particle.style.marginLeft = "0px";
                particle.style.marginTop = "0px";

            });

        });

    }


    /* =====================================================
       CHART BAR HOVER
    ===================================================== */

    const chartBars =
        document.querySelectorAll(".floating-chart span");

    chartBars.forEach(bar => {

        bar.addEventListener("mouseenter", () => {

            bar.style.filter =
                "brightness(1.35)";

            bar.style.transform =
                "scaleY(1.08)";

        });

        bar.addEventListener("mouseleave", () => {

            bar.style.filter = "";

            bar.style.transform = "";

        });

    });


    /* =====================================================
       BUTTON MAGNETIC EFFECT
    ===================================================== */

    const primaryButton =
        document.querySelector(".hero-primary-button");

    if (primaryButton) {

        primaryButton.addEventListener("mousemove", (event) => {

            const rect =
                primaryButton.getBoundingClientRect();

            const x =
                event.clientX - rect.left - rect.width / 2;

            const y =
                event.clientY - rect.top - rect.height / 2;

            primaryButton.style.transform =
                `translate(${x * 0.04}px, ${y * 0.04}px)`;

        });

        primaryButton.addEventListener("mouseleave", () => {

            primaryButton.style.transform =
                "translate(0, 0)";

        });

    }


    /* =====================================================
       INTERSECTION REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".hero-content > *, .hero-visual, .hero-bottom-message"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            element.classList.add(
                "reveal-element"
            );

            observer.observe(element);

        });

    }


    /* =====================================================
       PREVENT 3D EFFECT ON TOUCH DEVICES
    ===================================================== */

    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    if (isTouchDevice && visual && platform) {

        platform.style.transform =
            "rotateX(0deg) rotateY(0deg)";

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPath =
        window.location.pathname;

    document
        .querySelectorAll(".features-nav .nav-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (href === currentPath) {

                link.classList.add("active");

            }

        });


    /* =====================================================
       CONSOLE STATUS
    ===================================================== */

    console.log(
        "FINEXA Features — Part 1 initialized successfully."
    );

});
document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuButton =
        document.getElementById("mobileMenuButton");

    const mobileNavigation =
        document.getElementById("mobileNavigation");

    if (menuButton && mobileNavigation) {

        menuButton.addEventListener("click", () => {

            mobileNavigation.classList.toggle("open");
            menuButton.classList.toggle("active");

        });

        mobileNavigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    mobileNavigation.classList.remove("open");
                    menuButton.classList.remove("active");

                });

            });
    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar =
        document.querySelector(".features-navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }

    }, { passive: true });


    /* =====================================================
       3D HERO PLATFORM
    ===================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");

    const platform =
        document.querySelector(".data-platform");

    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    if (
        heroVisual &&
        platform &&
        !isTouchDevice
    ) {

        heroVisual.addEventListener("mousemove", event => {

            const rect =
                heroVisual.getBoundingClientRect();

            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateY =
                ((mouseX - centerX) / centerX) * 5;

            const rotateX =
                ((centerY - mouseY) / centerY) * 5;

            platform.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });

        heroVisual.addEventListener("mouseleave", () => {

            platform.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        });

    }


    /* =====================================================
       HERO PARTICLES
    ===================================================== */

    const particles =
        document.querySelectorAll(".data-particle");

    if (heroVisual && particles.length && !isTouchDevice) {

        heroVisual.addEventListener("mousemove", event => {

            const rect =
                heroVisual.getBoundingClientRect();

            const mouseX =
                (event.clientX - rect.left) /
                rect.width - 0.5;

            const mouseY =
                (event.clientY - rect.top) /
                rect.height - 0.5;

            particles.forEach((particle, index) => {

                const strength =
                    8 + index * 1.5;

                particle.style.marginLeft =
                    `${mouseX * strength}px`;

                particle.style.marginTop =
                    `${mouseY * strength}px`;

            });

        });

        heroVisual.addEventListener("mouseleave", () => {

            particles.forEach(particle => {

                particle.style.marginLeft = "0px";
                particle.style.marginTop = "0px";

            });

        });

    }


    /* =====================================================
       FLOATING CHART HOVER
    ===================================================== */
    document
        .querySelectorAll(".floating-chart span")
        .forEach(bar => {

            bar.addEventListener("mouseenter", () => {

                bar.style.filter =
                    "brightness(1.35)";

            });

            bar.addEventListener("mouseleave", () => {

                bar.style.filter = "";

            });

        });


    /* =====================================================
       HERO BUTTON MAGNETIC EFFECT
    ===================================================== */

    const primaryButton =
        document.querySelector(".hero-primary-button");

    if (primaryButton && !isTouchDevice) {

        primaryButton.addEventListener("mousemove", event => {

            const rect =
                primaryButton.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            primaryButton.style.transform =
                `translate(${x * 0.04}px, ${y * 0.04}px)`;

        });

        primaryButton.addEventListener("mouseleave", () => {

            primaryButton.style.transform =
                "translate(0, 0)";

        });

    }


    /* =====================================================
       PART 2 — CARD REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal-section, .intelligence-card"
        );

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal-visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            element.classList.add(
                "reveal-element"
            );

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add(
                "reveal-visible"
            );

        });

    }


    /* =====================================================
       PART 2 — INTELLIGENCE CARD 3D TILT
    ===================================================== */

    const intelligenceCards =
        document.querySelectorAll(
            ".intelligence-card"
        );

    if (!isTouchDevice) {

        intelligenceCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateY =
                        ((x - centerX) /
                        centerX) * 2.2;

                    const rotateX =
                        ((centerY - y) /
                        centerY) * 2.2;

                    card.style.transform =`
                        
                        translateY(-8px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        `;

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";
                    }
            );

        });

    }


    /* =====================================================
       PART 2 — KPI ORBIT INTERACTION
    ===================================================== */

    const metricOrbit =
        document.querySelector(".metric-orbit");

    if (metricOrbit && !isTouchDevice) {

        metricOrbit.addEventListener(
            "mousemove",
            event => {

                const rect =
                    metricOrbit.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateY =
                    ((x / rect.width) - 0.5) * 18;

                const rotateX =
                    58 -
                    ((y / rect.height) - 0.5) * 12;

                metricOrbit.style.transform =`
                    
                    translateZ(55px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    `;

            }
        );

        metricOrbit.addEventListener(
            "mouseleave",
            () => {

                metricOrbit.style.transform =`
                    
                    translateZ(40px)
                    rotateX(58deg)
                    `;

            }
        );

    }


    /* =====================================================
       PART 2 — INSIGHT LINE HOVER
    ===================================================== */

    document
        .querySelectorAll(".insight-line")
        .forEach(line => {

            line.addEventListener(
                "mouseenter",
                () => {

                    line.style.transform =
                        "translateX(8px)";

                    line.style.borderColor =
                        "rgba(96,220,255,0.18)";

                }
            );

            line.addEventListener(
                "mouseleave",
                () => {

                    line.style.transform = "";

                    line.style.borderColor = "";

                }
            );

        });


    /* =====================================================
       PART 2 — AI MESSAGE INTERACTION
    ===================================================== */

    document
        .querySelectorAll(".ai-message")
        .forEach(message => {

            message.addEventListener(
                "mouseenter",
                () => {

                    message.style.borderColor =
                        "rgba(96,220,255,0.16)";

                }
            );

            message.addEventListener(
                "mouseleave",
                () => {

                    message.style.borderColor = "";

                }
            );

        });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPath =
        window.location.pathname;

    document
        .querySelectorAll(".features-nav .nav-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (href === currentPath) {

                link.classList.add("active");

            }

        });


    /* =====================================================
       PERFORMANCE SAFETY
    ===================================================== */

    document
        .querySelectorAll(
            ".intelligence-card, .hero-visual"
        )
        .forEach(element => {

            element.style.willChange =
                "transform";

        });


    /* =====================================================
       STATUS
    ===================================================== */

    console.log(
        "FINEXA Features — Parts 1 & 2 initialized."
    );

});
/* =========================================================
   PART 3 — ANALYTICS UNIVERSE JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ANALYTICS UNIVERSE 3D MOVEMENT
    ===================================================== */

    const universe = document.querySelector(
        ".analytics-universe"
    );

    if (universe) {

        let universeFrame = null;

        universe.addEventListener("mousemove", (event) => {

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            if (window.innerWidth <= 700) {
                return;
            }

            const rect = universe.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width;

            const y =
                (event.clientY - rect.top) /
                rect.height;

            const rotateY = (x - 0.5) * 10;
            const rotateX = (0.5 - y) * 8;

            if (universeFrame) {
                cancelAnimationFrame(universeFrame);
            }

            universeFrame = requestAnimationFrame(() => {

                universe.style.transform =
                    `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });

        });


        universe.addEventListener("mouseleave", () => {

            if (universeFrame) {
                cancelAnimationFrame(universeFrame);
            }

            universe.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        });

    }


    /* =====================================================
       ANALYTICS NODES
    ===================================================== */

    const analyticsNodes =
        document.querySelectorAll(
            ".analytics-node"
        );

    analyticsNodes.forEach((node) => {

        node.addEventListener("mouseenter", () => {

            if (window.innerWidth <= 700) {
                return;
            }

            analyticsNodes.forEach((otherNode) => {

                if (otherNode !== node) {
                    otherNode.style.opacity = "0.55";
                    otherNode.style.filter =
                        "blur(0.5px)";
                }

            });

            node.style.opacity = "1";
            node.style.filter = "none";

        });


        node.addEventListener("mouseleave", () => {

            analyticsNodes.forEach((otherNode) => {

                otherNode.style.opacity = "";
                otherNode.style.filter = "";

            });

        });

    });


    /* =====================================================
       NODE POINTER TILT
    ===================================================== */

    analyticsNodes.forEach((node) => {

        node.addEventListener("mousemove", (event) => {

            if (
                window.innerWidth <= 700 ||
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            const rect =
                node.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width;

            const y =
                (event.clientY - rect.top) /
                rect.height;

            const rotateX =
                (0.5 - y) * 8;

            const rotateY =
                (x - 0.5) * 10;

            node.style.transform =
                `translateZ(45px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });


        node.addEventListener("mouseleave", () => {

            node.style.transform = "";

        });

    });


    /* =====================================================
       UNIVERSE PARTICLES PARALLAX
    ===================================================== */
    const universeParticles =
        document.querySelectorAll(
            ".universe-particle"
        );

    if (universe && universeParticles.length) {

        universe.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.innerWidth <= 700 ||
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    universe.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                universeParticles.forEach(
                    (particle, index) => {

                        const depth =
                            (index + 1) * 3;

                        particle.style.marginLeft =
                            `${x * depth}px`;

                        particle.style.marginTop =
                            `${y * depth}px`;

                    }
                );

            }
        );


        universe.addEventListener(
            "mouseleave",
            () => {

                universeParticles.forEach(
                    (particle) => {

                        particle.style.marginLeft =
                            "";

                        particle.style.marginTop =
                            "";

                    }
                );

            }
        );

    }


    /* =====================================================
       SHOWCASE CARD 3D TILT
    ===================================================== */

    const showcaseCards =
        document.querySelectorAll(
            ".showcase-card"
        );

    showcaseCards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.innerWidth <= 700 ||
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const rotateX =
                    (0.5 - y) * 7;

                const rotateY =
                    (x - 0.5) * 9;

                card.style.transform =
                    `translateY(-10px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });


    /* =====================================================
       SHOWCASE CARD GLOW TRACKING
    ===================================================== */

    showcaseCards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth <= 700) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    });
    /* =====================================================
       CHART ANIMATION OBSERVER
    ===================================================== */

    const chartElements =
        document.querySelectorAll(
            ".showcase-line-chart, .showcase-bars, .showcase-distribution"
        );

    if (
        "IntersectionObserver" in window &&
        chartElements.length
    ) {

        const chartObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "chart-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.25
                }
            );

        chartElements.forEach((chart) => {

            chartObserver.observe(chart);

        });

    }


    /* =====================================================
       UNIVERSE REVEAL
    ===================================================== */

    const universeRevealElements =
        document.querySelectorAll(
            ".analytics-universe-section .reveal-section"
        );

    if (
        "IntersectionObserver" in window &&
        universeRevealElements.length
    ) {

        const universeRevealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -60px 0px"
                }
            );

        universeRevealElements.forEach(
            (element) => {

                universeRevealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       ANALYTICS NODE CLICK RESPONSE
    ===================================================== */

    analyticsNodes.forEach((node) => {

        node.addEventListener("click", () => {

            analyticsNodes.forEach(
                (item) => {
                    item.classList.remove(
                        "node-selected"
                    );
                }
            );

            node.classList.add(
                "node-selected"
            );

        });

    });


    /* =====================================================
       ESCAPE / RESET INTERACTION
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            analyticsNodes.forEach(
                (node) => {

                    node.classList.remove(
                        "node-selected"
                    );

                    node.style.transform = "";
                    node.style.opacity = "";
                    node.style.filter = "";

                }
            );

            showcaseCards.forEach(
                (card) => {

                    card.style.transform = "";

                }
            );

        }
    );


    /* =====================================================
       MOBILE SAFETY
    ===================================================== */

    function handleUniverseResponsive() {

        if (!universe) {
            return;
        }
        if (window.innerWidth <= 700) {

            universe.style.transform =
                "rotateX(0deg) rotateY(0deg)";

            analyticsNodes.forEach(
                (node) => {

                    node.style.transform = "";
                    node.style.opacity = "";
                    node.style.filter = "";

                }
            );

            showcaseCards.forEach(
                (card) => {

                    card.style.transform = "";

                }
            );

        }

    }

    window.addEventListener(
        "resize",
        handleUniverseResponsive
    );


    /* =====================================================
       PERFORMANCE SAFETY
    ===================================================== */

    let lastScrollTime = 0;

    window.addEventListener(
        "scroll",
        () => {

            const now =
                performance.now();

            if (
                now - lastScrollTime <
                16
            ) {
                return;
            }

            lastScrollTime = now;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       PART 3 STATUS
    ===================================================== */

    console.log(
        "FINEXA Features — Parts 1, 2 & 3 initialized."
    );

});
/* =========================================================
   PART 4 — FINANCIAL INTELLIGENCE LAB JS
========================================================= */

/* ---------------------------------------------------------
   FINANCIAL LAB 3D MOVEMENT
--------------------------------------------------------- */

const financialLab = document.querySelector(".financial-lab");

if (financialLab && !window.matchMedia("(max-width: 768px)").matches) {

    financialLab.addEventListener("mousemove", (event) => {

        const rect = financialLab.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;

        const dataPanel =
            financialLab.querySelector(".lab-data-panel");

        const insightPanel =
            financialLab.querySelector(".lab-insight-panel");

        const intelligenceCore =
            financialLab.querySelector(".lab-intelligence-core");

        if (dataPanel) {
            dataPanel.style.transform =`
                perspective(1000px)
                 rotateY(${x * -4}deg)
                 rotateX(${y * 3}deg)
                 translateZ(8px)`;
        }

        if (insightPanel) {
            insightPanel.style.transform =`
                perspective(1000px)
                 rotateY(${x * 4}deg)
                 rotateX(${y * 3}deg)
                 translateZ(8px)`;
        }

        if (intelligenceCore) {
            intelligenceCore.style.transform =
                `translate3d(${x * 12}px, ${y * 12}px, 20px)`;
        }
    });

    financialLab.addEventListener("mouseleave", () => {

        const dataPanel =
            financialLab.querySelector(".lab-data-panel");

        const insightPanel =
            financialLab.querySelector(".lab-insight-panel");

        const intelligenceCore =
            financialLab.querySelector(".lab-intelligence-core");

        if (dataPanel) {
            dataPanel.style.transform = "";
        }

        if (insightPanel) {
            insightPanel.style.transform = "";
        }

        if (intelligenceCore) {
            intelligenceCore.style.transform = "";
        }
    });
}


/* ---------------------------------------------------------
   DATA ROW INTERACTION
--------------------------------------------------------- */

const labDataRows =
    document.querySelectorAll(".lab-data-row");

labDataRows.forEach((row, index) => {

    row.addEventListener("mouseenter", () => {

        labDataRows.forEach((otherRow) => {
            otherRow.classList.remove("active-row");
        });

        row.classList.add("active-row");

        const core =
            document.querySelector(".lab-intelligence-core");

        if (core) {
            core.classList.add("core-processing");
        }
    });

    row.addEventListener("mouseleave", () => {

        row.classList.remove("active-row");

        const core =
            document.querySelector(".lab-intelligence-core");

        if (core) {
            core.classList.remove("core-processing");
        }
    });

    row.style.transitionDelay =
        `${index * 0.04}s`;
});


/* ---------------------------------------------------------
   DATA STREAM SCAN EFFECT
--------------------------------------------------------- */

const dataPanel =
    document.querySelector(".lab-data-panel");

if (dataPanel) {

    let scanTimer;

    const startDataScan = () => {

        const rows =
            dataPanel.querySelectorAll(".lab-data-row");

        let current = 0;

        clearInterval(scanTimer);

        scanTimer = setInterval(() => {

            rows.forEach((row) => {
                row.classList.remove("scan-active");
            });

            if (rows[current]) {
                rows[current].classList.add("scan-active");
            }

            current++;

            if (current >= rows.length) {
                current = 0;
            }

        }, 1800);
    };

    startDataScan();
    dataPanel.addEventListener(
        "mouseenter",
        () => clearInterval(scanTimer)
    );

    dataPanel.addEventListener(
        "mouseleave",
        startDataScan
    );
}


/* ---------------------------------------------------------
   INTELLIGENCE CORE INTERACTION
--------------------------------------------------------- */

const labCore =
    document.querySelector(".lab-core");

if (labCore) {

    labCore.addEventListener("mouseenter", () => {
        labCore.classList.add("core-active");
    });

    labCore.addEventListener("mouseleave", () => {
        labCore.classList.remove("core-active");
    });

    labCore.addEventListener("click", () => {

        labCore.classList.toggle("core-focused");

        const status =
            labCore.querySelector(".lab-core-status");

        if (status) {

            if (labCore.classList.contains("core-focused")) {
                status.textContent = "PROCESSING";
            } else {
                status.textContent = "ANALYZING";
            }
        }
    });
}


/* ---------------------------------------------------------
   BUSINESS SIGNAL CARDS
--------------------------------------------------------- */

const signalCards =
    document.querySelectorAll(".lab-signal-card");

signalCards.forEach((card, index) => {

    card.addEventListener("mouseenter", () => {

        signalCards.forEach((otherCard) => {
            otherCard.classList.remove("signal-active");
        });

        card.classList.add("signal-active");

        const core =
            document.querySelector(".lab-intelligence-core");

        if (core) {
            core.classList.add("signal-processing");
        }
    });

    card.addEventListener("mouseleave", () => {

        card.classList.remove("signal-active");

        const core =
            document.querySelector(".lab-intelligence-core");

        if (core) {
            core.classList.remove("signal-processing");
        }
    });

    card.style.transitionDelay =
        `${index * 0.05}s`;
});


/* ---------------------------------------------------------
   PIPELINE STEPS
--------------------------------------------------------- */

const pipelineSteps =
    document.querySelectorAll(".pipeline-step");

pipelineSteps.forEach((step, index) => {

    step.addEventListener("mouseenter", () => {

        pipelineSteps.forEach((otherStep) => {
            otherStep.classList.remove("pipeline-active");
        });

        step.classList.add("pipeline-active");

        pipelineSteps.forEach((otherStep, otherIndex) => {

            if (otherIndex < index) {
                otherStep.classList.add("pipeline-completed");
            } else {
                otherStep.classList.remove("pipeline-completed");
            }

        });
    });

    step.addEventListener("mouseleave", () => {

        step.classList.remove("pipeline-active");

        pipelineSteps.forEach((otherStep) => {
            otherStep.classList.remove("pipeline-completed");
        });
    });
});


/* ---------------------------------------------------------
   AI WINDOW 3D TILT
--------------------------------------------------------- */

const aiWindow =
    document.querySelector(".lab-ai-window");

if (
    aiWindow &&
    !window.matchMedia("(max-width: 768px)").matches
) {

    aiWindow.addEventListener("mousemove", (event) => {

        const rect =
            aiWindow.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;

        aiWindow.style.transform =`
            perspective(1200px)
             rotateY(${x * 5}deg)
             rotateX(${y * -4}deg)
             translateZ(10px)`;
    });

    aiWindow.addEventListener("mouseleave", () => {

        aiWindow.style.transform = "";
    });
}


/* ---------------------------------------------------------
   AI MESSAGE INTERACTION
--------------------------------------------------------- */
const aiMessages =
    document.querySelectorAll(".ai-chat-message");

aiMessages.forEach((message, index) => {

    message.addEventListener("mouseenter", () => {
        message.classList.add("message-active");
    });

    message.addEventListener("mouseleave", () => {
        message.classList.remove("message-active");
    });

    message.style.animationDelay =
        `${index * -0.7}s`;
});


/* ---------------------------------------------------------
   AI INPUT BUTTON
--------------------------------------------------------- */

const aiInputButton =
    document.querySelector(".ai-window-input button");

if (aiInputButton) {

    aiInputButton.addEventListener("mouseenter", () => {
        aiInputButton.classList.add("input-active");
    });

    aiInputButton.addEventListener("mouseleave", () => {
        aiInputButton.classList.remove("input-active");
    });

    aiInputButton.addEventListener("click", () => {

        aiInputButton.classList.add("input-sent");

        setTimeout(() => {
            aiInputButton.classList.remove("input-sent");
        }, 600);
    });
}


/* ---------------------------------------------------------
   AI CAPABILITY HOVER
--------------------------------------------------------- */

const aiCapabilities =
    document.querySelectorAll(".ai-capability");

aiCapabilities.forEach((item) => {

    item.addEventListener("mouseenter", () => {
        item.classList.add("capability-active");
    });

    item.addEventListener("mouseleave", () => {
        item.classList.remove("capability-active");
    });
});


/* ---------------------------------------------------------
   FINANCIAL LAB REVEAL
--------------------------------------------------------- */

const labRevealElements =
    document.querySelectorAll(
        ".financial-lab-section .reveal-section"
    );

if ("IntersectionObserver" in window) {

    const labRevealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(entry.target);
                    }
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );

    labRevealElements.forEach((element) => {
        labRevealObserver.observe(element);
    });

} else {

    labRevealElements.forEach((element) => {
        element.classList.add("reveal-visible");
    });
}


/* ---------------------------------------------------------
   FINANCIAL LAB VISIBILITY STATE
--------------------------------------------------------- */

const financialLabSection =
    document.querySelector(".financial-lab-section");

if (
    financialLabSection &&
    "IntersectionObserver" in window
) {

    const labVisibilityObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        financialLabSection.classList.add(
                            "lab-visible"
                        );

                    } else {

                        financialLabSection.classList.remove(
                            "lab-visible"
                        );
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    labVisibilityObserver.observe(
        financialLabSection
    );
}


/* ---------------------------------------------------------
   MOBILE SAFETY
--------------------------------------------------------- */

if (window.matchMedia("(max-width: 768px)").matches) {

    const lab =
        document.querySelector(".financial-lab");

    if (lab) {
        lab.style.transform = "none";
    }

    if (aiWindow) {
        aiWindow.style.transform = "none";
    }
}
/* ---------------------------------------------------------
   PERFORMANCE SAFETY
--------------------------------------------------------- */

window.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            document
                .querySelectorAll(
                    ".lab-data-row, .ai-chat-message"
                )
                .forEach((element) => {
                    element.style.animationPlayState =
                        "paused";
                });

        } else {

            document
                .querySelectorAll(
                    ".lab-data-row, .ai-chat-message"
                )
                .forEach((element) => {
                    element.style.animationPlayState =
                        "running";
                });
        }
    }
);


/* ---------------------------------------------------------
   PART 4 STATUS
--------------------------------------------------------- */

console.log(
    "FINEXA Features — Parts 1, 2, 3 & 4 initialized."
);
/* =========================================================
   PART 5 — FINEXA FINAL EXPERIENCE JS
========================================================= */

/* ---------------------------------------------------------
   FINAL INTELLIGENCE 3D MOVEMENT
--------------------------------------------------------- */

const finalStage =
    document.querySelector(".final-intelligence-stage");

const finalCore =
    document.querySelector(".final-core");

const finalFloatingCards =
    document.querySelectorAll(".final-floating-card");

if (
    finalStage &&
    !window.matchMedia("(max-width: 768px)").matches
) {

    finalStage.addEventListener("mousemove", (event) => {

        const rect =
            finalStage.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
                rect.width -
            0.5;

        const y =
            (event.clientY - rect.top) /
                rect.height -
            0.5;

        if (finalCore) {

            finalCore.style.transform =`
                translate3d(
                    ${x * 18}px,
                    ${y * 18}px,
                    25px
                )`;
        }

        finalFloatingCards.forEach((card, index) => {

            const depth =
                1 + (index * 0.35);

            card.style.transform =`
                translate3d(
                    ${x * 12 * depth}px,
                    ${y * 10 * depth}px,
                    ${12 + index * 4}px
                )`;
        });
    });


    finalStage.addEventListener("mouseleave", () => {

        if (finalCore) {
            finalCore.style.transform = "";
        }

        finalFloatingCards.forEach((card) => {
            card.style.transform = "";
        });
    });
}


/* ---------------------------------------------------------
   FINAL CORE INTERACTION
--------------------------------------------------------- */

if (finalCore) {

    finalCore.addEventListener("mouseenter", () => {
        finalCore.classList.add("final-core-active");
    });

    finalCore.addEventListener("mouseleave", () => {
        finalCore.classList.remove("final-core-active");
    });

    finalCore.addEventListener("click", () => {

        finalCore.classList.toggle(
            "final-core-focused"
        );

        const status =
            finalCore.querySelector(
                ".final-core-inner small"
            );

        if (status) {

            if (
                finalCore.classList.contains(
                    "final-core-focused"
                )
            ) {

                status.textContent =
                    "INTELLIGENCE ACTIVE";

            } else {

                status.textContent =
                    "INTELLIGENT ANALYTICS";
            }
        }
    });
}


/* ---------------------------------------------------------
   FLOATING INTELLIGENCE CARDS
--------------------------------------------------------- */

finalFloatingCards.forEach((card, index) => {

    card.addEventListener("mouseenter", () => {

        finalFloatingCards.forEach((otherCard) => {

            otherCard.classList.remove(
                "floating-card-active"
            );
        });

        card.classList.add(
            "floating-card-active"
        );

        if (finalCore) {
            finalCore.classList.add(
                "core-card-connected"
            );
        }
    });


    card.addEventListener("mouseleave", () => {

        card.classList.remove(
            "floating-card-active"
        );

        if (finalCore) {
            finalCore.classList.remove(
                "core-card-connected"
            );
        }
    });


    card.style.animationDelay =
        `${index * -1.2}s`;
});


/* ---------------------------------------------------------
   FINAL CAPABILITY INTERACTION
--------------------------------------------------------- */

const finalCapabilities =
    document.querySelectorAll(
        ".final-capability"
    );

finalCapabilities.forEach((capability, index) => {
capability.addEventListener("mouseenter", () => {

        finalCapabilities.forEach((item) => {
            item.classList.remove(
                "capability-highlight"
            );
        });

        capability.classList.add(
            "capability-highlight"
        );

        const number =
            capability.querySelector(
                "span"
            );

        if (number) {
            number.textContent =
                String(index + 1).padStart(2, "0");
        }
    });


    capability.addEventListener("mouseleave", () => {

        capability.classList.remove(
            "capability-highlight"
        );
    });
});


/* ---------------------------------------------------------
   FINAL PRIMARY BUTTON
--------------------------------------------------------- */

const finalPrimaryButton =
    document.querySelector(
        ".final-primary-button"
    );

if (finalPrimaryButton) {

    finalPrimaryButton.addEventListener(
        "mouseenter",
        () => {

            finalPrimaryButton.classList.add(
                "final-button-active"
            );
        }
    );

    finalPrimaryButton.addEventListener(
        "mouseleave",
        () => {

            finalPrimaryButton.classList.remove(
                "final-button-active"
            );
        }
    );
}


/* ---------------------------------------------------------
   FINAL SECONDARY BUTTON
--------------------------------------------------------- */

const finalSecondaryButton =
    document.querySelector(
        ".final-secondary-button"
    );

if (finalSecondaryButton) {

    finalSecondaryButton.addEventListener(
        "mouseenter",
        () => {

            finalSecondaryButton.classList.add(
                "final-demo-active"
            );
        }
    );

    finalSecondaryButton.addEventListener(
        "mouseleave",
        () => {

            finalSecondaryButton.classList.remove(
                "final-demo-active"
            );
        }
    );
}


/* ---------------------------------------------------------
   BRANDING LOGO INTERACTION
--------------------------------------------------------- */

const brandingLogo =
    document.querySelector(
        ".branding-logo"
    );

if (brandingLogo) {

    brandingLogo.addEventListener(
        "mouseenter",
        () => {

            brandingLogo.classList.add(
                "branding-logo-active"
            );
        }
    );

    brandingLogo.addEventListener(
        "mouseleave",
        () => {

            brandingLogo.classList.remove(
                "branding-logo-active"
            );
        }
    );
}


/* ---------------------------------------------------------
   OWNER NAME REVEAL
--------------------------------------------------------- */

const ownerName =
    document.querySelector(
        ".branding-owner strong"
    );

if (ownerName) {

    ownerName.addEventListener(
        "mouseenter",
        () => {

            ownerName.classList.add(
                "owner-name-active"
            );
        }
    );

    ownerName.addEventListener(
        "mouseleave",
        () => {

            ownerName.classList.remove(
                "owner-name-active"
            );
        }
    );
}


/* ---------------------------------------------------------
   FINAL MESSAGE EFFECT
--------------------------------------------------------- */

const finalMessage =
    document.querySelector(
        ".finexa-final-message"
    );

if (finalMessage) {

    finalMessage.addEventListener(
        "mouseenter",
        () => {

            finalMessage.classList.add(
                "final-message-active"
            );
        }
    );

    finalMessage.addEventListener(
        "mouseleave",
        () => {

            finalMessage.classList.remove(
                "final-message-active"
            );
        }
    );
}


/* ---------------------------------------------------------
   FINAL SECTION REVEAL
--------------------------------------------------------- */
const finalRevealElements =
    document.querySelectorAll(
        ".finexa-final-section .reveal-section"
    );

if ("IntersectionObserver" in window) {

    const finalRevealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -50px 0px"
            }
        );

    finalRevealElements.forEach((element) => {
        finalRevealObserver.observe(element);
    });

} else {

    finalRevealElements.forEach((element) => {
        element.classList.add(
            "reveal-visible"
        );
    });
}


/* ---------------------------------------------------------
   FINAL SECTION ACTIVE STATE
--------------------------------------------------------- */

const finalSection =
    document.querySelector(
        ".finexa-final-section"
    );

if (
    finalSection &&
    "IntersectionObserver" in window
) {

    const finalSectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        finalSection.classList.add(
                            "final-section-active"
                        );

                    } else {

                        finalSection.classList.remove(
                            "final-section-active"
                        );
                    }
                });

            },
            {
                threshold: 0.15
            }
        );

    finalSectionObserver.observe(
        finalSection
    );
}


/* ---------------------------------------------------------
   MOBILE SAFETY
--------------------------------------------------------- */

if (
    window.matchMedia("(max-width: 768px)")
        .matches
) {

    if (finalCore) {
        finalCore.style.transform = "none";
    }

    finalFloatingCards.forEach((card) => {
        card.style.transform = "none";
    });
}


/* ---------------------------------------------------------
   REDUCED MOTION SAFETY
--------------------------------------------------------- */

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

if (reducedMotion.matches) {

    if (finalCore) {
        finalCore.style.animation = "none";
    }

    finalFloatingCards.forEach((card) => {
        card.style.animation = "none";
    });
}


/* ---------------------------------------------------------
   FINAL STATUS
--------------------------------------------------------- */

console.log(
    "FINEXA Features — Parts 1, 2, 3, 4 & 5 initialized."
);
