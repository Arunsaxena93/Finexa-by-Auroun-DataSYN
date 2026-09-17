document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const navbar = document.querySelector(".premium-navbar");
    const menuButton = document.querySelector(".premium-menu-button");
    const mobileMenu = document.querySelector(".premium-mobile-menu");

    const hero = document.querySelector(".premium-hero");
    const heroVisual = document.querySelector(".premium-hero-visual");

    const premiumSalesCard =
        document.querySelector(".premium-sales-card");

    const salesGlow =
        document.querySelector(".sales-card-glow");

    const salesCore =
        document.querySelector(".sales-core");

    const premiumCore =
        document.querySelector(".premium-core");

    const floatingCards =
        document.querySelectorAll(".premium-floating-card");

    const particles =
        document.querySelectorAll(".premium-particles span");

    const orbits =
        document.querySelectorAll(".premium-orbit");

    const salesRings =
        document.querySelectorAll(".sales-ring");

    const contactButton =
        document.querySelector(".premium-contact-button");

    const primaryButton =
        document.querySelector(".premium-primary-button");

    const secondaryButton =
        document.querySelector(".premium-secondary-button");

    const closingMessage =
        document.querySelector(".premium-part-one-closing");


    /* =========================================================
       DEVICE / MOTION SAFETY
    ========================================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const mobileDevice =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;

    const lowPowerDevice =
        navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency <= 4;


    /* =========================================================
       NAVBAR SCROLL
    ========================================================= */

    const handleNavbarScroll = () => {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    };

    window.addEventListener(
        "scroll",
        handleNavbarScroll,
        { passive: true }
    );

    handleNavbarScroll();


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                menuButton.classList.toggle("active");

            mobileMenu.classList.toggle(
                "active",
                isOpen
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });


        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                menuButton.classList.remove("active");

                mobileMenu.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });
    }


    /* =========================================================
       HERO 3D MOVEMENT
    ========================================================= */

    if (
        heroVisual &&
        !reducedMotion &&
        !mobileDevice &&
        !lowPowerDevice
    ) {

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let animationFrame = null;

        heroVisual.addEventListener(
            "mousemove",
            event => {
            const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                targetX =
                    (x - 0.5) * 2;

                targetY =
                    (y - 0.5) * 2;
            }
        );

        heroVisual.addEventListener(
            "mouseleave",
            () => {

                targetX = 0;
                targetY = 0;
            }
        );


        const animateHero = () => {

            currentX +=
                (targetX - currentX) * 0.055;

            currentY +=
                (targetY - currentY) * 0.055;


            if (premiumCore) {

                premiumCore.style.transform =
                    `translate3d(${currentX * 5}px, ${currentY * 5}px, 0)
                     rotateX(${currentY * -4}deg)
                     rotateY(${currentX * 5}deg)`;
            }


            floatingCards.forEach(
                (card, index) => {

                    const depth =
                        (index + 1) * 4;

                    const moveX =
                        currentX * depth;

                    const moveY =
                        currentY * depth;

                    card.style.marginLeft =
                        `${moveX}px`;

                    card.style.marginTop =
                        `${moveY}px`;
                }
            );


            animationFrame =
                requestAnimationFrame(
                    animateHero
                );
        };

        animateHero();


        window.addEventListener(
            "beforeunload",
            () => {

                if (animationFrame) {
                    cancelAnimationFrame(
                        animationFrame
                    );
                }
            }
        );
    }


    /* =========================================================
       FLOATING PARTICLES PARALLAX
    ========================================================= */

    if (
        heroVisual &&
        particles.length &&
        !reducedMotion &&
        !mobileDevice &&
        !lowPowerDevice
    ) {

        heroVisual.addEventListener(
            "mousemove",
            event => {

                const rect =
                    heroVisual.getBoundingClientRect();

                const mouseX =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const mouseY =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                particles.forEach(
                    (particle, index) => {

                        const depth =
                            3 + (index % 4);

                        const x =
                            mouseX * depth * 15;

                        const y =
                            mouseY * depth * 15;

                        particle.style.transform =
                            `translate(${x}px, ${y}px)`;
                    }
                );
            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                particles.forEach(
                    particle => {

                        particle.style.transform =
                            "translate(0, 0)";
                    }
                );
            }
        );
    }


    /* =========================================================
       SALES CARD 3D TILT
    ========================================================= */

    if (
        premiumSalesCard &&
        !reducedMotion &&
        !mobileDevice &&
        !lowPowerDevice
    ) {

        premiumSalesCard.addEventListener(
            "mousemove",
            event => {

                const rect =
                    premiumSalesCard.getBoundingClientRect();
                    const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    ((x - centerX) / centerX) * 4;

                const rotateX =
                    ((centerY - y) / centerY) * 4;


                premiumSalesCard.style.transform =`
                    perspective(1200px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)`;
            }
        );


        premiumSalesCard.addEventListener(
            "mouseleave",
            () => {

                premiumSalesCard.style.transform =
                    "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
            }
        );
    }


    /* =========================================================
       SALES CARD GLOW FOLLOW
    ========================================================= */

    if (
        premiumSalesCard &&
        salesGlow &&
        !reducedMotion &&
        !mobileDevice
    ) {

        premiumSalesCard.addEventListener(
            "mousemove",
            event => {

                const rect =
                    premiumSalesCard.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                salesGlow.style.left =
                    `${x}px`;

                salesGlow.style.top =
                    `${y - 150}px`;
            }
        );


        premiumSalesCard.addEventListener(
            "mouseleave",
            () => {

                salesGlow.style.left =
                    "50%";

                salesGlow.style.top =
                    "50%";
            }
        );
    }


    /* =========================================================
       SALES CORE INTERACTION
    ========================================================= */

    if (salesCore) {

        salesCore.addEventListener(
            "click",
            () => {

                salesCore.classList.toggle(
                    "core-active"
                );

                if (!reducedMotion) {

                    salesCore.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.12)"
                            },
                            {
                                transform:
                                    "scale(1.04)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 650,
                            easing:
                                "cubic-bezier(.2,.8,.2,1)"
                        }
                    );
                }
            }
        );
    }


    /* =========================================================
       ORBIT INTERACTION
    ========================================================= */

    orbits.forEach(
        (orbit, index) => {

            orbit.addEventListener(
                "mouseenter",
                () => {

                    if (reducedMotion) return;

                    orbit.style.animationPlayState =
                        "paused";

                    orbit.style.opacity =
                        "0.95";
                }
            );


            orbit.addEventListener(
                "mouseleave",
                () => {

                    orbit.style.animationPlayState =
                        "running";
                        orbit.style.opacity =
                        "";
                }
            );
        }
    );


    /* =========================================================
       SALES RING INTERACTION
    ========================================================= */

    salesRings.forEach(
        ring => {

            ring.addEventListener(
                "mouseenter",
                () => {

                    if (reducedMotion) return;

                    ring.style.animationPlayState =
                        "paused";

                    ring.style.borderColor =
                        "rgba(125, 220, 255, 0.35)";
                }
            );


            ring.addEventListener(
                "mouseleave",
                () => {

                    ring.style.animationPlayState =
                        "running";

                    ring.style.borderColor =
                        "";
                }
            );
        }
    );


    /* =========================================================
       BUTTON MICRO INTERACTION
    ========================================================= */

    const addButtonEffect = button => {

        if (!button || reducedMotion) return;

        button.addEventListener(
            "mouseenter",
            () => {

                button.style.transform =
                    "translateY(-4px) scale(1.02)";
            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "";
            }
        );
    };

    addButtonEffect(primaryButton);
    addButtonEffect(secondaryButton);
    addButtonEffect(contactButton);


    /* =========================================================
       CONTACT SALES
       IMPORTANT:
       href="/contact" remains untouched.
    ========================================================= */

    if (contactButton) {

        contactButton.addEventListener(
            "mouseenter",
            () => {

                contactButton.classList.add(
                    "contact-hover"
                );
            }
        );


        contactButton.addEventListener(
            "mouseleave",
            () => {

                contactButton.classList.remove(
                    "contact-hover"
                );
            }
        );
    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal-section"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "reveal-visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-visible"
                );
            }
        );
    }


    /* =========================================================
       CLOSING MESSAGE
    ========================================================= */

    if (
        closingMessage &&
        !reducedMotion
    ) {
    const closingObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                closingMessage.classList.add(
                                    "reveal-visible"
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.3
                }
            );


        closingObserver.observe(
            closingMessage
        );
    }


    /* =========================================================
       ESCAPE RESET
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (premiumSalesCard) {

                premiumSalesCard.style.transform =
                    "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
            }


            if (salesGlow) {

                salesGlow.style.left =
                    "50%";

                salesGlow.style.top =
                    "50%";
            }


            if (menuButton && mobileMenu) {

                menuButton.classList.remove(
                    "active"
                );

                mobileMenu.classList.remove(
                    "active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const currentPath =
        window.location.pathname;

    document
        .querySelectorAll(
            ".premium-nav-links a, .premium-mobile-menu a"
        )
        .forEach(link => {

            const linkPath =
                link.getAttribute("href");

            if (
                linkPath &&
                linkPath !== "#" &&
                linkPath === currentPath
            ) {

                link.classList.add(
                    "active"
                );
            }
        });


    /* =========================================================
       MOBILE TOUCH SAFETY
    ========================================================= */

    if (mobileDevice) {

        floatingCards.forEach(
            card => {

                card.style.transform =
                    "";
            }
        );

        if (premiumSalesCard) {

            premiumSalesCard.style.transform =
                "";
        }
    }


    /* =========================================================
       PAGE VISIBILITY
    ========================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            const state =
                document.hidden
                    ? "paused"
                    : "running";


            orbits.forEach(
                orbit => {

                    orbit.style.animationPlayState =
                        state;
                }
            );


            salesRings.forEach(
                ring => {

                    ring.style.animationPlayState =
                        state;
                }
            );
        }
    );


    /* =========================================================
   INITIALIZATION
========================================================= */

revealElements.forEach(
    element => {

        if (
            element.classList.contains(
                "reveal-visible"
            )
        ) {
            return;
        }

        const rect =
            element.getBoundingClientRect();

        if (
            rect.top <
            window.innerHeight * 0.88
        ) {

            element.classList.add(
                "reveal-visible"
            );
        }
    }
);


/* =========================================================
   FINAL STATUS
========================================================= */

console.log(
    "FINEXA Premium — Part 1 initialized."
);

});
/* =========================================================
   PREMIUM PART 2 — FINAL BRANDING JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const brandingSection =
        document.querySelector(
            ".premium-final-branding"
        );

    const logoWrap =
        document.querySelector(
            ".premium-final-logo-wrap"
        );

    const logo =
        document.querySelector(
            ".premium-final-logo"
        );

    const brandContent =
        document.querySelector(
            ".premium-final-brand"
        );

    const founder =
        document.querySelector(
            ".premium-founder"
        );

    const poweredBy =
        document.querySelector(
            ".premium-powered"
        );

    const finalMessage =
        document.querySelector(
            ".premium-final-message"
        );


    /* =========================================================
       MOTION SETTINGS
    ========================================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const mobileDevice =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;


    /* =========================================================
       LOGO 3D INTERACTION
    ========================================================= */

    if (
        logoWrap &&
        !reducedMotion &&
        !mobileDevice
    ) {

        logoWrap.addEventListener(
            "mousemove",
            event => {

                const rect =
                    logoWrap.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((centerY - y) / centerY) * 8;

                const rotateY =
                    ((x - centerX) / centerX) * 8;


                logoWrap.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)
                     scale(1.04)`;
            }
        );


        logoWrap.addEventListener(
            "mouseleave",
            () => {

                logoWrap.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       LOGO CLICK EFFECT
    ========================================================= */

    if (logoWrap && !reducedMotion) {

        logoWrap.addEventListener(
            "click",
            () => {

                logoWrap.classList.toggle(
                    "logo-active"
                );

                logoWrap.animate(
                    [
                        {
                            transform:
                                "scale(1)"
                        },
                        {
                            transform:
                                "scale(1.08)"
                        },
                        {
                            transform:
                                "scale(1.02)"
                        },
                        {
                            transform:
                                "scale(1)"
                        }
                    ],
                    {
                        duration: 600,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }
                );
            }
        );
    }


    /* =========================================================
       BRAND CONTENT PARALLAX
    ========================================================= */
    if (
        brandingSection &&
        brandContent &&
        !reducedMotion &&
        !mobileDevice
    ) {

        brandingSection.addEventListener(
            "mousemove",
            event => {

                const rect =
                    brandingSection.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                brandContent.style.transform =
                    `translate3d(${x * 6}px, ${y * 5}px, 0)`;
            }
        );


        brandingSection.addEventListener(
            "mouseleave",
            () => {

                brandContent.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".premium-final-branding, .premium-final-footer"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "reveal-visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-section"
                );

                revealObserver.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-visible"
                );
            }
        );
    }


    /* =========================================================
       FOUNDER HOVER
    ========================================================= */

    if (
        founder &&
        !reducedMotion
    ) {

        founder.addEventListener(
            "mouseenter",
            () => {

                founder.style.transform =
                    "translateY(-4px)";

                founder.style.transition =
                    "transform 0.4s ease";
            }
        );


        founder.addEventListener(
            "mouseleave",
            () => {

                founder.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       POWERED BY INTERACTION
    ========================================================= */

    if (
        poweredBy &&
        !reducedMotion
    ) {

        poweredBy.addEventListener(
            "mouseenter",
            () => {

                poweredBy.style.transform =
                    "translateY(-3px)";

                poweredBy.style.transition =
                    "transform 0.35s ease";
            }
        );


        poweredBy.addEventListener(
            "mouseleave",
            () => {

                poweredBy.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       FINAL MESSAGE
    ========================================================= */

    if (
        finalMessage &&
        !reducedMotion
    ) {
    finalMessage.addEventListener(
            "mouseenter",
            () => {

                finalMessage.style.transform =
                    "translateY(-3px)";

                finalMessage.style.transition =
                    "transform 0.35s ease";
            }
        );


        finalMessage.addEventListener(
            "mouseleave",
            () => {

                finalMessage.style.transform =
                    "";
            }
        );
    }


    /* =========================================================
       IMAGE LOAD SAFETY
    ========================================================= */

    if (logo) {

        logo.addEventListener(
            "error",
            () => {

                console.warn(
                    "FINEXA Premium: logo could not be loaded."
                );
            }
        );
    }


    /* =========================================================
       ESCAPE RESET
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (logoWrap) {
                logoWrap.style.transform = "";
            }

            if (brandContent) {
                brandContent.style.transform = "";
            }

            if (founder) {
                founder.style.transform = "";
            }

            if (poweredBy) {
                poweredBy.style.transform = "";
            }

            if (finalMessage) {
                finalMessage.style.transform = "";
            }
        }
    );


    /* =========================================================
       INITIAL VIEWPORT CHECK
    ========================================================= */

    revealElements.forEach(
        element => {

            const rect =
                element.getBoundingClientRect();

            if (
                rect.top <
                window.innerHeight * 0.9
            ) {

                element.classList.add(
                    "reveal-visible"
                );
            }
        }
    );


    /* =========================================================
       FINAL STATUS
    ========================================================= */

    console.log(
        "FINEXA Premium — Part 2 initialized."
    );

});
